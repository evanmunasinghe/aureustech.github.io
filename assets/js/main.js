document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const nav = document.getElementById("mainNav");
  const navLinks = [...document.querySelectorAll(".navbar .nav-link")];
  const sections = [...document.querySelectorAll("main section[id]")];

  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
  };

  const updateActiveLink = () => {
    const position = window.scrollY + 140;
    let current = "home";

    sections.forEach((section) => {
      if (position >= section.offsetTop) current = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  };

  updateHeader();
  updateActiveLink();
  window.addEventListener("scroll", () => {
    updateHeader();
    updateActiveLink();
  }, { passive: true });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992 && nav.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const subject = encodeURIComponent(`Project inquiry from ${data.get("name")}`);
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\n` +
      `Email: ${data.get("email")}\n` +
      `Phone: ${data.get("phone") || "Not provided"}\n` +
      `Company: ${data.get("company") || "Not provided"}\n` +
      `Service: ${data.get("service")}\n` +
      `Budget: ${data.get("budget") || "Not provided"}\n\n` +
      `Project details:\n${data.get("message")}`
    );

    status.textContent = "Your email app is opening with the inquiry ready to send.";
    window.location.href = `mailto:esmunasinghe@gmail.com?subject=${subject}&body=${body}`;
  });

  document.getElementById("year").textContent = new Date().getFullYear();
});
