document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".menu-button");
  const navigation = document.querySelector(".site-nav");
  button.addEventListener("click", () => {
    const open = navigation.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(open));
  });
  navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    });
  });
  const elements = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.setAttribute("data-visible", "true");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach(element => observer.observe(element));
});
