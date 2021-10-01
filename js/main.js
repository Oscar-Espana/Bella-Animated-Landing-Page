gsap.registerPlugin(ScrollTrigger);

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

function init() {
  initNavigation();
  initHeaderTilt();
}

window.addEventListener("load", function () {
  init();
});
