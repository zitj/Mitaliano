import { hideList } from './utilities/list.js';
import { debounce } from './utilities/debounce.js';
import { randomiseVerbs } from './utilities/verbs-service.js';
import { switchingSections } from './utilities/section-switcher.js';

const wantedVerbsInput = document.querySelector('#wanted-verbs-input');
const verbsContainer = document.querySelector('#verbs-container');
const listOfVerbs = document.querySelector('#list-of-verbs');
const heading = verbsContainer.children[0];
const navigationLinks = document.querySelectorAll('.navigation-link');
const sections = document.querySelectorAll('section');

let randomVerbs = [];

wantedVerbsInput.addEventListener(
	'keyup',
	debounce((e) => {
		if (e.target.value === '') {
			heading.innerHTML = '';
			hideList(listOfVerbs);
			return;
		}
		randomiseVerbs(listOfVerbs, heading, randomVerbs, wantedVerbsInput);
	}, 500)
);

document.addEventListener('click', (e) => {
	let elementClicked = e.target;
	let className = elementClicked.className;

	if (className === 'link') {
		elementClicked.classList.add('visited');
	}
	if (className === 'navigation-link') {
		switchingSections(elementClicked, navigationLinks, sections);
	}
});
