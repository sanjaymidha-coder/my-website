// main.js (merged + mobile portfolio slider)
// Keep 'use strict' style
"use strict";

// --- Debounced FAQ Toggle ---
function toggleFAQ(index) {
    const answer = document.getElementById(`answer-${index}`);
    const icon = document.getElementById(`icon-${index}`);
    const circle = document.getElementById(`circle-${index}`);
    const button = document.querySelector(`[aria-controls="answer-${index}"]`);
    if (!answer || !icon || !button) return;

    const isOpen = answer.classList.contains("open");

    // Close all others (loop optimized)
    document.querySelectorAll(".faq-answer").forEach((ans, i) => {
        const otherIcon = document.getElementById(`icon-${i}`);
        const otherCircle = document.getElementById(`circle-${i}`);
        ans.style.maxHeight = "0";
        ans.classList.remove("open");
        ans.parentElement?.classList.remove("faq-item-active");
        if (otherIcon) {
            otherIcon.classList.remove("open", "text-dark");
            otherIcon.classList.add("text-white");
        }
        if (otherCircle) {
            otherCircle.classList.remove("bg-blue", "text-dark");
            otherCircle.classList.add("bg-ink", "text-white");
        }
        const btn = document.querySelector(`[aria-controls="answer-${i}"]`);
        if (btn) btn.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
        answer.classList.add("open");
        answer.parentElement?.classList.add("faq-item-active");
        icon.classList.add("open", "text-dark");
        icon.classList.remove("text-white");
        circle?.classList.replace("bg-ink", "bg-blue");
        circle?.classList.replace("text-white", "text-dark");
        button.setAttribute("aria-expanded", "true");
    } else {
        answer.style.maxHeight = "0";
        answer.classList.remove("open");
        answer.parentElement?.classList.remove("faq-item-active");
        icon.classList.remove("open", "text-dark");
        icon.classList.add("text-white");
        circle?.classList.replace("bg-blue", "bg-ink");
        circle?.classList.replace("text-dark", "text-white");
        button.setAttribute("aria-expanded", "false");
    }
}

// --- Mobile Logo Slider (optimized for resize) ---
let sliderInit = false;
function initClientLogosSlider() {
    const $slider = window.jQuery?.(".client-logos-slider");
    if (!$slider?.length) return;

    const isMobileView = window.matchMedia("(max-width: 767px)").matches;
    if (isMobileView && !sliderInit) {
        $slider.slick({
            slidesToShow: 3,
            autoplay: true,
            autoplaySpeed: 2000,
            arrows: false,
            infinite: true,
            pauseOnHover: false,
            responsive: [
                { breakpoint: 640, settings: { slidesToShow: 3 } },
                { breakpoint: 480, settings: { slidesToShow: 3 } },
            ],
        });
        sliderInit = true;
    } else if (!isMobileView && sliderInit) {
        try {
            $slider.slick("unslick");
        } catch (e) { }
        sliderInit = false;
    }
}

// --- DOM Ready ---
document.addEventListener("DOMContentLoaded", () => {
    initClientLogosSlider();

    // Input field state
    document.querySelectorAll(".input-global, .select-global").forEach((el) => {
        const update = () => el.classList.toggle("filled", !!el.value?.trim());
        update();
        ["input", "change", "blur"].forEach((evt) => el.addEventListener(evt, update));
    });

    // Prevent FAQ anchor jumps
    document
        .querySelectorAll('a[aria-controls^="answer-"]')
        .forEach((el) => el.addEventListener("click", (e) => e.preventDefault()));
});

// --- Resize Recheck ---
let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initClientLogosSlider();
        // re-init mobile portfolio slider if present (function defined later)
        try {
            initMobilePortfolioSlider();
        } catch (e) { }
    }, 250);
});

// --- Smooth Scroll Navigation ---
document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - 70,
            behavior: "smooth",
        });
    });
});

// --- Cookie Popup (unchanged except for minor optimizations) ---
(() => {
    const popup = document.getElementById("cookie-popup");
    if (!popup) return;

    const settingsBtn = document.getElementById("cookie-settings-btn");
    const customizeBtn = document.getElementById("cookie-customize");
    const customPanel = document.getElementById("cookie-custom-panel");
    const mainButtons = document.getElementById("cookie-main-buttons");
    const saveBtn = document.getElementById("cookie-save");
    const get = (id) => document.getElementById(id);

    let consentData = null;
    try {
        const stored = localStorage.getItem("cookieConsent");
        if (stored === "accepted" || stored === "rejected") {
            consentData = {
                essential: true,
                analytics: stored === "accepted",
                marketing: stored === "accepted",
                functional: stored === "accepted",
            };
            localStorage.setItem("cookieConsent", JSON.stringify(consentData));
        } else {
            consentData = stored ? JSON.parse(stored) : null;
        }
    } catch {
        localStorage.removeItem("cookieConsent");
    }

    const showPopup = (customize = false) => {
        popup.style.display = "block";
        popup.classList.remove("hidden", "hide");
        if (!customize) {
            customPanel.classList.add("hidden");
            mainButtons.classList.remove("hidden");
        }
        void popup.offsetWidth;
        popup.classList.add("show");
    };

    const hidePopup = () => {
        popup.classList.remove("show");
        popup.classList.add("hide");
        setTimeout(() => (popup.style.display = "none"), 400);
    };

    if (consentData) {
        ["analytics", "marketing", "functional"].forEach((k) => {
            const el = get(`cookie-${k}`);
            if (el) el.checked = !!consentData[k];
        });
    } else {
        showPopup();
    }

    const saveConsent = (data) => {
        localStorage.setItem("cookieConsent", JSON.stringify(data));
        hidePopup();
        if (data.analytics || data.marketing || data.functional) loadConsentScripts(data);
    };

    get("cookie-accept").addEventListener("click", () =>
        saveConsent({ essential: true, analytics: true, marketing: true, functional: true })
    );

    get("cookie-reject").addEventListener("click", () =>
        saveConsent({ essential: true, analytics: false, marketing: false, functional: false })
    );

    saveBtn.addEventListener("click", () => {
        saveConsent({
            essential: true,
            analytics: get("cookie-analytics").checked,
            marketing: get("cookie-marketing").checked,
            functional: get("cookie-functional").checked,
        });
        setTimeout(() => {
            customPanel.classList.add("hidden");
            mainButtons.classList.remove("hidden");
        }, 400);
    });

    settingsBtn.addEventListener("click", () => showPopup(false));
    customizeBtn.addEventListener("click", () => {
        mainButtons.classList.add("hidden");
        customPanel.classList.remove("hidden");
        customPanel.classList.add("animate-fadeInUp");
    });

    function loadConsentScripts(data) {
        if (data.analytics) {
            const gtagScript = document.createElement("script");
            gtagScript.async = true;
            gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-251J8F95ED";
            gtagScript.onload = () => {
                window.dataLayer = window.dataLayer || [];
                function gtag() {
                    window.dataLayer.push(arguments);
                }
                gtag("js", new Date());
                gtag("config", "G-251J8F95ED");
            };
            document.head.appendChild(gtagScript);
            const hotjar = document.createElement("script");
            hotjar.async = true;
            hotjar.src = "https://t.contentsquare.net/uxa/470b0f6ba5ddf.js";
            document.head.appendChild(hotjar);
        }
        if (data.marketing) {
            const fb = document.createElement("script");
            fb.async = true;
            fb.src = "https://connect.facebook.net/en_US/fbevents.js";
            document.head.appendChild(fb);
        }
    }

    if (consentData && (consentData.analytics || consentData.marketing || consentData.functional)) {
        loadConsentScripts(consentData);
    }
})();

/* -------------------------
   Mobile portfolio slider (reuse same HTML)
   - Use .portfolio-slider-init wrapper present in desktop HTML
   - Only runs on mobile (<= 767px)
   ------------------------- */
(function () {
    let mobilePortfolioInit = false;
    const sel = ".portfolio-slider-init";
    const slideSel =
        ".portfolio-slider-init > .overflow-hidden, .portfolio-slider-init > .relative, .portfolio-slider-init > article";
    const mdBreakpoint = 767;

    function isMobile() {
        return window.innerWidth <= mdBreakpoint;
    }
    function measurable(el) {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.width > 16;
    }

    function enforceSlideDisplay() {
        try {
            document.querySelectorAll(slideSel).forEach((s) => {
                s.style.display = "inline-block";
                s.style.verticalAlign = "top";
                s.style.float = "none";
                s.style.width = ""; // allow slick to calculate
            });
            const track = document.querySelector(`${sel} .slick-track`);
            if (track) {
                track.style.display = "block";
                track.style.whiteSpace = "nowrap";
            }
            const list = document.querySelector(`${sel} .slick-list`);
            if (list) list.style.overflow = "visible";
        } catch (e) {
            /* ignore */
        }
    }

    function initMobilePortfolioSlider() {
        const $wrap = window.jQuery?.(sel);
        if (!$wrap || !$wrap.length) return;

        // destroy on desktop
        if (!isMobile()) {
            if (mobilePortfolioInit) {
                try {
                    $wrap.slick("unslick");
                } catch (e) { }
                mobilePortfolioInit = false;
            }
            // remove inline fixes
            try {
                document.querySelectorAll(slideSel).forEach((s) => {
                    s.style.display = "";
                    s.style.verticalAlign = "";
                    s.style.float = "";
                });
                const track = document.querySelector(`${sel} .slick-track`);
                if (track) {
                    track.style.display = "";
                    track.style.whiteSpace = "";
                }
                const list = document.querySelector(`${sel} .slick-list`);
                if (list) list.style.overflow = "";
            } catch (e) { }
            return;
        }

        if (mobilePortfolioInit) {
            try {
                $wrap.slick("setPosition");
            } catch (e) { }
            enforceSlideDisplay();
            return;
        }

        // wait for measurable width
        if (!measurable($wrap[0])) {
            setTimeout(initMobilePortfolioSlider, 120);
            return;
        }

        try {
            $wrap.slick({
                mobileFirst: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: true,
                customPaging: (_slider, index) =>
                    `<button type="button" aria-label="Go to slide ${index + 1}"></button>`,
                centerMode: true,
                centerPadding: "14%",
                rows: 0, // important - prevents vertical stacking
                adaptiveHeight: false,
                infinite: true,
                speed: 420,
                accessibility: true,
                pauseOnHover: false,
                variableWidth: false,
                responsive: [
                    { breakpoint: 480, settings: { centerPadding: "10%" } },
                    { breakpoint: 360, settings: { centerPadding: "6%" } },
                ],
            });

            mobilePortfolioInit = true;
            enforceSlideDisplay();
            setTimeout(() => {
                try {
                    $wrap.slick("setPosition");
                    $wrap.slick("refresh");
                } catch (e) { }
                enforceSlideDisplay();
            }, 80);
        } catch (err) {
            setTimeout(initMobilePortfolioSlider, 200);
        }
    }

    window.initMobilePortfolioSlider = initMobilePortfolioSlider;
    document.addEventListener("DOMContentLoaded", initMobilePortfolioSlider);
    window.addEventListener("load", initMobilePortfolioSlider);
    let deb = null;
    window.addEventListener("resize", () => {
        clearTimeout(deb);
        deb = setTimeout(initMobilePortfolioSlider, 140);
    });
})();



let swiper;

function initMobileSwiper() {
    const isMobile = window.innerWidth < 768;

    if (isMobile && !swiper) {
        // init only on mobile
        swiper = new Swiper(".mySwiper", {
            effect: "cards",
            grabCursor: true,
            loop: true,
            slidesPerView: 1,
            centeredSlides: true,
            cardsEffect: {
                slideShadows: true,
                rotate: 9,
                perSlideRotate: 9,
                perSlideOffset: 14,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
        });
    } else if (!isMobile && swiper) {
        // destroy on >= 768px
        swiper.destroy(true, true);
        swiper = null;
    }
}

// run on load + on resize
window.addEventListener("load", initMobileSwiper);
window.addEventListener("resize", initMobileSwiper);


// Our Process Slider
new Swiper(".process-swiper", {
    loop: true,
    speed: 700,
    grabCursor: true,
    spaceBetween: 24,
    navigation: {
        nextEl: ".process-next",
        prevEl: ".process-prev",
    },
    breakpoints: {
        640: {
            slidesPerView: 2.8,
        },
        1024: {
            slidesPerView: 2.8,
        },
        1280: {
            slidesPerView: 2.8,
        },
    },
});




const workSwiper = new Swiper(".myWorkSwiper", {
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    speed: 700,
    slidesPerView: 1.2,
    spaceBetween: 24,

    navigation: {
        nextEl: ".process-next",
        prevEl: ".process-prev",
    },

    breakpoints: {
        768: {
            slidesPerView: 2.4,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});

// ── Project Modal ──────────────────────────────────────────
(function () {
    var projects = {
        jannah: {
            name: 'Jannah',
            image: './assets/images/work/jannah-thumbnail.webp',
            url: 'https://jannahrice.com',
            tags: ['FMCG', 'Food & Agriculture', 'Brand Design'],
            about: 'We designed and developed a premium brand website for Jannah, a basmati rice brand rooted in tradition and built for global markets. The objective was to create a visually rich, trust-driven digital experience that highlights product quality, sourcing authenticity, advanced processing, and export readiness while appealing to distributors, importers, and private-label partners worldwide.',
            industry: 'FMCG / Food & Agriculture / Rice Exports',
            services: 'Brand Website Design, Product Presentation, Content Structuring, B2B Trust Design',
            audience: 'Importers, Distributors, Retailers, and Private Label Partners',
            details: [
                'Establish Jannah as a premium basmati rice brand with strong heritage and quality positioning.',
                'Clearly communicate rice varieties, processing methods, and packaging capabilities.',
                'Build trust with global buyers through transparency, certifications, and export-focused storytelling.'
            ]
        },
        gisteo: {
            name: 'Gisteo',
            image: './assets/images/work/gisteo-thumbnail.webp',
            url: 'https://gisteo.com',
            tags: ['B2B Marketing', 'Video Production', 'Web Design'],
            about: 'We designed and developed a modern, conversion-focused website for Gisteo, a strategic marketing firm and video production studio focused on turning complex business messages into clear, impactful visual stories. The objective was to create a clean, approachable, and trust-driven digital presence that clearly communicates expertise in strategy, animation, and video production while guiding potential clients toward confident, informed decisions.',
            industry: 'B2B Marketing / Video Production / Animation',
            services: 'Strategic Marketing, Explainer Videos, Animation, Brand Storytelling',
            audience: 'Startups, Scale-ups, and B2B Companies',
            details: [
                'Clearly position Gisteo as a strategy-first marketing and video partner.',
                'Simplify complex service offerings into easy-to-understand sections.',
                'Build trust through clarity, social proof, and outcome-driven messaging.'
            ]
        },
        syance: {
            name: 'SYANCE',
            image: './assets/images/work/syance-thumbnail.webp',
            url: 'https://syance.com',
            tags: ['Performance Marketing', 'Digital Growth', 'Web Design'],
            about: 'We designed and built a high-performance marketing website for SYANCE, a data-driven performance marketing agency focused on scalable, measurable growth. The objective was to create a bold, modern, and trust-focused digital presence that clearly communicates expertise in paid media, analytics, and growth strategy while driving high-intent conversions from ambitious brands and enterprises.',
            industry: 'Performance Marketing / Digital Growth',
            services: 'Data-Driven Marketing, Conversion Optimization, Scalable Growth',
            audience: 'Startups, Scale-ups, and Enterprise Brands',
            details: [
                'Establish SYANCE as a premium, data-driven performance marketing agency.',
                'Communicate the growth-focused approach with clarity and confidence.',
                'Drive high-intent leads through clear structure and strong CTAs.'
            ]
        },
        treedefi: {
            name: 'TreeDeFi',
            image: './assets/images/work/treedefi-thumbnail.webp',
            url: 'https://treedefi.com',
            tags: ['Web3', 'DeFi', 'Sustainability'],
            about: 'We designed and developed a modern Web3 platform for TreeDeFi, a decentralised finance project merging blockchain technology with environmental sustainability. The objective was to create a credible, transparent digital experience that communicates the mission of funding reforestation initiatives through tokenised assets while building trust with crypto investors and sustainability advocates.',
            industry: 'Web3 / DeFi / Environmental Finance',
            services: 'Web3 Website Design, UI/UX Design, Token Platform, Brand Identity',
            audience: 'Crypto Investors, Environmental Advocates, and DeFi Participants',
            details: [
                'Position TreeDeFi as a credible bridge between blockchain finance and environmental impact.',
                'Clearly communicate tokenomics, reforestation milestones, and investor returns.',
                'Build community trust through transparency, impact metrics, and strong visual storytelling.'
            ]
        },
        firmable: {
            name: 'Firmable',
            image: './assets/images/work/firmable-thumbnail.webp',
            url: 'https://firmable.com',
            tags: ['B2B SaaS', 'Business Intelligence', 'Web Design'],
            about: 'We designed and developed a modern B2B SaaS website for Firmable, Australia\'s definitive business intelligence and prospecting platform. The objective was to create a clean, scalable, and conversion-focused digital experience that clearly communicates the value of accurate B2B data, supports multiple user personas, and positions Firmable as a trusted data authority for sales, marketing, recruitment, and market intelligence teams.',
            industry: 'B2B SaaS / Business Intelligence / Data Platforms',
            services: 'SaaS Website Design, UI/UX Design, Content Structuring, Conversion-Focused UX',
            audience: 'Sales Teams, Marketing Teams, Recruiters, and Business Decision-Makers',
            details: [
                'Position Firmable as Australia\'s leading and most trusted B2B data platform.',
                'Clearly communicate platform use cases across sales, marketing, recruitment, and market intelligence.',
                'Drive trial sign-ups and product engagement through structured content and strong CTAs.'
            ]
        },
        followthecamino: {
            name: 'Follow The Camino',
            image: './assets/images/work/followthecamino-thumbnail.webp',
            url: 'https://followthecamino.com',
            tags: ['Travel & Tourism', 'Booking', 'Web Design'],
            about: 'We designed and built an immersive, conversion-focused travel website for Follow the Camino, a specialised tour operator offering guided Camino de Santiago experiences for international travellers. The objective was to create an inspiring yet practical digital experience that showcases multiple Camino routes, builds trust with first-time pilgrims, and simplifies trip planning through emotional storytelling and clear structure.',
            industry: 'Travel & Tourism / Guided Walking Tours',
            services: 'Travel Website Design, UI/UX Design, Conversion-Focused UX, Frontend Development',
            audience: 'International Travelers, Pilgrims, Camino Walkers, Adventure & Cultural Tourists',
            details: [
                'Position Follow the Camino as a trusted, experienced Camino de Santiago tour operator.',
                'Clearly present routes, destinations, and tour benefits in an easy-to-compare format.',
                'Drive inquiries and bookings through strong trust signals and clear calls-to-action.'
            ]
        },
        plannerdao: {
            name: 'PlannerDAO',
            image: './assets/images/work/plannerdao-thumnail.webp',
            url: 'https://plannerdao.com',
            tags: ['Web3', 'DAO', 'Event Technology'],
            about: 'We designed and developed a bold Web3 platform for PlannerDAO, a decentralised autonomous organisation reimagining how events are planned and funded on the blockchain. The objective was to create a modern, trustworthy digital experience that communicates the DAO\'s governance model, token utility, and community-driven event ecosystem while appealing to both Web3 natives and enterprise clients.',
            industry: 'Web3 / DAO / Event Technology',
            services: 'Web3 Website Design, UI/UX Design, DAO Platform, Token Integration',
            audience: 'Web3 Enthusiasts, Event Organisers, and Enterprise Clients',
            details: [
                'Position PlannerDAO as the leading decentralised event planning platform in the Web3 space.',
                'Clearly communicate the DAO governance model, token utility, and community incentives.',
                'Build credibility with both Web3 natives and traditional enterprise event clients.'
            ]
        }
    };

    var modal      = document.getElementById('projectModal');
    var backdrop   = document.getElementById('modalBackdrop');
    var closeBtn   = document.getElementById('modalClose');
    var imgEl      = document.getElementById('modalImage');
    var tagsEl     = document.getElementById('modalTags');
    var linkEl     = document.getElementById('modalLink');
    var aboutEl    = document.getElementById('modalAbout');
    var industryEl = document.getElementById('modalIndustry');
    var servicesEl = document.getElementById('modalServices');
    var audienceEl = document.getElementById('modalAudience');
    var detailsEl  = document.getElementById('modalDetails');

    function openModal(projectId) {
        var p = projects[projectId];
        if (!p) return;

        imgEl.src              = p.image;
        imgEl.alt              = p.name;
        linkEl.href            = p.url;
        aboutEl.textContent    = p.about;
        industryEl.textContent = p.industry;
        servicesEl.textContent = p.services;
        audienceEl.textContent = p.audience;

        tagsEl.innerHTML = '';
        p.tags.forEach(function (tag) {
            var span = document.createElement('span');
            span.className   = 'modal-tag';
            span.textContent = tag;
            tagsEl.appendChild(span);
        });

        detailsEl.innerHTML = '';
        p.details.forEach(function (detail) {
            var li = document.createElement('li');
            li.textContent = detail;
            detailsEl.appendChild(li);
        });

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        document.getElementById('modalCard').scrollTop = 0;
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.work-card-btn').forEach(function (btn) {
        btn.addEventListener('click', function () { openModal(btn.dataset.project); });
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
}());




/* ---- particles.js config ---- */

$(document).ready(function () {
    particlesJS("particles-js", {
        particles: {
            number: {
                value: 450,
                density: { enable: true, value_area: 500 }
            },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: {
                value: 0.5,
                random: true,
                anim: { enable: true, speed: 0.9, opacity_min: 0.1, sync: false }
            },
            size: {
                value: 1,
                random: true
            },
            move: {
                enable: true,
                direction: "top",      // 👈 upward motion
                random: true,
                speed: 0.4,            // controls how fast they float up
                out_mode: "out",
                bounce: false
            },
            line_linked: { enable: false }  // no connecting lines
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: false },
                onclick: { enable: false },
                resize: true
            }
        },
        retina_detect: true
    });
});

