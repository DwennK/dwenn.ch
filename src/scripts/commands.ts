function initHomeCommands() {
  const dialog = document.querySelector<HTMLDialogElement>('#homecommands');
  if (!dialog || dialog.dataset.commandReady === 'true') return;
  dialog.dataset.commandReady = 'true';

  const search = dialog.querySelector<HTMLInputElement>('#homecommands-search')!;
  const results = dialog.querySelector<HTMLUListElement>('#homecommands-results')!;
  const empty = dialog.querySelector<HTMLElement>('[data-command-empty]')!;
  const count = dialog.querySelector<HTMLElement>('[data-command-count]')!;
  const closeButton = dialog.querySelector<HTMLButtonElement>('[data-command-close]')!;
  const rows = Array.from(dialog.querySelectorAll<HTMLElement>('[data-command-row]'));
  const options = rows.map(row => row.querySelector<HTMLAnchorElement>('[data-command-option]')!);
  const fr = dialog.dataset.commandLanguage === 'fr';
  const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
  let visible = options.slice();
  let activeIndex = 0;
  let returnFocus: HTMLElement | null = null;
  let previousOverflow = '';
  let scrollLocked = false;

  document.querySelectorAll<HTMLElement>('[data-command-key]').forEach(key => { key.textContent = isMac ? '⌘ K' : 'Ctrl K'; });
  document.querySelectorAll<HTMLElement>('[data-command-open]').forEach(trigger => { trigger.setAttribute('aria-keyshortcuts', isMac ? 'Meta+K' : 'Control+K'); });

  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’']/g, '').trim();
  const select = (index: number, scroll = true) => {
    activeIndex = visible.length ? ((index % visible.length) + visible.length) % visible.length : -1;
    options.forEach(option => option.setAttribute('aria-selected', String(option === visible[activeIndex])));
    const active = visible[activeIndex];
    if (active) {
      search.setAttribute('aria-activedescendant', active.id);
      if (scroll) active.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    } else search.removeAttribute('aria-activedescendant');
  };
  const filter = () => {
    const terms = normalize(search.value).split(/\s+/).filter(Boolean);
    rows.forEach(row => { row.hidden = !terms.every(term => normalize(row.dataset.commandSearch || '').includes(term)); });
    visible = options.filter(option => !option.closest<HTMLElement>('[data-command-row]')!.hidden);
    empty.hidden = visible.length > 0;
    count.textContent = fr ? `${visible.length} résultat${visible.length === 1 ? '' : 's'}` : `${visible.length} result${visible.length === 1 ? '' : 's'}`;
    select(0, false);
    results.parentElement!.scrollTop = 0;
  };
  const restoreScroll = () => {
    if (scrollLocked) {
      document.documentElement.style.overflow = previousOverflow;
      scrollLocked = false;
    }
  };
  const close = () => { if (dialog.open) dialog.close(); };
  const anotherDialogIsOpen = () => Boolean(document.querySelector('dialog[open]:not(#homecommands)'));
  const open = (trigger?: HTMLElement) => {
    if (dialog.open) { close(); return; }
    if (anotherDialogIsOpen()) return;
    returnFocus = trigger || (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    search.value = '';
    filter();
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    scrollLocked = true;
    dialog.showModal();
    search.setAttribute('aria-expanded', 'true');
    search.focus({ preventScroll: true });
  };

  const onTriggerClick = (event: MouseEvent) => {
    const trigger = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-command-open]') : null;
    if (!trigger) return;
    event.preventDefault();
    open(trigger);
  };
  const onShortcut = (event: KeyboardEvent) => {
    if (event.defaultPrevented || event.isComposing || event.altKey || event.shiftKey || !(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return;
    const target = event.target instanceof Element ? event.target : null;
    const editing = target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
    if (editing && !dialog.contains(editing)) return;
    if (!dialog.open && anotherDialogIsOpen()) return;
    event.preventDefault();
    if (dialog.open) close(); else open();
  };
  const cleanup = () => {
    close();
    restoreScroll();
    document.removeEventListener('click', onTriggerClick);
    document.removeEventListener('keydown', onShortcut);
  };

  search.addEventListener('input', filter);
  closeButton.addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('close', () => {
    restoreScroll();
    search.setAttribute('aria-expanded', 'false');
    if (returnFocus?.isConnected && returnFocus !== document.body) returnFocus.focus({ preventScroll: true });
    else document.querySelector<HTMLElement>('[data-command-open]')?.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
  });
  dialog.addEventListener('keydown', event => {
    if (event.isComposing || event.altKey || event.metaKey || event.ctrlKey) return;
    if (event.key === 'Tab') {
      const focusable: HTMLElement[] = [closeButton, search];
      const current = focusable.indexOf(document.activeElement as HTMLElement);
      const next = current === -1 ? (event.shiftKey ? focusable.length - 1 : 0)
        : (current + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
      event.preventDefault();
      focusable[next].focus({ preventScroll: true });
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      select(activeIndex + (event.key === 'ArrowDown' ? 1 : -1));
      search.focus({ preventScroll: true });
    } else if (event.key === 'Enter' && (event.target === search || results.contains(event.target as Node))) {
      event.preventDefault();
      visible[activeIndex]?.click();
    }
  });
  options.forEach(option => {
    option.addEventListener('pointerenter', () => select(visible.indexOf(option), false));
    option.addEventListener('click', close);
  });
  document.addEventListener('click', onTriggerClick);
  document.addEventListener('keydown', onShortcut);
  document.addEventListener('astro:before-swap', cleanup, { once: true });
}

initHomeCommands();
document.addEventListener('astro:page-load', initHomeCommands);

export {};
