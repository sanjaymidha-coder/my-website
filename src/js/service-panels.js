// exact clone of the reference main.js service pin logic
window.addEventListener("load", function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add("(min-width: 1199px)", function () {
    // timeline used like in the reference
    const tl      = gsap.timeline();
    const panels  = document.querySelectorAll(".tp-service-panel");
    const endArea = ".tp-service-pin"; // same as _0x26a286(0x30e)

    if (!panels.length) return;

    const baseOffset = 70; // 0x96
    const gap        = 120; // 0x78

    panels.forEach(function (panel, index) {
      const offset = baseOffset + index * gap;

      tl.to(panel, {
        scrollTrigger: {
          trigger: panel,
          pin: panel,
          scrub: 1,
          start: "top " + offset + "px", // _0x26a286(0x29a) + offset + "px"
          end: "bottom 99%",             // _0x26a286(0x245)
          endTrigger: endArea,           // ".tp-service-pin"
          pinSpacing: false,
          markers: false,
        },
      });
    });
  });
});
