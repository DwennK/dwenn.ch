export function initSite() {
  const button = document.querySelector<HTMLButtonElement>('.menu-toggle');
  const nav = document.querySelector<HTMLElement>('.mobile-nav');
  const setOpen = (open: boolean) => {
    button?.setAttribute('aria-expanded', String(open));
    if(button) button.setAttribute('aria-label', (open ? button.dataset.closeLabel : button.dataset.openLabel) || 'Menu');
    if (nav) nav.inert = !open;
    document.body.classList.toggle('menu-open', open);
  };
  button?.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-open')) { setOpen(false); button?.focus(); }
    if (event.key === 'Tab' && document.body.classList.contains('menu-open')) {
      const items = [button, ...Array.from(nav?.querySelectorAll<HTMLAnchorElement>('a') ?? [])].filter(Boolean) as HTMLElement[];
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('pageshow', () => setOpen(false));
  window.matchMedia('(min-width: 801px)').addEventListener('change', e => { if(e.matches) setOpen(false); });
}
