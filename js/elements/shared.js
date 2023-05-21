const wantedVerbsInput = document.querySelector('#wanted-verbs-input');
const verbsContainer = document.querySelector('#verbs-container');
const listOfVerbs = document.querySelector('#list-of-verbs');
const listOfWords = document.querySelector('#list-of-words');
const heading = verbsContainer.children[0];
const navigationLinks = document.querySelectorAll('.navigation-link');
const sections = document.querySelectorAll('section');
const textFilter = document.querySelector('#filter-text');
const filterOptions = document.querySelector('#filter-options');
const verbSection = document.querySelector('#verbs-section');
const wordSection = document.querySelector('#words-section');
const wrapper = document.querySelector('.wrapper');

export {
	wantedVerbsInput,
	verbsContainer,
	listOfVerbs,
	heading,
	navigationLinks,
	sections,
	listOfWords,
	textFilter,
	filterOptions,
	wordSection,
	verbSection,
	wrapper,
};
