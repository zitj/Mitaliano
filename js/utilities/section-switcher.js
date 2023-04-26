import { resetClassListFor } from './list.js';
import { randomise } from '../services/shared-service.js';

const switchSections = (section, ...elements) => {
	let wrapper = document.querySelector('.wrapper');
	let verbSection = document.querySelector('#verbs-section');
	let wordSection = document.querySelector('#words-section');

	const listOfWords = document.querySelector('#list-of-words');
	let randomWords = [];

	const VERBS = 'verbs-section-link';
	const WORDS = 'words-section-link';

	elements.forEach((element) => {
		resetClassListFor(element);
	});

	section.classList.add('visited');

	if (section.id === WORDS) {
		verbSection.classList.add('hide');
		randomise('words', listOfWords, randomWords);
	}
	if (section.id === VERBS) {
		wordSection.classList.add('hide');
	}
};

export { switchSections };
