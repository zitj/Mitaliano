import { verbs } from '../data/verbs.js';
import { showList, hideList } from './utilities/list.js';
import { addHeadingError, removeHeadingError } from './utilities/heading.js';
import { debounce } from './utilities/debounce.js';

const wantedVerbsInput = document.querySelector('#wanted-verbs-input');
const verbsContainer = document.querySelector('#verbs-container');
const listOfVerbs = document.querySelector('#list-of-verbs');
const heading = verbsContainer.children[0];

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
		content += `<p>${verb}</p>`;
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
