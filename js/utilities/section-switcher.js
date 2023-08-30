import { resetClassListFor } from './list.js';
import { randomise } from './renderer.js';
import { TEXT, CLASSES } from '../constants.js';
import { listOfWords, wrapper, listOfVerbs, listOfGameWords } from './html-elements.js';
import { setDefaultFilter } from './filters.js';

const randomiseListOfWords = (modifiers) => {
	modifiers.filterModifier.passedWords = {}; // set logic where it remembers the passed words of words section
	randomise(modifiers);
};

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

const showSection = (type, sections) => {
	sections.forEach((section) => {
		if (section.id.includes(type)) {
			section.classList.add('show');
		} else {
			section.classList.add('hide');
		}
	});
	if (type === TEXT.WORDS || type === TEXT.GAME) wrapper.style.height = '76vh';
	if (type === TEXT.VERBS) wrapper.style.height = '60vh';
};

const switchToSection = (type, modifiers) => {
	modifiers.sectionModifier.type = type;
	if (type === TEXT.WORDS) modifiers.sectionModifier.list = listOfWords;
	if (type === TEXT.VERBS) modifiers.sectionModifier.list = listOfWords;
	if (type === TEXT.GAME) modifiers.sectionModifier.list = listOfGameWords;

	showSection(type, modifiers.sections);
	if (type === TEXT.WORDS) {
		if (
			modifiers.filterModifier.passedWords == undefined ||
			Object.keys(modifiers.filterModifier.passedWords).length == 0
		) {
			randomiseWord(modifiers);
		}
	}
	if (type === TEXT.GAME) randomiseListOfWords(modifiers);
};

const switchSections = (modifiers) => {
	let elements = [modifiers.sections, modifiers.navigationLinks];
	elements.forEach((element) => resetClassListFor(element));
	modifiers.section.classList.add('visited');

	if (modifiers.section.id === CLASSES.WORDS_SECTION_LINK) switchToSection(TEXT.WORDS, modifiers);
	if (modifiers.section.id === CLASSES.VERBS_SECTION_LINK) switchToSection(TEXT.VERBS, modifiers);
	if (modifiers.section.id === CLASSES.GAME_SECTION_LINK) switchToSection(TEXT.GAME, modifiers);
};

export { switchSections };
