import './WordComponent.js';

// loadTheme();
if (localStorage.getItem('theme')) {
  localStorage.setItem('theme', null);
}

const wordsUl = document.querySelector('.words ul');
const searchInput = document.querySelector('#search-input');
const snackbar = document.getElementById("toast");
const toggleThemeBtn = document.getElementById('toggle-theme-btn');
const loaderElement = document.querySelector('.loader-container');
const clearSearchBtn = document.getElementById('clear-search-btn');

disableSearchInteraction();

let wordsList = [];

const saveWords = (value) => {
  wordsList = value;
}

const getWords = async () => {
  const url = `https://arabicwords.herokuapp.com/api/words`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.log("Couldn't get words");
      return;
    }

    const words = await res.json();
    saveWords(words);

    return words;

  } catch (error) {
    console.log('Error', error);

  }
}

const clearDOM = () => {
  while (wordsUl.firstChild) {
    wordsUl.lastChild.remove();
  }
}

// using a web component
const renderWords = (words) => {
  words.forEach(word => {
    const wordComponent = document.createElement('word-component');
    wordComponent.word = word;
    wordComponent.onclick = () => copyWord(word);
    wordsUl.appendChild(wordComponent);
  });
}

const showNoResultsFound = () => {
  const message = 'No results match your search';
  const messageElement = document.createElement('div');
  messageElement.classList.add('no-results');
  messageElement.textContent = message;
  wordsUl.appendChild(messageElement);
}

function showErrorMessage(msg) {
  const message = `Error: ${msg}`;
  const messageElement = document.createElement('div');
  messageElement.classList.add('error');
  messageElement.textContent = message;
  wordsUl.appendChild(messageElement);
}


const filterEnglish = (query) => {
  return wordsList.filter(word => word.en.trim().toLowerCase().includes(query));
}

const filterArabic = (query) => {
  return wordsList.filter(word => word.ar.trim().toLowerCase().includes(query));
}

const filterWords = (query) => {
  let filtered = filterEnglish(query);
  clearDOM();

  if (filtered.length === 0) {
    filtered = filterArabic(query);
    clearDOM();
  }


  if (filtered.length === 0) {
    showNoResultsFound();
  } else {
    renderWords(filtered);
  }
}

const onSearchInputChange = (e) => {
  const value = e.target.value;
  const query = value.trim().toLowerCase();
  filterWords(query);

  // show/hide clear search btn
  if (value) {
    clearSearchBtn.classList.remove('hide');
  } else {
    clearSearchBtn.classList.add('hide');
  }
}

const alertCopySuccess = async () => {
  snackbar.classList.add('show-toast');
  await new Promise(resolve => setTimeout(resolve, 1200));
  snackbar.classList.remove('show-toast');
}

// const copyWord = async (target) => {
//   const mediaQuery = window.matchMedia('(min-width: 768px)');

//   if (mediaQuery.matches) {
//     return;
//   }

//   const arabicText = target.children[1].textContent;

//   try {
//     await navigator.clipboard.writeText(arabicText);
//     alertCopySuccess();
//   }
//   catch (err) {
//     console.error('Failed to copy: ', err);
//   }
// }

const copyWord = async (word) => {
  const mediaQuery = window.matchMedia('(min-width: 768px)');

  // if (mediaQuery.matches) {
  //   return;
  // }

  const arabicText = word.ar;

  try {
    await navigator.clipboard.writeText(arabicText);
    alertCopySuccess();
  }
  catch (err) {
    console.error('Failed to copy: ', err);
  }
}

// load theme from local storage
function loadTheme() {
  const loadedTheme = localStorage.getItem('theme');
  document.documentElement.setAttribute('data-theme', loadedTheme || 'dark');
}

// save theme to local storage
function saveTheme(value) {
  localStorage.setItem('theme', value);
}

// toggle theme
function toggleTheme(e) {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  let newTheme;

  switch (currentTheme) {
    case 'light':
      newTheme = 'dark';
      break;
    case 'dark':
      newTheme = 'light';
      break;
    default:
      return;
  }

  document.documentElement.setAttribute('data-theme', newTheme);
  saveTheme(newTheme);
}

function enableSearchInteraction() {
  searchInput.removeAttribute('disabled');
}

function disableSearchInteraction() {
  searchInput.setAttribute('disabled', true);
}

function removeLoaderElement() {
  loaderElement.classList.add('hide');
}

// get words then render them
getWords().then(function (words) {
  removeLoaderElement();
  renderWords(words);
  enableSearchInteraction();
  focusElement(searchInput);
});

function focusElement(element) {
  element.focus();
}

function clearSearchInput(e) {
  if (searchInput.value) {
    searchInput.value = '';
    const event = new Event('input');
    // Dispatch it.
    searchInput.dispatchEvent(event);
    focusElement(searchInput);
  }
}

// async function playWordSound(target) {

//   if (currentAudio) {
//     currentAudio.pause();
//   }
//   currentAudio = new Audio(target.dataset.sound);
//   currentAudio.play();

// }

function onWordClick(e) {

  // if (mouseIsDown) return;

  const target = isWordElement(e.target);

  if (!target) {
    // console.log(e.target);
    return
  };
  console.log(target.word);

  copyWord(target.word);
}

function isWordElement(target) {
  if (target.tagName === 'UL') {
    return false;
  } else if (target.tagName === 'word-component') {
    console.log(target.word);
    return target;
  } else {
    return true && isWordElement(target.parentElement);
  }
}


const body = document.body;
let top = 0;
let mouseStartPosition;
let mouseIsDown = false;

// when mouse is clicked
function onMouseDown(e) {
  if (!isBody(e.target)) return;

  e.preventDefault();
  mouseIsDown = true;

  body.style.cursor = 'grabbing';
  body.style.userSelect = 'none';

  top = window.scrollY;

  mouseStartPosition = e.clientY;
}

function onMouseMove(e) {
  e.preventDefault();

  if (!isBody(e.target)) return;
  if (!mouseIsDown) return;

  const dy = e.clientY - mouseStartPosition;

  window.scrollTo(0, top - dy);
}

function onMouseUp(e) {
  mouseIsDown = false;
  body.style.cursor = 'grab';
  body.style.removeProperty('user-select');
}

function isBody(target) {
  return target.tagName === 'BODY';
}

body.addEventListener('mousedown', onMouseDown);
body.addEventListener('mousemove', onMouseMove);
body.addEventListener('mouseup', onMouseUp);

searchInput.addEventListener("input", onSearchInputChange);
// toggleThemeBtn.addEventListener("click", toggleTheme);
clearSearchBtn.addEventListener("click", clearSearchInput);
wordsUl.addEventListener("click", onWordClick);