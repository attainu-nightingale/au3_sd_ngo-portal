$(".carousel").carousel({
  interval: 200000
});

var swiper = new Swiper(".swiper-container-1", {
  slidesPerView: 1,
  spaceBetween: 10,

  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },
  keyboard: {
    enabled: true
  },
  navigation: {
    nextEl: ".g-swiper-button-next",
    prevEl: ".g-swiper-button-prev"
  },
  breakpointsInverse: true,
  breakpoints: {
    320: {
      slidesPerView: "auto",
      slidesPerColumn: 1,
      spaceBetween: 10,
      centeredSlides: false,
      slidesOffsetBefore: 10,
      slidesOffsetAfter: 0,
      centerInsufficientSlides: true
    },
    480: {
      slidesPerView: "auto",
      slidesPerColumn: 1,
      spaceBetween: 10,
      centeredSlides: false,
      slidesOffsetBefore: 10,
      slidesOffsetAfter: 0,
      centerInsufficientSlides: true
    },
    680: {
      slidesPerView: 3,
      spaceBetween: 20,
      centeredSlides: true
    }
  }
});
