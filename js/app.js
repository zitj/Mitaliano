import { hideList } from './utilities/list.js';
import { debounce } from './utilities/debounce.js';
import { switchingSections } from './utilities/section-switcher.js';
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

document.addEventListener('click', (e) => {
	let elementClicked = e.target;
	let className = elementClicked.className;

	if (className === 'verb-link') {
		elementClicked.classList.add('visited');
	}
	if (className === 'navigation-link') {
		switchingSections(elementClicked, navigationLinks, sections);
	}
	if (className === 'translation-button') {
		let nextSibling = e.srcElement.nextElementSibling;
		elementClicked.classList.add('hide');
		nextSibling.classList.remove('hide');
	}

	if (elementClicked.id === 'next-btn') {
		randomise('words', listOfWords, randomWords);
	}
});
