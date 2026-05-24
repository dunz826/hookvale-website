// Subtle interactions: scroll-state nav, magnetic hook, reveal on scroll
(function () {
  // Nav scroll state
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Magnetic hero hook
  const hook = document.querySelector(".hero__mark");
  const hero = document.querySelector(".hero");
  if (hook && hero && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      hook.style.transform = `translate(${x * -28}px, ${y * -28}px) rotate(${x * 10}deg)`;
    });
    hero.addEventListener("pointerleave", () => {
      hook.style.transform = "";
    });
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // Legal TOC active state
  const tocLinks = document.querySelectorAll(".legal__toc a");
  if (tocLinks.length) {
    const headings = [...document.querySelectorAll(".legal__content h2")];
    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const id = en.target.id;
          tocLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + id));
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    headings.forEach(h => headingObserver.observe(h));
  }
})();
