"use client";

import { useEffect } from "react";

export default function SiteScripts() {
  useEffect(() => {
    let disposed = false;

    import("bootstrap").then(({ Collapse }) => {
      if (disposed) return;

      const header = document.getElementById("siteHeader");
      const nav = document.getElementById("mainNav");
      const form = document.getElementById("contactForm");
      const status = document.getElementById("formStatus");
      const year = document.getElementById("year");

      if (!header || !nav) return;

      const navLinks = [...document.querySelectorAll<HTMLAnchorElement>(".navbar .nav-link")];
      const sections = [...document.querySelectorAll<HTMLElement>("main section[id]")];
      const heroOrb = document.querySelector<HTMLElement>(".hero-orb");
      const heroGrid = document.querySelector<HTMLElement>(".hero-grid-lines");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const updateHeader = () => {
        header.classList.toggle("scrolled", window.scrollY > 24);
      };

      const updateParallax = () => {
        if (reduceMotion) return;
        const y = window.scrollY;
        if (heroOrb) heroOrb.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
        if (heroGrid) heroGrid.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
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

      const onScroll = () => {
        updateHeader();
        updateActiveLink();
        updateParallax();
      };

      const onNavLinkClick = () => {
        if (window.innerWidth < 992 && nav.classList.contains("show")) {
          Collapse.getOrCreateInstance(nav).hide();
        }
      };

      const onSubmit = (event: SubmitEvent) => {
        event.preventDefault();

        const formEl = event.currentTarget as HTMLFormElement;
        if (!formEl.checkValidity()) {
          formEl.reportValidity();
          return;
        }

        const data = new FormData(formEl);
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

        if (status) status.textContent = "Your email app is opening with the inquiry ready to send.";
        window.location.href = `mailto:esmunasinghe@gmail.com?subject=${subject}&body=${body}`;
      };

      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.13 }
      );

      updateHeader();
      updateActiveLink();
      updateParallax();
      document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
      navLinks.forEach((link) => link.addEventListener("click", onNavLinkClick));
      form?.addEventListener("submit", onSubmit);
      if (year) year.textContent = String(new Date().getFullYear());
      window.addEventListener("scroll", onScroll, { passive: true });
    });

    return () => {
      disposed = true;
    };
  }, []);

  return null;
}
