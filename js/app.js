import { verbs } from '../data/verbs.js';
import { showList, hideList } from './utilities/list.js';
import { addHeadingError, removeHeadingError } from './utilities/heading.js';
import { debounce } from './utilities/debounce.js';

const wantedVerbsInput = document.querySelector('#wanted-verbs-input');
const verbsContainer = document.querySelector('#verbs-container');
const listOfVerbs = document.querySelector('#list-of-verbs');
const heading = verbsContainer.children[0];
const navigationLinks = document.querySelectorAll('.navigation-link');
const sections = document.querySelectorAll('section');

const VERBS = 'verbs-section-link';
const WORDS = 'words-section-link';

let randomVerbs = [];

const returnVerbsLength = () => {
	let counter = 0;
	for (let verb in verbs) {
		counter++;
	}
	return counter;
};

const renderVerbs = () => {
	let content = ``;

	randomVerbs.forEach((verb) => {
		content += `<a class="link" href='https://www.italian-verbs.com/italian-verbs/conjugation.php?parola=${verb}'  target="_blank">${verb}</a>`;
	});

	showList(listOfVerbs, content);
};

const showRandomisedVerbs = (totalNumberOfVerbs, wantedNumberOfVerbs) => {
	let arrayWithDuplicates = [];
	let arrayOfRandomNumbers = [];
	randomVerbs = [];

	if (wantedNumberOfVerbs > totalNumberOfVerbs) {
		addHeadingError(heading, totalNumberOfVerbs);
		hideList(listOfVerbs);
		return;
	}

	removeHeadingError(heading);

	while (arrayOfRandomNumbers.length < wantedNumberOfVerbs) {
		let randomNumber = Math.floor(Math.random() * totalNumberOfVerbs);
		arrayWithDuplicates.push(randomNumber);
		arrayOfRandomNumbers = [...new Set(arrayWithDuplicates)];
	}

	arrayOfRandomNumbers.forEach((number) => {
		randomVerbs.push(verbs[number].name);
	});
	renderVerbs();
};

const randomiseVerbs = () => {
	let verbsCount = returnVerbsLength();
	let wantedVerbsNumber = +wantedVerbsInput.value;
	showRandomisedVerbs(verbsCount, wantedVerbsNumber);
};

wantedVerbsInput.addEventListener(
	'keyup',
	debounce((e) => {
		if (e.target.value === '') {
			heading.innerHTML = '';
			hideList(listOfVerbs);
			return;
		}
		randomiseVerbs();
	}, 500)
);

const resetClassListFor = (elements) => {
	elements.forEach((element) => {
		element.classList.remove('visited');
		element.classList.remove('hide');
	});
};

const switchingSections = (section) => {
	let verbSection = document.querySelector('#verbs-section');
	let wordSection = document.querySelector('#words-section');

	resetClassListFor(navigationLinks);
	resetClassListFor(sections);
	section.classList.add('visited');

	if (section.id === WORDS) {
		verbSection.classList.add('hide');
	}
	if (section.id === VERBS) {
		wordSection.classList.add('hide');
	}
};

document.addEventListener('click', (e) => {
	let elementClicked = e.target;
	let className = elementClicked.className;

	if (className === 'link') {
		elementClicked.classList.add('visited');
	}
	if (className === 'navigation-link') {
		switchingSections(elementClicked);
	}
});
