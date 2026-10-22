import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let dispose: (() => void) | undefined;

/** The homepage opts in; the shared component remains static everywhere else. */
export function initPeaksMotion() {
  dispose?.();
  const sections = document.querySelectorAll<HTMLElement>('[data-peaks-interactive]');
  if (!sections.length) return;

  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();

  sections.forEach((section) => {
    media.add({
      desktop: '(min-width: 801px)',
      finePointer: '(hover: hover) and (pointer: fine)',
      reducedMotion: '(prefers-reduced-motion: reduce)',
      all: '(min-width: 0px)',
    }, (context) => {
      const { desktop, finePointer, reducedMotion } = context.conditions!;
      // Touch, small screens and reduced motion keep the image and its link visible.
      if (!desktop || reducedMotion) return;

      const cleanups: Array<() => void> = [];
      const frames = section.querySelectorAll<HTMLAnchorElement>('.client-image');

      frames.forEach((frame, index) => {
        const mask = frame.querySelector<HTMLElement>('.client-image-media');
        const image = frame.querySelector<HTMLImageElement>('img');
        const label = frame.querySelector<HTMLElement>('.client-image-label');
        if (!mask || !image || !label) return;

        const reveal = gsap.fromTo(mask, {
          clipPath: 'inset(0% 0% 24% 0%)',
          y: 18,
        }, {
          clipPath: 'inset(0% 0% 0% 0%)',
          y: 0,
          duration: 1,
          delay: index * 0.09,
          ease: 'power3.out',
          scrollTrigger: { trigger: frame, start: 'top 94%', once: true },
        });

        gsap.fromTo(image, { scale: 1.06, yPercent: -2 }, {
          yPercent: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: frame,
            start: 'clamp(top bottom)',
            end: 'clamp(bottom top)',
            scrub: 0.7,
          },
        });

        // Tab navigation must never wait for the entrance animation.
        const revealOnFocus = () => { reveal.progress(1); };
        frame.addEventListener('focus', revealOnFocus);
        cleanups.push(() => frame.removeEventListener('focus', revealOnFocus));
        if (!finePointer) return;

        frame.setAttribute('data-pointer-label', '');
        gsap.set(label, { x: 0, y: 0 });
        const xTo = gsap.quickTo(label, 'x', { duration: 0.35, ease: 'power3.out' });
        const yTo = gsap.quickTo(label, 'y', { duration: 0.35, ease: 'power3.out' });
        let pointerInside = false;
        let bounds = frame.getBoundingClientRect();
        let pageTop = bounds.top + window.scrollY;
        let labelWidth = label.offsetWidth;
        let labelHeight = label.offsetHeight;

        const measure = () => {
          bounds = frame.getBoundingClientRect();
          pageTop = bounds.top + window.scrollY;
          labelWidth = label.offsetWidth;
          labelHeight = label.offsetHeight;
        };
        const moveLabel = (event: PointerEvent) => {
          if (event.pointerType === 'touch') return;
          const x = event.clientX - bounds.left - labelWidth / 2;
          const y = event.clientY + window.scrollY - pageTop - labelHeight / 2;
          xTo(gsap.utils.clamp(12, bounds.width - labelWidth - 12, x));
          yTo(gsap.utils.clamp(12, bounds.height - labelHeight - 12, y));
        };
        const enter = (event: PointerEvent) => {
          if (event.pointerType === 'touch') return;
          pointerInside = true;
          measure();
          moveLabel(event);
          frame.setAttribute('data-label-visible', '');
        };
        const showFocus = () => {
          if (pointerInside) return;
          measure();
          xTo((bounds.width - labelWidth) / 2);
          yTo((bounds.height - labelHeight) / 2);
          frame.setAttribute('data-label-visible', '');
        };
        const leave = () => {
          pointerInside = false;
          if (document.activeElement === frame) showFocus();
          else frame.removeAttribute('data-label-visible');
        };
        const blur = () => {
          if (!pointerInside) frame.removeAttribute('data-label-visible');
        };

        frame.addEventListener('pointerenter', enter);
        frame.addEventListener('pointermove', moveLabel);
        frame.addEventListener('pointerleave', leave);
        frame.addEventListener('focus', showFocus);
        frame.addEventListener('blur', blur);
        window.addEventListener('resize', measure, { passive: true });
        if (document.activeElement === frame) showFocus();
        cleanups.push(() => {
          frame.removeEventListener('pointerenter', enter);
          frame.removeEventListener('pointermove', moveLabel);
          frame.removeEventListener('pointerleave', leave);
          frame.removeEventListener('focus', showFocus);
          frame.removeEventListener('blur', blur);
          window.removeEventListener('resize', measure);
          frame.removeAttribute('data-pointer-label');
          frame.removeAttribute('data-label-visible');
          xTo.tween.kill();
          yTo.tween.kill();
        });
      });

      return () => cleanups.forEach((cleanup) => cleanup());
    }, section);
  });

  dispose = () => {
    media.revert();
    dispose = undefined;
  };
}

const onPageHide = () => dispose?.();
const onPageShow = (event: PageTransitionEvent) => {
  if (event.persisted) initPeaksMotion();
};
window.addEventListener('pagehide', onPageHide);
window.addEventListener('pageshow', onPageShow);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    dispose?.();
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
  });
}
