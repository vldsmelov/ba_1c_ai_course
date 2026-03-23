const printButtons = [
  document.getElementById("print-button"),
  document.getElementById("print-button-secondary")
].filter(Boolean);

for (const button of printButtons) {
  button.addEventListener("click", () => window.print());
}

for (const control of document.querySelectorAll("[data-scroll]")) {
  control.addEventListener("click", () => {
    const selector = control.getAttribute("data-scroll");
    const target = selector ? document.querySelector(selector) : null;

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

const governanceTrack = document.querySelector("[data-governance-track]");
const governancePrev = document.querySelector("[data-governance-prev]");
const governanceNext = document.querySelector("[data-governance-next]");

if (governanceTrack && governancePrev && governanceNext) {
  const originalItems = Array.from(governanceTrack.children).map((item) => item.cloneNode(true));
  let currentIndex = 0;
  let currentVisibleCount = 3;
  let isAnimating = false;

  const visibleCount = () => {
    if (window.innerWidth <= 760) return 1;
    if (window.innerWidth <= 1100) return 2;
    return 3;
  };

  const getStep = () => {
    const firstItem = governanceTrack.querySelector(".governance-item");

    if (!firstItem) return 0;

    const gap = Number.parseFloat(window.getComputedStyle(governanceTrack).columnGap || window.getComputedStyle(governanceTrack).gap || "18");
    return firstItem.getBoundingClientRect().width + gap;
  };

  const setTranslate = (withTransition = true) => {
    const step = getStep();

    governanceTrack.style.transition = withTransition ? "transform 420ms ease" : "none";
    governanceTrack.style.transform = `translateX(${-currentIndex * step}px)`;
  };

  const buildGovernanceTrack = () => {
    currentVisibleCount = visibleCount();
    const headClones = originalItems.slice(-currentVisibleCount).map((item) => item.cloneNode(true));
    const tailClones = originalItems.slice(0, currentVisibleCount).map((item) => item.cloneNode(true));
    governanceTrack.replaceChildren(...headClones, ...originalItems.map((item) => item.cloneNode(true)), ...tailClones);
    currentIndex = currentVisibleCount;
    requestAnimationFrame(() => setTranslate(false));
  };

  const moveGovernance = (direction) => {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex += direction;
    requestAnimationFrame(() => setTranslate(true));
  };

  governancePrev.addEventListener("click", () => {
    moveGovernance(-1);
  });

  governanceNext.addEventListener("click", () => {
    moveGovernance(1);
  });

  governanceTrack.addEventListener("transitionend", () => {
    const originalsLength = originalItems.length;

    if (currentIndex < currentVisibleCount) {
      currentIndex += originalsLength;
      setTranslate(false);
    } else if (currentIndex >= originalsLength + currentVisibleCount) {
      currentIndex -= originalsLength;
      setTranslate(false);
    }

    isAnimating = false;
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      buildGovernanceTrack();
    }, 120);
  });

  const showGovernanceForPrint = () => {
    governanceTrack.replaceChildren(...originalItems.map((item) => item.cloneNode(true)));
    governanceTrack.style.transition = "none";
    governanceTrack.style.transform = "none";
  };

  const restoreGovernanceAfterPrint = () => {
    buildGovernanceTrack();
  };

  window.addEventListener("beforeprint", showGovernanceForPrint);
  window.addEventListener("afterprint", restoreGovernanceAfterPrint);

  buildGovernanceTrack();
}

const outcomesTrack = document.querySelector("[data-outcomes-track]");
const outcomesPrev = document.querySelector("[data-outcomes-prev]");
const outcomesNext = document.querySelector("[data-outcomes-next]");

if (outcomesTrack && outcomesPrev && outcomesNext) {
  let currentIndex = 0;
  let currentVisibleCount = 4;
  let currentMaxIndex = 0;
  let isAnimating = false;

  const visibleOutcomesCount = () => {
    if (window.innerWidth <= 760) return 1;
    if (window.innerWidth <= 1100) return 2;
    return 3;
  };

  const getOutcomeStep = () => {
    const firstItem = outcomesTrack.querySelector(".outcome-card");

    if (!firstItem) return 0;

    const gap = Number.parseFloat(window.getComputedStyle(outcomesTrack).columnGap || window.getComputedStyle(outcomesTrack).gap || "22");
    return firstItem.getBoundingClientRect().width + gap;
  };

  const updateOutcomeButtons = () => {
    outcomesPrev.disabled = currentIndex <= 0;
    outcomesNext.disabled = currentIndex >= currentMaxIndex;
  };

  const setOutcomeTranslate = (withTransition = true) => {
    const step = getOutcomeStep();
    outcomesTrack.style.transition = withTransition ? "transform 420ms ease" : "none";
    outcomesTrack.style.transform = `translateX(${-currentIndex * step}px)`;
  };

  const buildOutcomesTrack = () => {
    currentVisibleCount = visibleOutcomesCount();
    const itemCount = outcomesTrack.children.length;
    currentMaxIndex = Math.max(0, itemCount - currentVisibleCount);
    currentIndex = Math.min(currentIndex, currentMaxIndex);
    requestAnimationFrame(() => {
      setOutcomeTranslate(false);
      updateOutcomeButtons();
    });
  };

  const moveOutcomes = (direction) => {
    if (isAnimating) return;

    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex > currentMaxIndex) return;

    isAnimating = true;
    currentIndex = nextIndex;
    requestAnimationFrame(() => setOutcomeTranslate(true));
    updateOutcomeButtons();
  };

  outcomesPrev.addEventListener("click", () => {
    moveOutcomes(-1);
  });

  outcomesNext.addEventListener("click", () => {
    moveOutcomes(1);
  });

  outcomesTrack.addEventListener("transitionend", () => {
    isAnimating = false;
  });

  let outcomeResizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(outcomeResizeTimer);
    outcomeResizeTimer = window.setTimeout(() => {
      buildOutcomesTrack();
    }, 120);
  });

  const showOutcomesForPrint = () => {
    outcomesTrack.style.transition = "none";
    outcomesTrack.style.transform = "none";
    outcomesPrev.disabled = true;
    outcomesNext.disabled = true;
  };

  const restoreOutcomesAfterPrint = () => {
    buildOutcomesTrack();
  };

  window.addEventListener("beforeprint", showOutcomesForPrint);
  window.addEventListener("afterprint", restoreOutcomesAfterPrint);

  buildOutcomesTrack();
}

const moduleAccordions = Array.from(document.querySelectorAll("[data-module-accordion]"));
let modulePrintState = [];

const openModulesForPrint = () => {
  modulePrintState = moduleAccordions.map((item) => item.open);
  for (const item of moduleAccordions) {
    item.open = true;
  }
};

const restoreModulesAfterPrint = () => {
  moduleAccordions.forEach((item, index) => {
    item.open = Boolean(modulePrintState[index]);
  });
};

window.addEventListener("beforeprint", openModulesForPrint);
window.addEventListener("afterprint", restoreModulesAfterPrint);
