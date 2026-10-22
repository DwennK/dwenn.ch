import assert from "node:assert/strict";
import test from "node:test";
import worker from "../worker.mjs";

// All service bindings and Turnstile requests are local doubles. This suite must
// never use the live mail binding, secret, or Turnstile service.
const originalFetch = globalThis.fetch;
const payload = {
  name: "Demo Visitor",
  email: "visitor@example.com",
  message: "This is a simulated contact form submission.",
  website: "",
  "cf-turnstile-response": "local-test-token",
};

function harness(overrides = {}) {
  const sent = [];
  const rateKeys = [];
  const env = {
    ASSETS: { fetch: async () => new Response("local asset") },
    CONTACT_EMAIL: { send: async email => { sent.push(email); } },
    CONTACT_RATE_LIMITER: { limit: async ({ key }) => { rateKeys.push(key); return { success: true }; } },
    CONTACT_TO: "owner@example.com",
    CONTACT_FROM: "contact@example.com",
    TURNSTILE_SITE_KEY: "local-test-site-key",
    TURNSTILE_SECRET_KEY: "local-test-secret",
    TURNSTILE_EXPECTED_HOSTNAMES: "dwenn.ch,www.dwenn.ch",
    ...overrides,
  };
  return { env, sent, rateKeys };
}

function request(data = payload, headers = {}) {
  return new Request("https://dwenn.ch/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.42", ...headers },
    body: JSON.stringify(data),
  });
}

function validChallenge(result = {}) {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
    assert.equal(options.method, "POST");
    return Response.json({ success: true, hostname: "dwenn.ch", action: "contact", ...result });
  };
}

test.beforeEach(() => {
  globalThis.fetch = async () => { throw new Error("Unexpected external request in offline test"); };
});

test.afterEach(() => { globalThis.fetch = originalFetch; });

test("reports unavailable public configuration without a site key", async () => {
  const { env } = harness({ TURNSTILE_SITE_KEY: undefined });
  const response = await worker.fetch(new Request("https://dwenn.ch/api/contact/config"), env);
  assert.deepEqual(await response.json(), { configured: false, siteKey: null });
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("keeps API methods restricted and unknown API routes out of assets", async () => {
  let assetCalls = 0;
  const { env } = harness({ ASSETS: { fetch: async () => { assetCalls += 1; return new Response("asset"); } } });
  const contact = await worker.fetch(new Request("https://dwenn.ch/api/contact"), env);
  assert.equal(contact.status, 405);
  assert.equal(contact.headers.get("allow"), "POST");
  const config = await worker.fetch(new Request("https://dwenn.ch/api/contact/config", { method: "POST" }), env);
  assert.equal(config.status, 405);
  assert.equal(config.headers.get("allow"), "GET");
  const unknown = await worker.fetch(new Request("https://dwenn.ch/api/missing"), env);
  assert.equal(unknown.status, 404);
  assert.equal(assetCalls, 0);
});

test("forwards a non-API request intact to the existing assets binding", async () => {
  const incoming = new Request("https://dwenn.ch/en/contact/?from=about");
  let forwarded;
  const { env } = harness({ ASSETS: { fetch: async req => { forwarded = req; return new Response("page"); } } });
  const response = await worker.fetch(incoming, env);
  assert.equal(forwarded, incoming);
  assert.equal(await response.text(), "page");
});

test("rejects an unrelated Turnstile hostname before sending email", async () => {
  validChallenge({ hostname: "other.example" });
  const { env, sent } = harness();
  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 403);
  assert.equal((await response.json()).ok, false);
  assert.equal(sent.length, 0);
});

test("rejects a Turnstile action from another form before sending email", async () => {
  validChallenge({ action: "login" });
  const { env, sent } = harness();
  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 403);
  assert.equal(sent.length, 0);
});

test("accepts the configured www hostname and passes verification metadata", async () => {
  let verification;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
    verification = JSON.parse(options.body);
    return Response.json({ success: true, hostname: "www.dwenn.ch", action: "contact" });
  };
  const { env, sent, rateKeys } = harness();
  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 200);
  assert.equal(sent.length, 1);
  assert.equal(verification.secret, "local-test-secret");
  assert.equal(verification.response, "local-test-token");
  assert.equal(verification.remoteip, "203.0.113.42");
  assert.match(verification.idempotency_key, /^[0-9a-f-]{36}$/);
  assert.equal(sent[0].headers["X-Dwenn-Submission-ID"], verification.idempotency_key);
  assert.match(rateKeys[0], /^[0-9a-f]{64}$/);
  assert.equal(rateKeys[0].includes("203.0.113.42"), false);
});

test("returns an unavailable response when Turnstile verification throws", async () => {
  globalThis.fetch = async () => { throw new TypeError("Simulated network failure"); };
  const { env, sent } = harness();
  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
  assert.equal(sent.length, 0);
});

test("never sends when Turnstile returns an unsuccessful HTTP response", async () => {
  globalThis.fetch = async () => new Response("Unavailable", { status: 503 });
  const { env, sent } = harness();
  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 403);
  assert.equal((await response.json()).ok, false);
  assert.equal(sent.length, 0);
});

test("does not report success when the mail binding rejects delivery", async () => {
  validChallenge();
  let attempted = 0;
  const { env } = harness({ CONTACT_EMAIL: { send: async () => { attempted += 1; throw new Error("Simulated mail failure"); } } });
  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 502);
  assert.equal((await response.json()).ok, false);
  assert.equal(attempted, 1);
});

test("returns unavailable when the mail binding is absent", async () => {
  validChallenge();
  const { env, sent } = harness({ CONTACT_EMAIL: undefined });
  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
  assert.equal(sent.length, 0);
});

test("rejects unsupported formats and malformed JSON without invoking services", async () => {
  const { env, sent, rateKeys } = harness();
  for (const [body, contentType, expected] of [
    ["plain text", "text/plain", 415],
    ["{", "application/json", 400],
    ["null", "application/json", 400],
    ["[]", "application/json", 400],
  ]) {
    const incoming = new Request("https://dwenn.ch/api/contact", { method: "POST", headers: { "Content-Type": contentType }, body });
    const response = await worker.fetch(incoming, env);
    assert.equal(response.status, expected);
    assert.equal((await response.json()).ok, false);
  }
  assert.equal(sent.length, 0);
  assert.equal(rateKeys.length, 0);
});

test("enforces body size on both declared length and actual streamed bytes", async () => {
  const { env, sent, rateKeys } = harness();
  const declared = await worker.fetch(request(payload, { "Content-Length": "20000" }), env);
  assert.equal(declared.status, 413);
  const oversized = await worker.fetch(request({ ...payload, message: "x".repeat(17000) }), env);
  assert.equal(oversized.status, 413);
  const multibyte = await worker.fetch(request({ ...payload, message: "界".repeat(6000) }), env);
  assert.equal(multibyte.status, 413);
  assert.equal(sent.length, 0);
  assert.equal(rateKeys.length, 0);
});

test("keeps the URL-encoded contract and normalizes contact fields", async () => {
  validChallenge();
  const { env, sent } = harness();
  const incoming = new Request("https://dwenn.ch/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    body: new URLSearchParams({ ...payload, name: "  Demo Visitor  ", email: "  VISITOR@EXAMPLE.COM  ", message: "  A meaningful message for the local test.  " }),
  });
  const response = await worker.fetch(incoming, env);
  assert.equal(response.status, 200);
  assert.equal(sent[0].replyTo, "visitor@example.com");
  assert.equal(sent[0].subject, "New project enquiry from Demo Visitor");
  assert.ok(sent[0].text.endsWith("A meaningful message for the local test."));
});

test("escapes user content in HTML mail and strips subject line breaks", async () => {
  validChallenge();
  const { env, sent } = harness();
  const response = await worker.fetch(request({
    ...payload,
    name: "<Demo>\r\nSecond line",
    message: "<script>alert('demo')</script> & a second line\nThank you.",
  }), env);
  assert.equal(response.status, 200);
  assert.equal(sent.length, 1);
  assert.equal(/[\r\n]/.test(sent[0].subject), false);
  assert.equal(sent[0].html.includes("<script>"), false);
  assert.ok(sent[0].html.includes("&lt;script&gt;alert(&#039;demo&#039;)&lt;/script&gt; &amp; a second line<br>Thank you."));
  assert.ok(sent[0].html.includes("&lt;Demo&gt;"));
  assert.ok(sent[0].text.includes("<script>alert('demo')</script>"));
});
