const openMenu = document.querySelector("#openMenu");
const closeMenu = document.querySelector("#closeMenu");
const menu = document.querySelector("#menu");

if (openMenu && closeMenu && menu) {
  openMenu.addEventListener("click", () => menu.classList.add("open"));
  closeMenu.addEventListener("click", () => menu.classList.remove("open"));
  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => menu.classList.remove("open"));
  });
}

const reveals = document.querySelectorAll(".reveal");

if (reveals.length) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 55, 350)}ms`;
    revealObserver.observe(el);
  });
}
