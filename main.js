document.addEventListener("DOMContentLoaded", () => {
  const heroImage = document.querySelector("[data-hero-image]");
  const transitionLayer = document.querySelector("[data-hero-transition]");

  if (heroImage && transitionLayer) {
    const imageSources = [
      "images/001.jpg",
      "images/002.jpg",
      "images/003.jpg",
      "images/004.jpg",
      "images/005.jpg",
    ];

    let currentIndex = 100;
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
  }

  const initFaqToggles = () => {
    const faqToggles = document.querySelectorAll("[data-faq-toggle]");
    faqToggles.forEach((button) => {
      const answerId = button.getAttribute("aria-controls");
      const answer = document.getElementById(answerId);
      const icon = button.querySelector(".faq__icon");

      if (!answer) {
        return;
      }

      button.addEventListener("click", () => {
        const isExpanded = button.getAttribute("aria-expanded") === "true";
        const nextState = !isExpanded;
        button.setAttribute("aria-expanded", String(nextState));
        answer.hidden = !nextState;
        if (icon) {
          icon.textContent = nextState ? "−" : "+";
        }
      });
    });
  };

  const initGalleryMarquee = () => {
    const track = document.querySelector("[data-gallery-track]");
    if (!track) {
      return;
    }

    const slides = Array.from(track.children);
    if (!slides.length) {
      return;
    }

    slides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    let translateX = 0;
    let trackWidth = track.scrollWidth / 2;
    const speed = 0.3;

    const updateTrackWidth = () => {
      translateX = 0;
      track.style.transform = "translateX(0)";
      trackWidth = track.scrollWidth / 2;
    };

    const animate = () => {
      translateX -= speed;
      if (Math.abs(translateX) >= trackWidth) {
        translateX = 0;
      }
      track.style.transform = `translateX(${translateX}px)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", () => {
      updateTrackWidth();
    });

    updateTrackWidth();
    requestAnimationFrame(animate);
  };

  const initScrollToApplication = () => {
    const target = document.getElementById("application");
    if (!target) {
      return;
    }

    const triggers = document.querySelectorAll('[data-scroll-to="application"]');
    if (!triggers.length) {
      return;
    }

    const handleClick = (event) => {
      event.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", handleClick);
    });
  };

  initFaqToggles();
  initGalleryMarquee();
  initScrollToApplication();
});
