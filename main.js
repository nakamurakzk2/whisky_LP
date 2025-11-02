document.addEventListener("DOMContentLoaded", () => {
  const heroImage = document.querySelector("[data-hero-image]");
  const transitionLayer = document.querySelector("[data-hero-transition]");

  if (!heroImage || !transitionLayer) {
    return;
  }

  const imageSources = [
    "images/001.jpg",
    "images/002.jpg",
    "images/003.jpg",
    "images/004.jpg",
    "images/005.jpg",
  ];

  let currentIndex = 0;
  const intervalMs = 3000;

  const runImageReveal = () => {
    requestAnimationFrame(() => {
      transitionLayer.classList.remove("is-visible");
      heroImage.classList.add("is-fading");
      heroImage.addEventListener(
        "animationend",
        () => {
          heroImage.classList.remove("is-fading");
        },
        { once: true }
      );
    });
  };

  const switchImage = (nextIndex) => {
    transitionLayer.classList.add("is-visible");

    const handleLoad = () => {
      runImageReveal();
    };

    const nextSource = imageSources[nextIndex];
    if (heroImage.getAttribute("src") !== nextSource) {
      heroImage.addEventListener("load", handleLoad, { once: true });
      heroImage.setAttribute("src", nextSource);
    } else {
      requestAnimationFrame(() => {
        runImageReveal();
      });
    }
  };

  const startLoop = () => {
    setInterval(() => {
      currentIndex = (currentIndex + 1) % imageSources.length;
      switchImage(currentIndex);
    }, intervalMs);
  };

  if (heroImage.complete && heroImage.naturalWidth > 0) {
    runImageReveal();
  } else {
    heroImage.addEventListener("load", runImageReveal, { once: true });
  }

  startLoop();
});
