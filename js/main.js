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
    console.log("direction", direction);
    const scrollingDonw = direction === 1;
    const links = scrollingDonw ? mainNavLink : mainNavLinkRev;
    return gsap.to(links, {
      duration: 0.5,
      stagger: 0.075, //tambalear
      autoAlpha: () => (scrollingDonw ? 0 : 1), // 0: hidden, 1: visible
      y: () => (scrollingDonw ? 20 : 0),
      ease: "power4.out"
    });
  }

  ScrollTrigger.create({
    start: 100,
    end: "bottom bottom-=100",  //it means: marker is en end of body tag and scroll-end is in the bottom of page -100px 
    toggleClass: {
      targets: "body",
      className: "has-scrolled",
    },
    onEnter: ({ direction }) => navAnimation(direction),
    onLeaveBack: ({ direction }) => navAnimation(direction),
    markers: true,
  });
}

function init() {
  initNavigation();
}

window.addEventListener("load", function () {
  init();
});
