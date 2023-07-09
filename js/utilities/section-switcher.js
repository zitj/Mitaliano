import { resetClassListFor } from './list.js';
import { randomise } from '../services/shared-service.js';
import { DEFAULT_FILTER, WORDS, VERBS, CLASSES } from '../constants.js';
import { verbSection, wordSection, listOfWords, wrapper, listOfVerbs } from './html_elements.js';
import { setDefaultFilter } from './filters.js';

const randomiseWord = (modifiers) => {
	let randomWords = [];
	setDefaultFilter();
	modifiers.sectionModifier.filterName = DEFAULT_FILTER;
	randomise(modifiers);
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

const switchToSection = (type, modifiers) => {
	modifiers.sectionModifier.type = type;
	modifiers.sectionModifier.list = type === WORDS ? listOfWords : listOfVerbs;
	showSection(type);
	if (type === WORDS) {
		if (
			modifiers.filterModifier.passedWords == undefined ||
			Object.keys(modifiers.filterModifier.passedWords).length == 0
		) {
			randomiseWord(modifiers);
		}
	}
};

const switchSections = (section, modifiers, ...elements) => {
	elements.forEach((element) => resetClassListFor(element));
	section.classList.add('visited');

	if (section.id === CLASSES.WORDS_SECTION_LINK) switchToSection(WORDS, modifiers);
	if (section.id === CLASSES.VERBS_SECTION_LINK) switchToSection(VERBS, modifiers);
};

export { switchSections };
