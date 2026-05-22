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
