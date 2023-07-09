import { resetClassListFor } from './list.js';
import { randomise } from '../services/shared-service.js';
import { DEFAULT_FILTER, WORDS, VERBS, CLASSES } from '../constants.js';
import { verbSection, wordSection, listOfWords, wrapper, listOfVerbs, navigationLinks } from './html_elements.js';
import { setDefaultFilter } from './filters.js';

const randomiseWord = (modifiers) => {
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

const switchSections = (modifiers) => {
	let elements = [modifiers.sections, modifiers.navigationLinks];
	elements.forEach((element) => resetClassListFor(element));
	modifiers.section.classList.add('visited');

	if (modifiers.section.id === CLASSES.WORDS_SECTION_LINK) switchToSection(WORDS, modifiers);
	if (modifiers.section.id === CLASSES.VERBS_SECTION_LINK) switchToSection(VERBS, modifiers);
};

export { switchSections };
