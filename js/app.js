import { hideList } from './utilities/list.js';
import { debounce } from './utilities/debounce.js';
import { switchSections } from './utilities/section-switcher.js';
import { randomise } from './services/shared-service.js';

const wantedVerbsInput = document.querySelector('#wanted-verbs-input');
const verbsContainer = document.querySelector('#verbs-container');
const listOfVerbs = document.querySelector('#list-of-verbs');
const heading = verbsContainer.children[0];
const navigationLinks = document.querySelectorAll('.navigation-link');
const sections = document.querySelectorAll('section');
const listOfWords = document.querySelector('#list-of-words');

let randomWords = [];
let randomVerbs = [];

wantedVerbsInput.addEventListener(
	'keyup',
	debounce((e) => {
		if (e.target.value === '') {
			heading.innerHTML = '';
			hideList(listOfVerbs);
			return;
		}
		randomise('verbs', listOfVerbs, randomVerbs);
	}, 500)
);

const showTranslation = (button) => {
	let translation = button.srcElement.nextElementSibling;
	button.target.classList.add('hide');
	translation.classList.remove('hide');
};

const clickLogic = (element) => {
	let elementClicked = element.target;
	let className = elementClicked.className;

	if (className === 'verb-link') elementClicked.classList.add('visited');
	if (className === 'navigation-link') switchSections(elementClicked, navigationLinks, sections);
	if (className === 'translation-button') showTranslation(element);
	if (elementClicked.id === 'next-btn') {
		let card = elementClicked.parentElement;
		card.classList.add('outro');
		card.addEventListener('animationend', (event) => {
			card.classList.remove('outro');
			randomise('words', listOfWords, randomWords);
		});
	}
};

document.addEventListener('click', (element) => {
	clickLogic(element);
});
