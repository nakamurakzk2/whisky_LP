document.addEventListener("DOMContentLoaded", () => {
  const heroPrimaryImage = document.querySelector("[data-hero-image]");
  const heroSecondaryImage = document.querySelector("[data-hero-image-next]");
  const transitionLayer = document.querySelector("[data-hero-transition]");

  if (heroPrimaryImage && heroSecondaryImage && transitionLayer) {
    const imageSources = [
      "images/001.jpg",
      "images/002.jpg",
      "images/003.jpg",
      "images/004.jpg",
      "images/005.jpg",
    ];

    let currentIndex = 0;
    let currentImage = heroPrimaryImage;
    let nextImage = heroSecondaryImage;
    let isTransitioning = false;
    const intervalMs = 5000;

    currentImage.classList.add("is-visible");
    currentImage.setAttribute("aria-hidden", "false");
    nextImage.setAttribute("aria-hidden", "true");

    const revealInitialImage = () => {
      requestAnimationFrame(() => {
        transitionLayer.classList.remove("is-visible");
      });
    };

    if (currentImage.complete && currentImage.naturalWidth > 0) {
      revealInitialImage();
    } else {
      currentImage.addEventListener("load", revealInitialImage, { once: true });
    }

    const performSwitch = (nextIndex) => {
      if (isTransitioning) {
        return;
      }

      const nextSource = imageSources[nextIndex];
      if (!nextSource || nextSource === currentImage.getAttribute("src")) {
        currentIndex = nextIndex;
        return;
      }

      isTransitioning = true;

      const startTransition = () => {
        const incomingImage = nextImage;
        const outgoingImage = currentImage;

        transitionLayer.classList.add("is-visible");
        requestAnimationFrame(() => {
          incomingImage.classList.add("is-visible");
          incomingImage.setAttribute("aria-hidden", "false");
          outgoingImage.classList.add("is-exiting");

          const handleTransitionEnd = (event) => {
            if (event.propertyName !== "opacity") {
              return;
            }
            incomingImage.removeEventListener("transitionend", handleTransitionEnd);

            transitionLayer.classList.remove("is-visible");
            outgoingImage.classList.remove("is-visible", "is-exiting");
            outgoingImage.setAttribute("aria-hidden", "true");

            currentImage = incomingImage;
            nextImage = outgoingImage;

            nextImage.classList.remove("is-visible", "is-exiting");
            nextImage.setAttribute("aria-hidden", "true");

            isTransitioning = false;
          };

          incomingImage.addEventListener("transitionend", handleTransitionEnd);
        });
      };

      const handleLoad = () => {
        startTransition();
        currentIndex = nextIndex;
      };

      if (
        nextImage.getAttribute("src") === nextSource &&
        nextImage.complete &&
        nextImage.naturalWidth > 0
      ) {
        handleLoad();
      } else {
        nextImage.addEventListener("load", handleLoad, { once: true });
        nextImage.setAttribute("src", nextSource);
      }
    };

    setInterval(() => {
      const nextIndex = (currentIndex + 1) % imageSources.length;
      performSwitch(nextIndex);
    }, intervalMs);
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

  const initSectionReveal = () => {
    const sections = document.querySelectorAll("[data-reveal]");
    if (!sections.length || !("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    sections.forEach((section) => observer.observe(section));
  };

  initFaqToggles();
  initGalleryMarquee();
  initScrollToApplication();
  initSectionReveal();
});
