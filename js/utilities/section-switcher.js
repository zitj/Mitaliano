import { resetClassListFor } from './list.js';
import { randomise } from '../services/shared-service.js';
import { DEFAULT_FILTER, WORDS, VERBS, CLASSES } from '../constants.js';
import { verbSection, wordSection, listOfWords, wrapper } from './html_elements.js';
import { setDefaultFilter } from './filters.js';

const randomiseWord = () => {
	let randomWords = [];
	setDefaultFilter();
	randomise(WORDS, listOfWords, randomWords, true, DEFAULT_FILTER);
	let card = document.querySelector('.card');
	card.classList.add('intro');
	card.addEventListener('animationend', (event) => {
		card.classList.remove('intro');
	});
};

const showSection = (type) => {
	if (type === WORDS) {
		wrapper.style.height = '76vh';
		verbSection.classList.add('hide');
		wordSection.classList.add('show');
	}
	if (type === VERBS) {
		wrapper.style.height = '60vh';
		wordSection.classList.remove('show');
		wordSection.classList.add('hide');
	}
};

const switchSections = (section, ...elements) => {
	elements.forEach((element) => resetClassListFor(element));
	section.classList.add('visited');

	if (section.id === CLASSES.WORDS_SECTION_LINK) {
		showSection(WORDS);
		randomiseWord();
	}
	if (section.id === CLASSES.VERBS_SECTION_LINK) {
		showSection(VERBS);
	}
};

export { switchSections };
