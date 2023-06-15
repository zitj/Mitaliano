const wantedVerbsInput = document.querySelector('#wanted-verbs-input');
const verbsContainer = document.querySelector('#verbs-container');
const listOfVerbs = document.querySelector('#list-of-verbs');
const listOfWords = document.querySelector('#list-of-words');
const heading = verbsContainer.children[0];
const navigationLinks = document.querySelectorAll('.navigation-link');
const sections = document.querySelectorAll('section');
const verbSection = document.querySelector('#verbs-section');
const wordSection = document.querySelector('#words-section');
const wrapper = document.querySelector('.wrapper');
const cardCounter = document.querySelector('#word-counter');
const verbsInput = document.querySelector('#wanted-verbs-input');
const closeFilterButton = document.querySelector('#close-filters-button');
const overlay = document.querySelector('#overlay');

const filterMenu = document.querySelector('#filter-menu');
const filtersMenuContent = document.querySelector('#filter-menu-content');
const filtersOptionsLists = document.querySelectorAll('.filter-options-list');
const filtersText = document.querySelectorAll('.filter-text');

const textFilter = document.querySelector('#filter-text');
const filterOptions = document.querySelector('#filter-options');

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
	cardCounter,
	verbsInput,
	closeFilterButton,
	filterMenu,
	overlay,
	filtersMenuContent,
};
