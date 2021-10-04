gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", function () {
  init();
});

function init() {
  initNavigation();
  initHeaderTilt();
  initPortfolioHover();
}

// Start Navigation Header
function initNavigation() {
  const mainNavLink = gsap.utils.toArray(".main-nav a");
  const mainNavLinkRev = gsap.utils.toArray(".main-nav a").reverse();
  mainNavLink.forEach((link) => {
    link.addEventListener("mouseleave", function (event) {
      //add class
      link.classList.add("animate-out");
      setTimeout(() => {
        //remove class after 300ms
        link.classList.remove("animate-out");
      }, 300);
    });
  });

  function navAnimation(direction) {
    const scrollingDonw = direction === 1;
    const links = scrollingDonw ? mainNavLink : mainNavLinkRev;
    return gsap.to(links, {
      duration: 0.5,
      stagger: 0.075, //tambalear
      autoAlpha: () => (scrollingDonw ? 0 : 1), // 0: hidden, 1: visible
      y: () => (scrollingDonw ? 20 : 0),
      ease: "power4.out",
    });
  }

  ScrollTrigger.create({
    start: 100,
    end: "bottom bottom-=100", //it means: marker is en end of body tag and scroll-end is in the bottom of page -100px
    toggleClass: {
      targets: "body",
      className: "has-scrolled",
    },
    onEnter: ({ direction }) => navAnimation(direction),
    onLeaveBack: ({ direction }) => navAnimation(direction),
  });
}

function initHeaderTilt() {
  document.querySelector("header").addEventListener("mousemove", moveImages);
}

function moveImages(event) {
  const { offsetX, offsetY, target } = event;
  const { clientWidth, clientHeight } = target;
  // console.log(offsetX, offsetY, clientWidth, clientHeight)

  // get 0 0 in the center
  const xPos = offsetX / clientWidth - 0.5;
  const yPos = offsetY / clientHeight - 0.5;

  const leftImages = gsap.utils.toArray(".hg__left .hg__image");
  const rightImages = gsap.utils.toArray(".hg__right .hg__image");
  const modifier = (index) => index * 1.2 + 0.5;

  //move left 3 images
  leftImages.forEach((image, index) => {
    gsap.to(image, {
      duration: 1.2,
      x: xPos * 20 * modifier(index),
      y: yPos * 30 * modifier(index),
      rotationX: yPos * 10,
      rotationY: xPos * 40,
      ease: "power3.out",
    });
  });

  //move right 3 images
  rightImages.forEach((image, index) => {
    gsap.to(image, {
      duration: 1.2,
      x: xPos * 20 * modifier(index),
      y: -yPos * 30 * modifier(index),
      rotationX: yPos * 10,
      rotationY: xPos * 40,
      ease: "power3.out",
    });
  });

  gsap.to(".decor__circle", {
    duration: 1.7,
    x: 100 * xPos,
    y: 120 * yPos,
    ease: "power4.out",
  });
}
// Finish Navigation Header

// Start Reveal Gallery
const sections = document.querySelectorAll(".rg__column");

//define a breakpoint
const mq = window.matchMedia("(min-width: 768px)");

// add change listener to tjis breakpoint
mq.addEventListener("change", handleWidthChange);

//first page load
handleWidthChange(mq);

function initHoverReveal() {
  sections.forEach((section) => {
    //get components for animation
    section.imageBlock = section.querySelector(".rg__image");
    section.image = section.querySelector(".rg__image img");
    section.mask = section.querySelector(".rg__image--mask ");
    section.text = section.querySelector(".rg__text");
    section.textCopy = section.querySelector(".rg__text--copy");
    section.textMask = section.querySelector(".rg__text--mask");
    section.textP = section.querySelector(".rg__text--copy p");

    //reset the initial position
    gsap.set([section.imageBlock, section.textMask], { yPercent: -101 });
    gsap.set([section.mask, section.textP], { yPercent: 100 });
    gsap.set(section.image, { scale: 1.2 });

    //add event listeners to each section
    section.addEventListener("mouseenter", createHoverReveal);
    section.addEventListener("mouseleave", createHoverReveal);
  });
}

function getTextHeight(textCopy) {
  return textCopy.clientHeight;
}

function createHoverReveal(event) {
  const { imageBlock, mask, text, textCopy, textMask, textP, image } =
    event.target;
  const tl = gsap.timeline({
    defaults: {
      duration: 0.7,
      ease: "Power4.out",
    },
  });

  if (event.type === "mouseenter") {
    tl.to([mask, imageBlock, textMask, textP], { yPercent: 0 })
      .to(
        text,
        {
          y: () => -getTextHeight(textCopy) / 2,
        },
        0
      )
      .to(image, { duration: 1.1, scale: 1 }, 0);
  } else if (event.type === "mouseleave") {
    tl.to([mask, textP], { yPercent: 100 })
      .to([imageBlock, textMask], { yPercent: -101 }, 0)
      .to(text, { y: 0 }, 0)
      .to(image, { scale: 1.2 }, 0);
  }
  return tl;
}

function resetProps(elements) {
  //stop all tweents
  gsap.killTweensOf("*");

  if (elements.length) {
    elements.forEach((element) => {
      element && gsap.set(element, { clearProps: "all" });
    });
  }
}

function handleWidthChange(mq) {
  //check if we are on the right breakpoint
  if (mq.matches) {
    //setup hover animation
    initHoverReveal();
  } else {
    //width is less than 768px
    console.log("we are on mobile");

    //remove event listener for each section
    sections.forEach((section) => {
      section.removeEventListener("mouseenter", createHoverReveal);
      section.removeEventListener("mouseleave", createHoverReveal);

      const { imageBlock, mask, text, textCopy, textMask, textP, image } =
        section;

      // reset all applied styles
      resetProps([imageBlock, mask, text, textCopy, textMask, textP, image]);
    });
  }
}

// Finish  Reveal Gallery

// Start Portfolio

// create hover effect for each portfolio navigation item
const allLinks = gsap.utils.toArray(".portfolio__categories a");
const pageBackground = document.querySelector(".fill-background");
const largeImage = document.querySelector(".portfolio__image--l");
const smallImage = document.querySelector(".portfolio__image--s");
const lInside = document.querySelector(".portfolio__image--l .image_inside");
const sInside = document.querySelector(".portfolio__image--s .image_inside");

function initPortfolioHover() {
  allLinks.forEach((link) => {
    link.addEventListener("mouseenter", createPortfolioHover);
    link.addEventListener("mouseleave", createPortfolioHover);
    link.addEventListener("mousemove", createPortfolioMove);
  });
}

function createPortfolioHover(e) {
  if (e.type === "mouseenter") {
    // change images to the right urls
    // fade in images
    // all siblings to white and fade out
    // active link to white
    // update page background color

    const { color, imagelarge, imagesmall } = e.target.dataset;
    const allSiblings = allLinks.filter((item) => item !== e.target);
    const tl = gsap.timeline();
    tl.set(lInside, { backgroundImage: `url(${imagelarge})` })
      .set(sInside, { backgroundImage: `url(${imagesmall})` })
      .to([largeImage, smallImage], { autoAlpha: 1 })
      .to(allSiblings, { color: "#fff", autoAlpha: 0.2 }, 0)
      .to(e.target, { color: "#fff", autoAlpha: 1 }, 0)
      .to(pageBackground, { background: color, ease: "none" }, 0);
  } else if (e.type === "mouseleave") {
    // fade out images
    // all links back to black
    // change background color back to default #ACB7AE
    const tl = gsap.timeline();
    tl.to([largeImage, smallImage], { autoAlpha: 0 })
      .to(allLinks, { color: "#000000", autoAlpha: 1 }, 0)
      .to(pageBackground, { background: "#acb7ae", ease: "none" }, 0);
  }
}

function createPortfolioMove(e) {
  const { clientY } = e;

  //move large image
  gsap.to(largeImage, {
    duration: 1.2,
    y: getPortfolioOffset(clientY) / 6,
    ease: "Power3.out",
  });

  //move small image
  gsap.to(smallImage, {
    duration: 1.5,
    y: -getPortfolioOffset(clientY) / 3,
    ease: "Power3.inOut",
  });
}

function getPortfolioOffset(clientY) {
  return -(
    document.querySelector(".portfolio__categories").clientHeight - clientY
  );
}
// Finish Portfolio
