gsap.registerPlugin(ScrollTrigger);

function initNavigation() {
  const mainNavLink = gsap.utils.toArray(".main-nav a");
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
}

function init() {
  initNavigation();
}

window.addEventListener("load", function () {
  init();
});
