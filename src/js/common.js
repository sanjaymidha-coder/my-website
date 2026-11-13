"use strict";
// Sticky header (no hide on scroll)
(() => {
    const header = document.getElementById("site-header");
    if (!header) return;

    header.classList.add("site-header");

    const headerHeight = header.offsetHeight || 72;
    document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);

    window.addEventListener(
        "scroll",
        () => {
            const y = window.scrollY;

            // Only add sticky class
            header.classList.toggle("is-stuck", y > 10);
        },
        { passive: true }
    );
})();




document.addEventListener("DOMContentLoaded", () => {

// Mobile menu (optimized)
(() => {
    const openBtn  = document.getElementById("mobile-menu-button");
    const panel    = document.getElementById("mobile-offcanvas");
    const backdrop = document.getElementById("mobile-offcanvas-backdrop"); // optional

    if (!openBtn || !panel) return;

    const toggleMenu = (open) => {

        // slide animation
        panel.classList.toggle("translate-y-[60px]", !open);
        panel.classList.toggle("translate-y-[70px]", open);

        panel.classList.toggle("opacity-0", !open);
        panel.classList.toggle("pointer-events-none", !open);

        panel.classList.toggle("opacity-100", open);
        panel.classList.toggle("pointer-events-auto", open);

        if (backdrop) {
            backdrop.classList.toggle("pointer-events-none", !open);
            backdrop.style.opacity = open ? "1" : "0";
        }

        panel.setAttribute("aria-hidden", !open);
        openBtn.setAttribute("aria-expanded", open);
        openBtn.classList.toggle("is-open", open);

        document[open ? "addEventListener" : "removeEventListener"]("keydown", onKeydown);
    };

    const onKeydown = (e) => {
        if (e.key === "Escape") toggleMenu(false);
    };

    openBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const isExpanded = openBtn.getAttribute("aria-expanded") === "true";
        toggleMenu(!isExpanded);
    });

    if (backdrop) {
        backdrop.addEventListener("click", () => toggleMenu(false));
    }
})();




 // Footer accordion (mobile toggle)
 (() => {
    const sections = Array.from(document.querySelectorAll("[data-footer-section]"));
    if (!sections.length) return;

    const mq = window.matchMedia("(max-width: 767px)");

    const setPanelHeight = (section) => {
        const panel = section.querySelector("[data-footer-panel]");
        if (!panel) return;
        if (!mq.matches) {
            panel.style.maxHeight = "";
            return;
        }
        const open = section.classList.contains("is-open");
        panel.style.maxHeight = open ? `${panel.scrollHeight}px` : "0px";
    };

    const applyMode = () => {
        const mobile = mq.matches;
        sections.forEach((section) => {
            const toggle = section.querySelector("[data-footer-toggle]");
            if (!toggle) return;
            if (!mobile) {
                section.classList.add("is-open");
                delete section.dataset.footerReady;
                toggle.setAttribute("aria-expanded", "true");
            } else {
                if (!section.dataset.footerReady) {
                    section.classList.remove("is-open");
                    section.dataset.footerReady = "true";
                }
                const isOpen = section.classList.contains("is-open");
                toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            }
            setPanelHeight(section);
        });
    };

    sections.forEach((section) => {
        const toggle = section.querySelector("[data-footer-toggle]");
        if (!toggle) return;
        toggle.addEventListener("click", () => {
            if (!mq.matches) return;
            const open = section.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            section.dataset.footerReady = "true";
            setPanelHeight(section);
        });
    });

    const handleChange = () => {
        applyMode();
        sections.forEach(setPanelHeight);
    };
    if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", handleChange);
    } else if (typeof mq.addListener === "function") {
        mq.addListener(handleChange);
    }

    applyMode();
    window.addEventListener("load", () => {
        applyMode();
        sections.forEach(setPanelHeight);
    });
    window.addEventListener("resize", () => {
        if (mq.matches) sections.forEach(setPanelHeight);
    });
    setTimeout(() => {
        if (mq.matches) sections.forEach(setPanelHeight);
    }, 250);
})();

});




