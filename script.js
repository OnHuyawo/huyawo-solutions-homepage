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

  const emailButton = document.querySelector(".contact-email-pill[data-copy-email]");
  const copyToast = document.querySelector(".contact-email-toast");
  let copyToastTimer;
  let copyToastHideTimer;
  let copyButtonTimer;

  const fallbackCopy = text => {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    field.remove();
    emailButton.focus({ preventScroll: true });
    return copied;
  };

  const showCopyToast = message => {
    clearTimeout(copyToastTimer);
    clearTimeout(copyToastHideTimer);
    clearTimeout(copyButtonTimer);
    copyToast.textContent = message;
    copyToast.hidden = false;
    // Allow a hidden toast to paint at zero opacity before fading in.
    copyToast.classList.remove("is-visible");
    void copyToast.offsetWidth;
    copyToast.classList.add("is-visible");
    emailButton.classList.add("is-copied");
    copyButtonTimer = setTimeout(() => {
      emailButton.classList.remove("is-copied");
    }, 550);
    // Two seconds fully visible, followed by an opacity fade to zero.
    copyToastTimer = setTimeout(() => {
      copyToast.classList.remove("is-visible");
      copyToastHideTimer = setTimeout(() => {
        copyToast.hidden = true;
      }, 360);
    }, 2320);
  };

  if (emailButton && copyToast) {
    emailButton.addEventListener("click", async () => {
      const email = emailButton.dataset.copyEmail;
      let copied = false;
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(email);
          copied = true;
        } catch (error) {
          copied = fallbackCopy(email);
        }
      } else {
        copied = fallbackCopy(email);
      }
      showCopyToast(copied ? "Email copied successfully!" : "Unable to copy email. Please try again.");
    });
  }
});
