document.querySelectorAll(".magnet").forEach(el => {
  el.addEventListener("mousemove", e => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.18;
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
  });

  el.addEventListener("mouseleave", () => {
    el.style.setProperty("--x", "0px");
    el.style.setProperty("--y", "0px");
  });
});

let lastY = window.scrollY;
const blob = document.querySelector(".blob");
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  const diff = y - lastY;
  lastY = y;
  blob.style.setProperty("--scroll-x", `${Math.max(-34, Math.min(34, diff * .5))}px`);
  blob.style.setProperty("--scroll-y", `${Math.sin(y * .004) * 28}px`);
  blob.style.setProperty("--scroll-rotate", `${Math.sin(y * .002) * 2}deg`);
}, { passive: true });

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const submitButton = contactForm.querySelector("#contact-submit");
  const submitLabel = contactForm.querySelector(".submit-label");
  const status = contactForm.querySelector("#contact-status");
  let turnstileWidgetId = null;
  let turnstileReady = false;

  const setStatus = (message, state = "") => {
    status.textContent = message;
    status.dataset.state = state;
  };

  const resetTurnstile = () => {
    if (turnstileWidgetId !== null && window.turnstile) {
      window.turnstile.reset(turnstileWidgetId);
    }
  };

  const loadTurnstileScript = () => new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", reject, { once: true });
    document.head.append(script);
  });

  const initializeTurnstile = async () => {
    try {
      const response = await fetch("/api/contact/config", {
        headers: { Accept: "application/json" },
      });
      const config = await response.json();

      if (!response.ok || !config.siteKey) {
        throw new Error("Turnstile is not configured");
      }

      await loadTurnstileScript();
      turnstileWidgetId = window.turnstile.render("#turnstile-widget", {
        sitekey: config.siteKey,
        action: "contact",
        appearance: "interaction-only",
        size: "flexible",
        callback: () => {
          turnstileReady = true;
          submitButton.disabled = false;
          if (status.dataset.state !== "success") {
            setStatus("");
          }
        },
        "expired-callback": () => {
          turnstileReady = false;
          submitButton.disabled = true;
          setStatus("Security check expired. Please try again.", "error");
        },
        "error-callback": () => {
          turnstileReady = false;
          submitButton.disabled = true;
          setStatus("The security check could not load. Please refresh the page.", "error");
        },
      });
    } catch {
      submitButton.disabled = true;
      setStatus("The form is temporarily unavailable. Please email hello@dwenn.ch.", "error");
    }
  };

  contactForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);
    const token = formData.get("cf-turnstile-response");

    if (!turnstileReady || !token) {
      setStatus("Please complete the security check before sending.", "error");
      return;
    }

    submitButton.disabled = true;
    submitLabel.textContent = "Sending…";
    setStatus("Sending your message…");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Unable to send your message.");
      }

      contactForm.reset();
      turnstileReady = false;
      setStatus(result.message, "success");
    } catch (error) {
      turnstileReady = false;
      setStatus(error.message || "Unable to send your message. Please try again.", "error");
    } finally {
      submitLabel.textContent = "Send";
      resetTurnstile();
    }
  });

  initializeTurnstile();
}
