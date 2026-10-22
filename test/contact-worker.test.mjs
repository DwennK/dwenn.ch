import assert from "node:assert/strict";
import test from "node:test";
import worker from "../worker.mjs";

const originalFetch = globalThis.fetch;

const validPayload = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "I would like to discuss a new website project.",
  website: "",
  "cf-turnstile-response": "valid-token",
};

const makeEnv = overrides => {
  const sent = [];
  return {
    env: {
      ASSETS: { fetch: async () => new Response("asset") },
      CONTACT_EMAIL: { send: async email => sent.push(email) },
      CONTACT_RATE_LIMITER: { limit: async () => ({ success: true }) },
      CONTACT_TO: "dwenn@live.fr",
      CONTACT_FROM: "contact@dwenn.ch",
      TURNSTILE_SITE_KEY: "test-site-key",
      TURNSTILE_SECRET_KEY: "test-secret-key",
      TURNSTILE_EXPECTED_HOSTNAMES: "dwenn.ch,www.dwenn.ch",
      ...overrides,
    },
    sent,
  };
};

const contactRequest = payload => new Request("https://dwenn.ch/api/contact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "CF-Connecting-IP": "203.0.113.10",
  },
  body: JSON.stringify(payload),
});

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("returns the public Turnstile configuration without exposing the secret", async () => {
  const { env } = makeEnv();
  const response = await worker.fetch(new Request("https://dwenn.ch/api/contact/config"), env);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body, { configured: true, siteKey: "test-site-key" });
  assert.equal(JSON.stringify(body).includes("secret"), false);
});

test("sends a validated contact email to the configured address", async () => {
  globalThis.fetch = async () => Response.json({
    success: true,
    hostname: "dwenn.ch",
    action: "contact",
  });
  const { env, sent } = makeEnv();
  const response = await worker.fetch(contactRequest(validPayload), env);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, "dwenn@live.fr");
  assert.equal(sent[0].replyTo, "ada@example.com");
  assert.equal(sent[0].from.email, "contact@dwenn.ch");
});

test("silently accepts honeypot submissions without rate limiting or sending", async () => {
  let rateLimitCalls = 0;
  const { env, sent } = makeEnv({
    CONTACT_RATE_LIMITER: {
      limit: async () => {
        rateLimitCalls += 1;
        return { success: true };
      },
    },
  });
  const response = await worker.fetch(contactRequest({ ...validPayload, website: "spam.example" }), env);

  assert.equal(response.status, 200);
  assert.equal(rateLimitCalls, 0);
  assert.equal(sent.length, 0);
});

test("returns 429 when the Cloudflare rate limiter rejects the request", async () => {
  const { env, sent } = makeEnv({
    CONTACT_RATE_LIMITER: { limit: async () => ({ success: false }) },
  });
  const response = await worker.fetch(contactRequest(validPayload), env);

  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "60");
  assert.equal(sent.length, 0);
});

test("rejects invalid Turnstile challenges", async () => {
  globalThis.fetch = async () => Response.json({ success: false, "error-codes": ["invalid-input-response"] });
  const { env, sent } = makeEnv();
  const response = await worker.fetch(contactRequest(validPayload), env);

  assert.equal(response.status, 403);
  assert.equal(sent.length, 0);
});

test("returns field errors before invoking Cloudflare services", async () => {
  let rateLimitCalls = 0;
  const { env, sent } = makeEnv({
    CONTACT_RATE_LIMITER: {
      limit: async () => {
        rateLimitCalls += 1;
        return { success: true };
      },
    },
  });
  const response = await worker.fetch(contactRequest({ ...validPayload, email: "invalid" }), env);
  const body = await response.json();

  assert.equal(response.status, 422);
  assert.equal(body.errors.email, "Please enter a valid email address.");
  assert.equal(rateLimitCalls, 0);
  assert.equal(sent.length, 0);
});
