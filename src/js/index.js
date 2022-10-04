import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import photoMarkupTemplate from '../templates/photoCard.hbs';

import LoadMoreBtn from './load-more-btn';

const inputRef = document.querySelector('input[type="text"]');
const btnSearch = document.querySelector('.btn-submit');
const gallery = document.querySelector('.gallery');
const btnToTop = document.querySelector('.to-top');

const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });

const gallerySimpleLightbox = new SimpleLightbox('.gallery a');
let pageNumber = 1;

// btnLoadMore.style.display = 'none';
btnToTop.style.display = 'none';

btnSearch.addEventListener('click', onBtnSearchClick);

function onBtnSearchClick(e) {
  e.preventDefault();
  cleanGallery();
  const trimmedValue = inputRef.value.trim();
  if (trimmedValue !== '') {
    loadMoreBtn.show();
    loadMoreBtn.disable();
    fetchImages(trimmedValue, pageNumber).then(data => {
      //   console.log('onBtnSearchClick', data);
      if (data.totalHits === 0) {
        loadMoreBtn.hide();
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderImageList(data.hits);

        loadMoreBtn.disable();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        if (data.totalHits > 0 && data.totalHits < 40) {
          loadMoreBtn.hide();
          Notiflix.Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
        } else {
          loadMoreBtn.enable();
        }
        gallerySimpleLightbox.refresh();
      }
    });
  }
}

loadMoreBtn.refs.button.addEventListener('click', onBtnLoadMoreClick);

function onBtnLoadMoreClick() {
  const trimmedValue = inputRef.value.trim();
  pageNumber += 1;
  btnToTop.style.display = 'inline-flex';
  loadMoreBtn.disable();
  fetchImages(trimmedValue, pageNumber).then(data => {
    renderImageList(data.hits);
    // console.log('onBtnLoadMoreClick', data);
    if (data.hits.length === 0 || data.hits.length < 40) {
      scrollByAfterLoadMore();
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.hide();
    } else {
      scrollByAfterLoadMore();
      loadMoreBtn.enable();

      gallerySimpleLightbox.refresh();
    }
  });
}

function renderImageList(images) {
  // ------з використанням шаблонізатора handlebars-----------------------
  gallery.insertAdjacentHTML('beforeend', photoMarkupTemplate(images));
}

function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  btnToTop.style.display = 'none';
  loadMoreBtn.hide();
}

function scrollByAfterLoadMore() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2.15,
    behavior: 'smooth',
  });
}

btnToTop.addEventListener('scroll', scrollToTop);
function scrollToTop(e) {
  e.preventDefault();
  window.scrollTo({
    top: 50,
    behavior: 'smooth',
  });
  btnToTop.removeEventListener('scroll', scrollToTop);
}
