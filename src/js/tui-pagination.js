import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import photoMarkupTemplate from '../templates/photoCard.hbs';
// import { scrollToTop } from './btn-to-top';

import LoadMoreBtn from './load-more-btn';

const inputRef = document.querySelector('input[type="text"]');
const btnSearch = document.querySelector('.btn-submit');
const gallery = document.querySelector('.gallery');
const btnToTop = document.querySelector('.to-top');
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });
const paginationEl = document.querySelector('.pagination');

const gallerySimpleLightbox = new SimpleLightbox('.gallery a');
let pageNumber = 1;
let pages = 0;

btnToTop.classList.add('visually-hidden');

btnSearch.addEventListener('click', onBtnSearchClick);

function onBtnSearchClick(e) {
  e.preventDefault();
  cleanGallery();
  const trimmedValue = inputRef.value.trim();
  if (trimmedValue !== '') {
    fetchImages(trimmedValue, pageNumber).then(data => {
      console.log('onBtnSearchClick', data);
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        pages = Math.ceil(data.totalHits / data.hits.length);
        renderImageList(data.hits);

        displayPaginationBtn(pageNumber);
        displayPagination(pages);

        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        if (data.totalHits > 0 && data.totalHits < 40) {
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
        }
      }
      gallerySimpleLightbox.refresh();
    });
  }
}

function renderImageList(images) {
  // ------з використанням шаблонізатора handlebars-----------------------
  gallery.innerHTML = photoMarkupTemplate(images);
}

function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  paginationEl.innerHTML = '';
}

// -----pagination---------------------

function displayPagination(pages) {
  const ulEl = document.createElement('ul');
  ulEl.classList.add('pagination__list');

  for (let i = 1; i <= pages; i++) {
    const li = displayPaginationBtn(i);
    li.textContent = i;

    if (Number(i) === pageNumber) {
      li.classList.add('pagination__item--active');
    }
    ulEl.append(li);

    li.addEventListener('click', () => {
      scrollToTop();
      const trimmedValue = inputRef.value.trim();

      fetchImages(trimmedValue, li.textContent).then(data => {
        // console.log(data);
        // console.log(pageNumber, pages);
        renderImageList(data.hits);
        gallerySimpleLightbox.refresh();
      });

      const currentItemLi = document.querySelector(
        'li.pagination__item--active'
      );
      currentItemLi.classList.remove('pagination__item--active');

      li.classList.add('pagination__item--active');
    });
  }
  paginationEl.append(ulEl);
}

function displayPaginationBtn() {
  const liEl = document.createElement('li');
  liEl.classList.add('pagination__item');
  return liEl;
}

function scrollToTop() {
  window.scrollTo({
    top: 50,
    behavior: 'smooth',
  });
}
// --------------------------------------------------
paginationArrows[0].addEventListener('click', onPaginationArrowLeftClick);

function onPaginationArrowLeftClick(ev) {
  const currentPage = document.querySelector('.pagination__page--active');
  // console.dir(currentPage);
  let pageForArrowleft = Number(currentPage.innerHTML);
  if (ev.target === paginationArrows[0]) {
    fetchImages(trimmedValue, (pageForArrowleft -= 1)).then(data => {
      currentPage.prevSibling.classList.add('pagination__page--active');
      currentPage.classList.remove('pagination__page--active');
      pages = Math.ceil(data.totalHits / data.hits.length);
      console.log(pages, pageNumber);
      renderImageList(data.hits);
      scrollToTop();
      if (pageNumber === 1) {
        paginationArrows[0].disabled = true;
      } else {
        paginationArrows[0].disabled = false;
      }
      gallerySimpleLightbox.refresh();
    });
  }
}
paginationArrows[1].addEventListener('click', onPaginationArrowRightClick);

function onPaginationArrowRightClick(ev) {
  const currentPage = document.querySelector('.pagination__page--active');
  // console.dir(currentPage);
  let pageForArrowRight = Number(currentPage.innerHTML);
  if (ev.target === paginationArrows[1]) {
    fetchImages(trimmedValue, (pageForArrowRight += 1)).then(data => {
      // console.log(currentPage);
      currentPage.nextSibling.classList.add('pagination__page--active');
      currentPage.classList.remove('pagination__page--active');
      pages = Math.ceil(data.totalHits / data.hits.length);
      console.log(pages, pageForArrowRight);
      renderImageList(data.hits);
      scrollToTop();
      if (pages === pageForArrowRight) {
        paginationArrows[1].disabled = true;
      } else {
        paginationArrows[1].disabled = false;
      }
      gallerySimpleLightbox.refresh();
    });
  }
}
