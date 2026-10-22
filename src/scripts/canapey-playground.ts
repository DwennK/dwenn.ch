import { navigate, backgroundFor, type Action, type Theme } from '../lib/canapey-navigation';

const cleanups: (() => void)[] = [];

export function initCanapeyPlaygrounds() {
  document.querySelectorAll<HTMLElement>('[data-canapey-playground]').forEach(root => {
    if (root.dataset.pgReady) return;
    root.dataset.pgReady = 'true';
    const fr = root.dataset.lang === 'fr';
    const cards = [...root.querySelectorAll<HTMLButtonElement>('[data-pg-card]')];
    const track = root.querySelector<HTMLElement>('[data-pg-cards]')!;
    const viewport = root.querySelector<HTMLElement>('[data-pg-viewport]')!;
    const image = root.querySelector<HTMLImageElement>('[data-pg-background]')!;
    const title = root.querySelector<HTMLElement>('[data-pg-title]')!;
    const state = root.querySelector<HTMLElement>('[data-pg-state]')!;
    const status = root.querySelector<HTMLElement>('[data-pg-status]')!;
    const enter = root.querySelector<HTMLButtonElement>('[data-pg-enter]')!;
    const viewButton = root.querySelector<HTMLButtonElement>('[data-pg-view]')!;
    const controller = new AbortController();
    const { signal } = controller;
    let index = 0;
    let view: 'carousel' | 'grid' = 'carousel';
    let background = '';
    let imageRequest = 0;

    const align = () => {
      if (!root.getBoundingClientRect().width) return;
      if (view === 'grid') {
        track.style.setProperty('--pg-shift', '0px');
        return;
      }
      const selected = cards[index];
      const innerWidth = viewport.clientWidth - 12;
      const center = selected.offsetLeft + selected.offsetWidth / 2;
      const overflow = Math.max(0, track.scrollWidth - innerWidth);
      const shift = Math.min(overflow, Math.max(0, center - innerWidth / 2));
      track.style.setProperty('--pg-shift', `${-shift}px`);
    };
    const loadBackground = () => {
      // A hidden workbench must not load five full-size backdrops on page entry.
      if (!root.getBoundingClientRect().width) return;
      const theme = cards[index].dataset.theme as Theme;
      const source = backgroundFor(theme, '', { dynamicBackground: true, generalAmbiance: 'home' })
        .replace('/art/', '/images/playground/');
      if (source === background) return;
      background = source;
      const request = ++imageRequest;
      const next = new Image();
      next.src = source;
      next.decode().then(() => {
        if (signal.aborted || request !== imageRequest) return;
        image.src = source;
      }).catch(() => { if (!signal.aborted && request === imageRequest) image.src = source; });
    };
    const render = (announce = false, focus = false, action = 'select') => {
      root.dataset.view = view;
      cards.forEach((card, cardIndex) => {
        const selected = cardIndex === index;
        card.classList.toggle('is-selected', selected);
        card.setAttribute('aria-selected', String(selected));
        card.tabIndex = selected ? 0 : -1;
      });
      title.textContent = cards[index].dataset.name || '';
      state.textContent = `index: ${index} · view: ${view}`;
      viewButton.setAttribute('aria-pressed', String(view === 'grid'));
      viewButton.textContent = view === 'grid' ? (fr ? 'Vue carrousel ≡' : 'Carousel view ≡') : (fr ? 'Vue grille ⊞' : 'Grid view ⊞');
      align();
      loadBackground();
      if (focus) cards[index].focus({ preventScroll: true });
      if (announce) {
        const viewName = view === 'grid' ? (fr ? 'grille' : 'grid') : (fr ? 'carrousel' : 'carousel');
        status.textContent = fr
          ? `${cards[index].dataset.name}, ${index + 1} sur ${cards.length}, vue ${viewName}. Aucun lancement.`
          : `${cards[index].dataset.name}, ${index + 1} of ${cards.length}, ${viewName} view. No application launched.`;
        root.dispatchEvent(new CustomEvent('canapey:change', {
          bubbles: true, detail: { index, view, action, name: cards[index].dataset.name },
        }));
      }
    };
    const move = (action: Action, focus = false) => {
      ({ index, view } = navigate(index, cards.length, 3, view, action));
      render(true, focus, action);
    };
    cards.forEach((card, cardIndex) => {
      card.addEventListener('click', () => { index = cardIndex; render(true, false); }, { signal });
      card.addEventListener('focus', () => { if (index !== cardIndex) { index = cardIndex; render(true); } }, { signal });
    });
    enter.addEventListener('click', () => {
      render(false, true);
      status.textContent = fr ? 'Navigation active. Utilisez les flèches. Échap revient au bouton.' : 'Navigation active. Use arrow keys. Escape returns to the button.';
    }, { signal });
    viewButton.addEventListener('click', () => move(view === 'carousel' ? 'down' : 'back'), { signal });
    root.querySelectorAll<HTMLButtonElement>('[data-pg-action]').forEach(button => {
      button.addEventListener('click', () => move(button.dataset.pgAction as Action), { signal });
    });
    // Local listener only: no document/window keyboard handling or autoplay.
    root.addEventListener('keydown', event => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-pg-cards], [data-pg-action]')) return;
      const action = ({ ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' } as Record<string, Action>)[event.key];
      if (action) {
        event.preventDefault();
        event.stopPropagation();
        move(action, !!target.closest('[data-pg-cards]'));
      } else if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        enter.focus({ preventScroll: true });
        status.textContent = fr ? 'Navigation quittée.' : 'Navigation exited.';
      } else if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault();
        index = event.key === 'Home' ? 0 : cards.length - 1;
        render(true, true, event.key.toLowerCase());
      }
    }, { signal });
    const resize = new ResizeObserver(() => { align(); loadBackground(); });
    resize.observe(root);
    render();
    cleanups.push(() => { controller.abort(); resize.disconnect(); delete root.dataset.pgReady; });
  });
}

if (import.meta.hot) import.meta.hot.dispose(() => { cleanups.splice(0).forEach(cleanup => cleanup()); });
