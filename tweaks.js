// Tweaks: vanilla, persists via __edit_mode_set_keys
(function () {
  const DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "coral",
    "theme": "light",
    "display": "sans"
  }/*EDITMODE-END*/;

  const ACCENTS = {
    coral:  { color: "oklch(0.66 0.16 38)", ink: "oklch(0.99 0.01 80)", darkColor: "oklch(0.74 0.16 40)" },
    sage:   { color: "oklch(0.62 0.10 155)", ink: "oklch(0.99 0.01 80)", darkColor: "oklch(0.72 0.10 155)" },
    cobalt: { color: "oklch(0.55 0.16 255)", ink: "oklch(0.99 0.01 80)", darkColor: "oklch(0.68 0.16 255)" },
    plum:   { color: "oklch(0.55 0.14 330)", ink: "oklch(0.99 0.01 80)", darkColor: "oklch(0.70 0.14 330)" }
  };

  let state = { ...DEFAULTS };

  function apply() {
    const root = document.documentElement;
    root.setAttribute("data-theme", state.theme);
    root.setAttribute("data-display", state.display);
    const a = ACCENTS[state.accent] || ACCENTS.coral;
    const isDark = state.theme === "dark";
    root.style.setProperty("--accent", isDark ? a.darkColor : a.color);
    root.style.setProperty("--accent-ink", a.ink);

    // sync UI
    document.querySelectorAll("[data-tweak]").forEach(el => {
      const key = el.dataset.tweak;
      const val = el.dataset.value;
      el.classList.toggle("is-active", state[key] === val);
    });
  }

  function setKey(key, val) {
    state[key] = val;
    apply();
    try {
      window.parent.postMessage({
        type: "__edit_mode_set_keys",
        edits: { [key]: val }
      }, "*");
    } catch(e) {}
  }

  // wire panel buttons
  function init() {
    document.querySelectorAll("[data-tweak]").forEach(el => {
      el.addEventListener("click", () => {
        setKey(el.dataset.tweak, el.dataset.value);
      });
    });

    const panel = document.querySelector(".tweaks");
    const closeBtn = document.querySelector(".tweaks__close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        panel.classList.remove("is-open");
        try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch(e) {}
      });
    }

    // edit-mode protocol
    window.addEventListener("message", (e) => {
      const t = e.data && e.data.type;
      if (t === "__activate_edit_mode")   panel && panel.classList.add("is-open");
      if (t === "__deactivate_edit_mode") panel && panel.classList.remove("is-open");
    });
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch(e) {}

    apply();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // expose for cross-page consistency
  window.__hookvaleTweaks = { state, apply, setKey };
})();
