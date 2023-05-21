import { resetClassListFor } from './list.js';
import { randomise } from '../services/shared-service.js';
import { DEFAULT_FILTER, WORDS, VERBS, CLASSES } from '../constants.js';
import { verbSection, wordSection, listOfWords, wrapper } from '../elements/shared.js';
import { setDefaultFilter } from './filters.js';

const switchSections = (section, ...elements) => {
	let randomWords = [];

	elements.forEach((element) => {
		resetClassListFor(element);
	});

	section.classList.add('visited');

	if (section.id === CLASSES.WORDS_SECTION_LINK) {
		wrapper.style.height = '76vh';
		verbSection.classList.add('hide');
		wordSection.classList.add('show');
		setDefaultFilter();
		randomise(WORDS, listOfWords, randomWords, true, DEFAULT_FILTER);
		let card = document.querySelector('.card');
		card.classList.add('intro');
		card.addEventListener('animationend', (event) => {
			card.classList.remove('intro');
		});
	}
	if (section.id === CLASSES.VERBS_SECTION_LINK) {
		wrapper.style.height = '60vh';
		wordSection.classList.remove('show');
		wordSection.classList.add('hide');
	}
};

export { switchSections };
