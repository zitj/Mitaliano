import { resetClassListFor } from './list.js';
import { randomise } from './renderer.js';
import { TEXT, CLASSES } from '../constants.js';
import { verbSection, wordSection, listOfWords, wrapper, listOfVerbs, navigationLinks } from './html-elements.js';
import { setDefaultFilter } from './filters.js';

const randomiseWord = (modifiers) => {
	setDefaultFilter();
	modifiers.sectionModifier.filterName = TEXT.DEFAULT_FILTER;
	randomise(modifiers);
	let card = document.querySelector('.card');
	card.classList.add('intro');
	card.addEventListener('animationend', (event) => {
		card.classList.remove('intro');
	});
};

const showSection = (type) => {
	if (type === TEXT.WORDS) {
		wrapper.style.height = '76vh';
		verbSection.classList.add('hide');
		wordSection.classList.add('show');
	}
	if (type === TEXT.VERBS) {
		wrapper.style.height = '60vh';
		wordSection.classList.remove('show');
		wordSection.classList.add('hide');
	}
};

const switchToSection = (type, modifiers) => {
	modifiers.sectionModifier.type = type;
	modifiers.sectionModifier.list = type === TEXT.WORDS ? listOfWords : listOfVerbs;
	showSection(type);
	if (type === TEXT.WORDS) {
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

	if (modifiers.section.id === CLASSES.WORDS_SECTION_LINK) switchToSection(TEXT.WORDS, modifiers);
	if (modifiers.section.id === CLASSES.VERBS_SECTION_LINK) switchToSection(TEXT.VERBS, modifiers);
};

export { switchSections };
