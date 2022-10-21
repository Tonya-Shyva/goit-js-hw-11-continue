// don't forget to hook up this script to main html

import throttle from 'lodash.throttle';
const btnToTop = document.querySelector('.to-top');

window.addEventListener('scroll', throttle(hideElOnScroll(btnToTop), 250));

btnToTop.addEventListener('click', scrollToTop);

function hideElOnScroll(el) {
  return function hideOnScroll() {
    if (scrollY < document.documentElement.clientHeight) {
      el.classList.add('visually-hidden');
    } else {
      el.classList.remove('visually-hidden');
    }
  };
}

function scrollToTop(e) {
  e.preventDefault();
  window.scrollTo({
    top: 50,
    behavior: 'smooth',
  });
  btnToTop.removeEventListener('scroll', scrollToTop);
}
