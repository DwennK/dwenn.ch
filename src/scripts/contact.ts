type ContactLanguage = 'fr' | 'en';
type FieldName = 'name' | 'email' | 'message';
type ContactField = HTMLInputElement | HTMLTextAreaElement;
interface TurnstileOptions {
  sitekey: string;
  action: string;
  appearance: string;
  size: string;
  language: ContactLanguage;
  theme: string;
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
  'timeout-callback': () => void;
}
interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
}
declare global {
  interface Window { turnstile?: TurnstileApi; __dwennTurnstileLoad?: Promise<void> }
}

const messages = {
  fr: {
    send: 'Envoyer mon message', sending: 'Envoi en cours…',
    loading: 'Vérification de sécurité en cours…',
    unavailable: 'Le formulaire est momentanément indisponible. Vous pouvez m’écrire à hello@dwenn.ch.',
    security: 'Veuillez terminer la vérification de sécurité avant d’envoyer votre message.',
    expired: 'La vérification a expiré. Une nouvelle vérification est nécessaire.',
    securityError: 'La vérification de sécurité n’a pas abouti. Réessayez ou écrivez-moi à hello@dwenn.ch.',
    invalid: 'Vérifiez les champs indiqués avant de continuer.',
    name: 'Indiquez un nom de 2 à 80 caractères.',
    email: 'Indiquez une adresse e-mail valide.',
    message: 'Écrivez un message de 10 à 4 000 caractères.',
    rate: 'Trop de tentatives. Veuillez patienter une minute avant de réessayer.',
    failed: 'Votre message n’a pas pu être envoyé. Réessayez ou écrivez-moi à hello@dwenn.ch.',
    unknown: 'Je n’ai pas pu confirmer l’envoi. Pour éviter un doublon, écrivez-moi à hello@dwenn.ch.',
    success: 'Merci, votre message a bien été envoyé. Je vous répondrai par e-mail.',
  },
  en: {
    send: 'Send my message', sending: 'Sending…',
    loading: 'Running the security check…',
    unavailable: 'The form is temporarily unavailable. You can email me at hello@dwenn.ch.',
    security: 'Please complete the security check before sending your message.',
    expired: 'The security check has expired. A new check is needed.',
    securityError: 'The security check could not be completed. Try again or email hello@dwenn.ch.',
    invalid: 'Please check the highlighted fields before continuing.',
    name: 'Enter a name between 2 and 80 characters.',
    email: 'Enter a valid email address.',
    message: 'Write a message between 10 and 4,000 characters.',
    rate: 'Too many attempts. Please wait a minute before trying again.',
    failed: 'Your message could not be sent. Try again or email hello@dwenn.ch.',
    unknown: 'I could not confirm the message was sent. To avoid a duplicate, please email hello@dwenn.ch.',
    success: 'Thank you, your message has been sent. I will reply by email.',
  },
};

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (window.__dwennTurnstileLoad) return window.__dwennTurnstileLoad;
  window.__dwennTurnstileLoad = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    const timer = window.setTimeout(() => { script.remove(); reject(new Error('turnstile-timeout')); }, 12000);
    script.addEventListener('load', () => { window.clearTimeout(timer); resolve(); }, { once: true });
    script.addEventListener('error', () => { window.clearTimeout(timer); script.remove(); reject(new Error('turnstile-unavailable')); }, { once: true });
    document.head.append(script);
  }).catch(error => { window.__dwennTurnstileLoad = undefined; throw error; });
  return window.__dwennTurnstileLoad;
}

function initializeContactForm() {
  const form = document.querySelector<HTMLFormElement>('#contact-form');
  if (!form || form.dataset.initialized === 'true') return;
  form.dataset.initialized = 'true';
  const lang: ContactLanguage = form.dataset.language === 'en' ? 'en' : 'fr';
  const copy = messages[lang];
  const submit = form.querySelector<HTMLButtonElement>('#contact-submit')!;
  const label = form.querySelector<HTMLElement>('.submit-label')!;
  const status = form.querySelector<HTMLElement>('#contact-status')!;
  const retry = form.querySelector<HTMLButtonElement>('#contact-retry')!;
  const widget = form.querySelector<HTMLElement>('#turnstile-widget')!;
  const fieldNames: FieldName[] = ['name', 'email', 'message'];
  let token = '';
  let widgetId: string | null = null;
  let sending = false;
  let initializing = false;
  let destroyed = false;

  const setStatus = (text: string, state = '') => {
    status.textContent = text;
    status.dataset.state = state;
  };
  const setFieldError = (name: FieldName, text: string) => {
    const field = form.elements.namedItem(name) as ContactField;
    field.setAttribute('aria-invalid', text ? 'true' : 'false');
    field.setCustomValidity(text);
    const error = form.querySelector<HTMLElement>(`#contact-${name}-error`)!;
    error.textContent = text;
  };
  const validateFields = () => {
    let firstInvalid: ContactField | null = null;
    for (const name of fieldNames) {
      const field = form.elements.namedItem(name) as ContactField;
      const value = field.value.trim();
      const valid = name === 'name' ? value.length >= 2 && value.length <= 80
        : name === 'email' ? value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        : value.length >= 10 && value.length <= 4000;
      setFieldError(name, valid ? '' : copy[name]);
      if (!valid && !firstInvalid) firstInvalid = field;
    }
    if (firstInvalid) {
      setStatus(copy.invalid, 'error');
      firstInvalid.focus();
      return false;
    }
    return true;
  };
  const securityFailure = (text: string) => {
    token = '';
    submit.disabled = true;
    retry.hidden = false;
    if (!sending) setStatus(text, 'error');
  };

  const initializeSecurity = async () => {
    if (initializing || sending || destroyed) return;
    initializing = true;
    token = '';
    submit.disabled = true;
    retry.hidden = true;
    setStatus(copy.loading, 'loading');
    try {
      const response = await fetch('/api/contact/config', { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(12000) });
      const config = await response.json();
      if (!response.ok || !config.siteKey) throw new Error('contact-unavailable');
      await loadTurnstile();
      if (destroyed) return;
      if (!window.turnstile) throw new Error('turnstile-unavailable');
      if (widgetId !== null) window.turnstile.remove(widgetId);
      widgetId = window.turnstile.render(widget, {
        sitekey: config.siteKey,
        action: 'contact',
        appearance: 'interaction-only',
        size: 'flexible',
        language: lang,
        theme: 'light',
        callback: value => {
          token = value;
          submit.disabled = sending;
          retry.hidden = true;
          if (status.dataset.state === 'loading' || status.textContent === copy.expired || status.textContent === copy.securityError) setStatus('');
        },
        'expired-callback': () => securityFailure(copy.expired),
        'error-callback': () => securityFailure(copy.securityError),
        'timeout-callback': () => securityFailure(copy.expired),
      });
    } catch {
      if (!destroyed) securityFailure(copy.unavailable);
    } finally { initializing = false; }
  };

  for (const name of fieldNames) {
    const field = form.elements.namedItem(name) as ContactField;
    field.addEventListener('input', () => setFieldError(name, ''));
  }
  retry.addEventListener('click', initializeSecurity);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !validateFields()) return;
    if (!token) { setStatus(copy.security, 'error'); return; }
    sending = true;
    submit.disabled = true;
    form.setAttribute('aria-busy', 'true');
    label.textContent = copy.sending;
    setStatus(copy.sending, 'loading');
    const payload = Object.fromEntries(new FormData(form).entries());
    payload['cf-turnstile-response'] = token;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (destroyed) return;
      if (response.ok && result.ok === true) {
        form.reset();
        setStatus(copy.success, 'success');
      } else if (response.status === 422) {
        for (const name of fieldNames) if (result.errors?.[name]) setFieldError(name, copy[name]);
        const invalidField = form.querySelector<ContactField>('[aria-invalid="true"]');
        invalidField?.focus();
        setStatus(result.errors?.turnstile ? copy.securityError : copy.invalid, 'error');
      } else {
        const text = response.status === 429 ? copy.rate
          : response.status === 403 ? copy.securityError
          : response.status === 503 ? copy.unavailable : copy.failed;
        setStatus(text, 'error');
      }
    } catch { if (!destroyed) setStatus(copy.unknown, 'error'); }
    finally {
      token = '';
      sending = false;
      form.removeAttribute('aria-busy');
      label.textContent = copy.send;
      submit.disabled = true;
      if (!destroyed && widgetId !== null && window.turnstile) window.turnstile.reset(widgetId);
    }
  });
  document.addEventListener('astro:before-swap', () => {
    destroyed = true;
    if (widgetId !== null && window.turnstile) window.turnstile.remove(widgetId);
  }, { once: true });
  void initializeSecurity();
}

initializeContactForm();
document.addEventListener('astro:page-load', initializeContactForm);

export {};
