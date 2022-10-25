const themeContainer = document.querySelector('.themetoggle__container');
const searchContainer = document.querySelector('.form-container');
const galleryContainer = document.querySelector('.gallery');
const darkIcon = document.querySelector('.themetoggle__icon-dark');

themeContainer.addEventListener('click', toggleLightThemeClick);

function toggleLightThemeClick(e) {
  e.preventDefault();
  if (e.target.nodeName === 'svg' || e.target.nodeName === 'use') {
    darkIcon.classList.toggle('is-shown');
    searchContainer.classList.toggle('js-dark-theme');
    galleryContainer.classList.toggle('js-dark-theme');
  }
}
