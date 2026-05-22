const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");
const count = document.querySelector("#count");

function updateCount(){
  const visible = [...projects].filter(project => !project.classList.contains("hidden")).length;
  count.textContent = `${visible} project${visible > 1 ? "s" : ""} shown`;
}

filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(filter => filter.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    projects.forEach(project => {
      const categories = project.dataset.category || "";
      const shouldShow = filter === "all" || categories.includes(filter);

      project.classList.toggle("hidden", !shouldShow);

      if (shouldShow) {
        project.classList.remove("visible");
        requestAnimationFrame(() => project.classList.add("visible"));
      }
    });

    updateCount();
  });
});

document.querySelectorAll(".project").forEach(card => {
  card.addEventListener("mousemove", event => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.background = `
      radial-gradient(circle at ${x}px ${y}px, rgba(255,90,54,.13), transparent 32%),
      rgba(255,255,255,.54)
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.background = "";
  });
});
