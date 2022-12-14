import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import photoMarkupTemplate from '../templates/photoCard.hbs';

const inputRef = document.querySelector('input[type="text"]');
const btnSearch = document.querySelector('.btn-submit');
const gallery = document.querySelector('.gallery');
const btnToTop = document.querySelector('.to-top');
// -----------------slider-----------------------------------
const sliderRef = document.querySelector('.slider');
// -------------------pagination---------------------------

const paginationArrows = document.querySelectorAll('.pagination__arrow');
const paginationList = document.querySelector('.pagination__pages');

let items = [...paginationList.children];

// --------------------------------------------------------------
const gallerySimpleLightbox = new SimpleLightbox('.gallery a');

const trimmedValue = inputRef.value.trim();
let pageNumber = 1;
let pages = 0;

btnToTop.classList.add('visually-hidden');
paginationArrowsHide();

btnSearch.addEventListener('click', onBtnSearchClick);

function onBtnSearchClick(e) {
  e.preventDefault();
  cleanGallery();
  const trimmedValue = inputRef.value.trim();
  paginationArrows[0].disabled = true;
  if (trimmedValue !== '') {
    fetchImages(trimmedValue, pageNumber).then(data => {
      // console.log('onBtnSearchClick', data);
      if (data.totalHits === 0) {
        paginationList.innerHTML = '';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        pages = Math.ceil(data.totalHits / data.hits.length);

        renderImageList(data.hits);
        renderPagination(pages);
        paginationArrowsShow(pages, trimmedValue, pageNumber);
        hideOverPages();
        showPage(document.querySelector('.pagination__page--active'));

        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        if (data.totalHits > 0 && data.totalHits < 40) {
          paginationList.innerHTML = '';
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
  // ------?? ?????????????????????????? ?????????????????????????? handlebars-----------------------
  gallery.innerHTML = photoMarkupTemplate(images);
}

function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  paginationList.innerHTML = '';
  paginationArrowsHide();
  paginationArrows[0].disabled = true;
}

// ----------------slider-------------------

// -----pagination---------------------
function renderPagination(pages) {
  for (let i = 1; i <= pages; i += 1) {
    // console.log(i);
    const li = renderPaginationBtn(i);
    li.textContent = i;

    if (Number(i) === pageNumber) {
      li.classList.add('pagination__page--active');
    }
    paginationList.append(li);

    li.addEventListener('click', onLiItemPaginationClick);

    function onLiItemPaginationClick() {
      scrollToTop();
      const trimmedValue = inputRef.value.trim();
      let paginationPageNumber = Number(li.textContent);
      fetchImages(trimmedValue, paginationPageNumber).then(data => {
        showPage(document.querySelector('.pagination__page--active'));
        hideOverPages();

        // console.log(data);
        // console.log(paginationPageNumber, pages);
        renderImageList(data.hits);
        paginationArrows[0].disabled = false;
        ifPageNum(paginationPageNumber, pages);
        gallerySimpleLightbox.refresh();
      });

      const currentItemLi = document.querySelector(
        'li.pagination__page--active'
      );
      currentItemLi.classList.remove('pagination__page--active');
      li.classList.add('pagination__page--active');
    }
  }
}

function renderPaginationBtn() {
  const liEl = document.createElement('li');
  liEl.classList.add('pagination__page');
  return liEl;
}

paginationArrows[0].addEventListener('click', onPaginationArrowLeftClick);
paginationArrows[1].addEventListener('click', onPaginationArrowRightClick);

// ?????????????? ?????? ?????????? ???? ???????? ??????????????
function onPaginationArrowLeftClick(ev) {
  const currentPage = document.querySelector('.pagination__page--active');
  // console.dir(currentPage);
  let pageForArrowleft = Number(currentPage.innerHTML);
  if (ev.target === paginationArrows[0]) {
    fetchImages(trimmedValue, (pageForArrowleft -= 1)).then(data => {
      renderImageList(data.hits);
      showPage(currentPage.previousSibling);
      hideOverPages();
      currentPage.previousSibling.classList.add('pagination__page--active');
      currentPage.classList.remove('pagination__page--active');
      ifPageNum(pageForArrowleft, pages);

      showItemByArrowPagination(currentPage.previousSibling.previousSibling);

      // gallerySimpleLightbox.refresh();
    });
  }
}

// ?????????????? ?????? ?????????? ???? ?????????? ??????????????
function onPaginationArrowRightClick(ev) {
  const currentPage = document.querySelector('.pagination__page--active');
  // console.dir(currentPage);
  let pageForArrowRight = Number(currentPage.innerHTML);
  if (ev.target === paginationArrows[1]) {
    fetchImages(trimmedValue, (pageForArrowRight += 1)).then(data => {
      // console.dir(currentPage.nextSibling);
      renderImageList(data.hits);
      showPage(currentPage.nextSibling);
      hideOverPages();
      currentPage.nextSibling.classList.add('pagination__page--active');
      currentPage.classList.remove('pagination__page--active');
      ifPageNum(pageForArrowRight, pages);

      showItemByArrowPagination(currentPage.nextSibling.nextSibling);
    });
  }
}

//------------------ ???????????? ??-?????? ?????? arrowListener------------------
function showItemByArrowPagination(itemToShow) {
  if (itemToShow !== null) {
    itemToShow.classList.remove('hidden');
  }
  scrollToTop();
  gallerySimpleLightbox.refresh();
}

// ???????????? ?????????????? ?????? ???????? ?????????????? ????????????????, ?????? ???????????? ????????????-?????????????? ??????????????????????
function ifPageNum(page, pages) {
  paginationArrowsEnable();
  if (page === pages) {
    paginationArrows[1].disabled = true;
  }
  if (page === 1) {
    paginationArrows[0].disabled = true;
  }
}

// ?????????? ????????????-?????????????? ??????????????????
function paginationArrowsHide() {
  paginationArrows[0].classList.add('visually-hidden');
  paginationArrows[1].classList.add('visually-hidden');
}

// ?????????????? ????????????-?????????????? ??????????????????, ?????? ??????????, ???? ???????????????? ???????????????? ?????? 5 ?? ????????????
function paginationArrowsShow(pages, trimmedValue, pageNumber) {
  paginationArrows[0].classList.remove('visually-hidden');
  paginationArrows[1].classList.remove('visually-hidden');

  if (pages < 5) {
    paginationArrows[0].classList.add('visually-hidden');
    paginationArrows[1].classList.add('visually-hidden');
  }
}

// ---------------???????????? ????????????-?????????????? ?????????????????? ?????????????????????? -----------------
function paginationArrowsEnable() {
  paginationArrows[0].disabled = false;
  paginationArrows[1].disabled = false;
}

// -------------callback-?????????????? ?????? ?????????????????? ???????????????????? ???????????????? ... -------------------
let active;
function showPage(item) {
  if (active) {
    active.classList.remove('pagination__page--active');
    active = item;
    item.classList.add('pagination__page--active');

    let showPage = 2;
    let pageNum = +active.innerHTML;

    let start = (pageNum - 1) * showPage;
    let end = start + showPage;
    let notes = items.slice(start, end);

    for (let note of notes) {
      hideOverPages();
    }
  }
}

// -----?????????????????? ???????????????? ???? ?????????????????? (...) ???? ??????????????.
function hideOverPages() {
  let active = document.querySelector('.pagination__page--active');
  let items = [...paginationList.children];

  if (items.length > 6) {
    items.forEach(item => item.classList.add('hidden'));
    items[0].classList.remove('hidden');

    if (active.previousSibling) {
      active.previousSibling.classList.remove('hidden');
    }
    active.classList.remove('hidden');
    if (active.nextSibling) {
      active.nextSibling.classList.remove('hidden');
    }
    items[items.length - 1].classList.remove('hidden');
  }
}

//  ?????????????? ?????? ?????????????????????????? ???????????? ?????????? (???? ??????????????) ?????????? ???????????????? ????????????????
function scrollToTop() {
  window.scrollTo({
    top: 50,
    behavior: 'smooth',
  });
}
