const CONTACT_PATH = "/api/contact";
const CONFIG_PATH = "/api/contact/config";
const MAX_BODY_BYTES = 16 * 1024;
const MAX_LENGTHS = {
  name: 80,
  email: 254,
  message: 4000,
};

const jsonResponse = (payload, status = 200, extraHeaders = {}) => Response.json(payload, {
  status,
  headers: {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...extraHeaders,
  },
});

const cleanString = value => typeof value === "string" ? value.trim() : "";

const escapeHtml = value => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const readTextBody = async request => {
  if (!request.body) {
    return "";
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let body = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new RangeError("body-too-large");
    }

    body += decoder.decode(value, { stream: true });
  }

  body += decoder.decode();
  return body;
};

const parsePayload = async request => {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();

  if (contentType !== "application/json" && contentType !== "application/x-www-form-urlencoded") {
    throw new TypeError("unsupported-content-type");
  }

  const rawBody = await readTextBody(request);

  if (contentType === "application/json") {
    const payload = JSON.parse(rawBody);
    if (!payload || Array.isArray(payload) || typeof payload !== "object") {
      throw new SyntaxError("invalid-payload");
    }
    return payload;
  }

  return Object.fromEntries(new URLSearchParams(rawBody));
};

const validatePayload = payload => {
  const name = cleanString(payload.name);
  const email = cleanString(payload.email).toLowerCase();
  const message = cleanString(payload.message);
  const website = cleanString(payload.website);
  const turnstileToken = cleanString(payload["cf-turnstile-response"]);
  const errors = {};

  if (name.length < 2 || name.length > MAX_LENGTHS.name) {
    errors.name = "Please enter your name.";
  }

  if (email.length > MAX_LENGTHS.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (message.length < 10 || message.length > MAX_LENGTHS.message) {
    errors.message = "Please enter a message between 10 and 4000 characters.";
  }

  if (!turnstileToken) {
    errors.turnstile = "Please complete the security check.";
  }

  return {
    data: { name, email, message, website, turnstileToken },
    errors,
  };
};

const hashRateLimitKey = async value => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
};

const verifyTurnstile = async ({ token, remoteIp, submissionId, env }) => {
  if (!env.TURNSTILE_SECRET_KEY) {
    return { success: false, reason: "missing-secret" };
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: remoteIp || undefined,
      idempotency_key: submissionId,
    }),
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    return { success: false, reason: "siteverify-unavailable" };
  }

  const result = await response.json();
  const expectedHostnames = cleanString(env.TURNSTILE_EXPECTED_HOSTNAMES)
    .split(",")
    .map(hostname => hostname.trim())
    .filter(Boolean);
  const hostnameMatches = expectedHostnames.length === 0 || expectedHostnames.includes(result.hostname);
  const actionMatches = !result.action || result.action === "contact";

  return {
    success: result.success === true && hostnameMatches && actionMatches,
    reason: result.success === true ? "metadata-mismatch" : "challenge-failed",
  };
};

const buildEmail = ({ data, env, submissionId, receivedAt }) => {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeMessage = escapeHtml(data.message).replaceAll("\n", "<br>");
  const subjectName = data.name.replace(/[\r\n]+/g, " ").slice(0, MAX_LENGTHS.name);

  return {
    to: env.CONTACT_TO,
    from: {
      name: "Dwenn.ch contact",
      email: env.CONTACT_FROM,
    },
    replyTo: data.email,
    subject: `New project enquiry from ${subjectName}`,
    text: [
      "New contact from dwenn.ch",
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Received: ${receivedAt}`,
      `Submission: ${submissionId}`,
      "",
      "Message:",
      data.message,
    ].join("\n"),
    html: `
      <h1>New contact from dwenn.ch</h1>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
      <p><strong>Received:</strong> ${escapeHtml(receivedAt)}</p>
      <p><strong>Submission:</strong> ${escapeHtml(submissionId)}</p>
      <hr>
      <p>${safeMessage}</p>
    `,
    headers: {
      "X-Dwenn-Submission-ID": submissionId,
    },
  };
};

const handleContact = async (request, env) => {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, message: "Method not allowed." }, 405, { Allow: "POST" });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, message: "Request too large." }, 413);
  }

  let payload;
  try {
    payload = await parsePayload(request);
  } catch (error) {
    if (error instanceof RangeError) {
      return jsonResponse({ ok: false, message: "Request too large." }, 413);
    }
    if (error instanceof TypeError) {
      return jsonResponse({ ok: false, message: "Unsupported request format." }, 415);
    }
    return jsonResponse({ ok: false, message: "Invalid request." }, 400);
  }

  const { data, errors } = validatePayload(payload);

  if (data.website) {
    console.log(JSON.stringify({ event: "contact_honeypot_rejected" }));
    return jsonResponse({ ok: true, message: "Thanks — your message has been sent." });
  }

  if (Object.keys(errors).length > 0) {
    return jsonResponse({ ok: false, message: "Please check the form fields.", errors }, 422);
  }

  const remoteIp = request.headers.get("cf-connecting-ip") || "unknown";
  const rateLimitKey = await hashRateLimitKey(`contact:${remoteIp}`);
  const rateLimit = await env.CONTACT_RATE_LIMITER.limit({ key: rateLimitKey });

  if (!rateLimit.success) {
    console.warn(JSON.stringify({ event: "contact_rate_limited" }));
    return jsonResponse({ ok: false, message: "Too many messages. Please try again in a minute." }, 429, {
      "Retry-After": "60",
    });
  }

  const submissionId = crypto.randomUUID();
  let turnstileResult;

  try {
    turnstileResult = await verifyTurnstile({
      token: data.turnstileToken,
      remoteIp: remoteIp === "unknown" ? undefined : remoteIp,
      submissionId,
      env,
    });
  } catch (error) {
    console.error(JSON.stringify({
      event: "contact_turnstile_error",
      submissionId,
      error: error instanceof Error ? error.name : "UnknownError",
    }));
    return jsonResponse({ ok: false, message: "Security verification is unavailable. Please try again." }, 503);
  }

  if (!turnstileResult.success) {
    console.warn(JSON.stringify({
      event: "contact_turnstile_rejected",
      submissionId,
      reason: turnstileResult.reason,
    }));
    return jsonResponse({ ok: false, message: "Security verification failed. Please try again." }, 403);
  }

  if (!env.CONTACT_EMAIL || !env.CONTACT_TO || !env.CONTACT_FROM) {
    console.error(JSON.stringify({ event: "contact_email_not_configured", submissionId }));
    return jsonResponse({ ok: false, message: "Email delivery is not configured." }, 503);
  }

  const receivedAt = new Date().toISOString();

  try {
    const email = buildEmail({ data, env, submissionId, receivedAt });
    await env.CONTACT_EMAIL.send(email);
    console.log(JSON.stringify({ event: "contact_email_sent", submissionId }));
  } catch (error) {
    console.error(JSON.stringify({
      event: "contact_email_failed",
      submissionId,
      error: error instanceof Error ? error.name : "UnknownError",
    }));
    return jsonResponse({ ok: false, message: "Your message could not be sent. Please try again." }, 502);
  }

  return jsonResponse({ ok: true, message: "Thanks — your message has been sent." });
};

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === CONFIG_PATH) {
      if (request.method !== "GET") {
        return jsonResponse({ ok: false, message: "Method not allowed." }, 405, { Allow: "GET" });
      }

      return jsonResponse({
        configured: Boolean(env.TURNSTILE_SITE_KEY),
        siteKey: env.TURNSTILE_SITE_KEY || null,
      });
    }

    if (url.pathname === CONTACT_PATH) {
      return handleContact(request, env);
    }

    if (url.pathname.startsWith("/api/")) {
      return jsonResponse({ ok: false, message: "Not found." }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};

export { buildEmail, handleContact, worker as default };
