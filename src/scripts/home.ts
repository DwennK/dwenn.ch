import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Flip from 'gsap/Flip';
gsap.registerPlugin(ScrollTrigger, Flip);

export function initHome() {
  const root = document.querySelector<HTMLElement>('.developer-home');
  if (!root || root.dataset.homeReady) return;
  root.dataset.homeReady = 'true';
  const lifecycle = new AbortController();
  const signal = lifecycle.signal;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const consoleElement = root.querySelector<HTMLElement>('[data-project-console]')!;
  const anchor = root.querySelector<HTMLElement>('[data-workspace-anchor]')!;
  const hint = root.querySelector<HTMLElement>('.workspace-hint')!;
  const dialog = root.querySelector<HTMLDialogElement>('#workspace-dialog')!;
  const mount = root.querySelector<HTMLElement>('[data-workspace-mount]')!;
  let lastFocus: HTMLElement | null = null;
  let previousOverflow = '';
  let flip: gsap.core.Timeline | undefined;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const mm = gsap.matchMedia();

  const sourceLayout = window.matchMedia('(min-width: 801px)');
  const updateSourceOrientation = () => root.querySelectorAll('.inspector-file-list').forEach(list => {
    list.setAttribute('aria-orientation', sourceLayout.matches ? 'vertical' : 'horizontal');
  });
  updateSourceOrientation();
  sourceLayout.addEventListener('change', updateSourceOrientation, { signal });
  const refresh = () => ScrollTrigger.refresh();
  const reveal = (element: HTMLElement) => {
    if (!reduced.matches) gsap.fromTo(element, { opacity: .3, y: 8 }, {
      opacity: 1, y: 0, duration: .3, ease: 'power2.out', clearProps: 'opacity,transform', overwrite: true,
    });
    refresh();
  };
  // Each nested tablist keeps its own focus and arrow-key behavior.
  const bindTabs = (tabs: HTMLButtonElement[], activate: (index: number) => void) => {
    const select = (index: number, focus = false) => {
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        tab.classList.toggle('is-active', i === index);
      });
      activate(index);
      if (focus) tabs[index].focus({ preventScroll: true });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index), { signal });
      tab.addEventListener('keydown', event => {
        let next = index;
        const vertical = tab.closest('[role=tablist]')?.getAttribute('aria-orientation') === 'vertical';
        if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % tabs.length;
        else if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        event.stopPropagation();
        select(next, true);
      }, { signal });
    });
    return select;
  };
  const panels = [...root.querySelectorAll<HTMLElement>('[data-project-panel]')];
  const projectTabs = [...root.querySelectorAll<HTMLButtonElement>('[data-project-tab]')];
  bindTabs(projectTabs, index => {
    const changed = panels[index].hidden;
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    root.querySelector('[data-project-count]')!.textContent = String(index + 1).padStart(2, '0');
    if (changed) reveal(panels[index]);
  });
  panels.forEach(panel => {
    const views = [...panel.querySelectorAll<HTMLElement>('[data-console-view]')];
    const modes = [...panel.querySelectorAll<HTMLButtonElement>('[data-console-mode]')];
    const selectMode = bindTabs(modes, index => {
      const changed = views[index].hidden;
      views.forEach((view, i) => { view.hidden = i !== index; });
      if (changed) reveal(views[index]);
    });
    const sources = [...panel.querySelectorAll<HTMLElement>('[data-inspector-panel]')];
    const sourceTabs = [...panel.querySelectorAll<HTMLButtonElement>('[data-inspector-tab]')];
    const selectSource = bindTabs(sourceTabs, index => {
      const changed = sources[index].hidden;
      sources.forEach((source, i) => { source.hidden = i !== index; });
      if (changed) reveal(sources[index]);
    });
    panel.querySelectorAll<HTMLButtonElement>('[data-open-source]').forEach(button => {
      button.addEventListener('click', () => {
        selectMode(modes.findIndex(mode => mode.dataset.consoleMode === 'code'));
        selectSource(Number(button.dataset.openSource), true);
      }, { signal });
    });
  });
  root.querySelectorAll<HTMLButtonElement>('[data-copy-code]').forEach(button => {
    const original = button.textContent;
    button.addEventListener('click', async () => {
      const code = button.closest('[data-inspector-panel]')?.querySelector('code')?.textContent;
      if (!code) return;
      const status = button.closest('[data-inspector-panel]')!.querySelector<HTMLElement>('[data-copy-status]')!;
      const fr = document.documentElement.lang === 'fr';
      status.textContent = '';
      try {
        await navigator.clipboard.writeText(code);
        if (signal.aborted) return;
        button.textContent = button.dataset.copied!;
        status.textContent = fr ? 'Extrait copié dans le presse-papiers.' : 'Code excerpt copied to the clipboard.';
      } catch {
        button.textContent = fr ? 'À sélectionner' : 'Select to copy';
        status.textContent = fr ? 'Copie indisponible. Vous pouvez sélectionner l’extrait.' : 'Copy unavailable. You can select the code excerpt.';
      }
      const timer = setTimeout(() => { button.textContent = original; timers.delete(timer); }, 1800);
      timers.add(timer);
    }, { signal });
  });

  const collapse = (animate = true) => {
    if (!consoleElement.classList.contains('workspace-expanded')) return;
    flip?.kill();
    const state = Flip.getState(consoleElement);
    consoleElement.classList.remove('workspace-expanded');
    anchor.insertBefore(consoleElement, hint);
    anchor.style.height = '';
    document.body.style.overflow = previousOverflow;
    dialog.close();
    if (animate && !reduced.matches) flip = Flip.from(state, { duration: .55, ease: 'power3.inOut', scale: true, onComplete: refresh });
    else gsap.set(consoleElement, { clearProps: 'transform,width,height' });
    lastFocus?.focus({ preventScroll: true });
    refresh();
  };
  const expand = () => {
    if (dialog.open || document.querySelector('dialog[open]')) return;
    lastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    flip?.kill();
    gsap.killTweensOf(consoleElement);
    gsap.set(consoleElement, { clearProps: 'transform' });
    const state = Flip.getState(consoleElement);
    anchor.style.height = `${anchor.getBoundingClientRect().height}px`;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    mount.append(consoleElement);
    consoleElement.classList.add('workspace-expanded');
    dialog.showModal();
    dialog.scrollTop = 0;
    if (!reduced.matches) flip = Flip.from(state, { duration: .6, ease: 'power3.inOut', scale: true, onComplete: refresh });
    dialog.querySelector<HTMLButtonElement>('[data-workspace-close]')!.focus({ preventScroll: true });
    refresh();
  };
  root.querySelector('[data-workspace-expand]')!.addEventListener('click', expand, { signal });
  root.querySelector('[data-workspace-close]')!.addEventListener('click', () => collapse(), { signal });
  dialog.addEventListener('cancel', event => { event.preventDefault(); collapse(); }, { signal });
  dialog.addEventListener('close', () => collapse(false), { signal });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) collapse();
  }, { signal });
  root.querySelectorAll<HTMLDetailsElement>('.home-capabilities details').forEach(details => {
    details.addEventListener('toggle', () => {
      if (details.open && !reduced.matches) gsap.fromTo(details.querySelector('div'), { opacity: 0, y: -5 }, { opacity: 1, y: 0, duration: .3, clearProps: 'opacity,transform' });
      refresh();
    }, { signal });
  });

  mm.add({ desktop: '(min-width: 801px)', motion: '(prefers-reduced-motion: no-preference)', fine: '(hover: hover) and (pointer: fine)' }, context => {
    if (!context.conditions?.motion) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(root.querySelector('.home-intro-line'), { y: 12, opacity: 0, duration: .55 })
      .from(root.querySelectorAll('.title-letter'), { yPercent: 105, rotationX: -60, opacity: 0, stagger: .045, duration: .95, clearProps: 'transform,opacity' }, .08)
      .from(root.querySelector('.home-introduction'), { y: 25, opacity: 0, duration: .8, clearProps: 'transform,opacity' }, .35)
      .from(consoleElement, { y: 65, rotationX: 7, opacity: 0, duration: 1, clearProps: 'transform,opacity' }, .45);
    if (context.conditions.desktop) {
      gsap.to(root.querySelector('.home-title'), { x: -45, ease: 'none', scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: .6 } });
      gsap.from(root.querySelector('.home-portrait img'), { scale: 1.16, ease: 'none', scrollTrigger: { trigger: '.home-person', start: 'top bottom', end: 'center center', scrub: .7 } });
    }
    if (context.conditions.fine) {
      const rotateX = gsap.quickTo(consoleElement, 'rotationX', { duration: .65, ease: 'power3.out' });
      const rotateY = gsap.quickTo(consoleElement, 'rotationY', { duration: .65, ease: 'power3.out' });
      const move = (event: PointerEvent) => {
        if (dialog.open || tl.isActive()) return;
        const rect = anchor.getBoundingClientRect();
        rotateX((.5 - (event.clientY - rect.top) / rect.height) * 2);
        rotateY(((event.clientX - rect.left) / rect.width - .5) * 2.5);
      };
      const leave = () => { if (!dialog.open) { rotateX(0); rotateY(0); } };
      anchor.addEventListener('pointermove', move);
      anchor.addEventListener('pointerleave', leave);
      return () => { anchor.removeEventListener('pointermove', move); anchor.removeEventListener('pointerleave', leave); };
    }
  });
  const teardown = () => {
    collapse(false);
    flip?.kill();
    mm.revert();
    lifecycle.abort();
    timers.forEach(clearTimeout);
    delete root.dataset.homeReady;
  };
  window.addEventListener('pagehide', teardown, { once: true, signal });
}
window.addEventListener('pageshow', event => { if (event.persisted) initHome(); });
