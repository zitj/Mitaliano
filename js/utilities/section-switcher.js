import { resetClassListFor } from './list.js';
import { randomiseWords } from './words-service.js';

const switchingSections = (section, ...elements) => {
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
		randomiseWords(listOfWords, randomWords);
		wrapper.style.height = 'auto';
	}
	if (section.id === VERBS) {
		wordSection.classList.add('hide');
		wrapper.style.height = '60vh';
	}
};

export { switchingSections };
