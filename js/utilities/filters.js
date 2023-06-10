import { randomise } from '../services/shared-service.js';
import { DEFAULT_FILTER } from '../constants.js';
import { textFilter } from './html_elements.js';
import { words } from '../../data/words.js';

let isFilterClicked = false;
let filterName = DEFAULT_FILTER;
let filter = {
	lectures: [],
	dates: [],
	wordTypes: [],
};

const returnFilterOptions = (filterType) => {
	let options = [DEFAULT_FILTER];
	for (let number in words) {
		if (filterType === 'dates') options.push(words[number].date.getTime());
		if (filterType === 'lectures') options.push(words[number].source);
		if (filterType === 'wordTypes') options.push(words[number].type);
	}
	options = [...new Set(options)];
	console.log(options);
	return options;
};

filter.lectures = returnFilterOptions('lectures');
filter.dates = returnFilterOptions('dates');
filter.wordTypes = returnFilterOptions('wordTypes');

const setDefaultFilter = () => {
	filterName = DEFAULT_FILTER;
	textFilter.innerText = filterName;
};

const insertFilters = (filterHTMLelement, textFilter) => {
	filter.lectures.forEach((lecture) => {
		let option = document.createElement('div');
		option.classList.add('filter-option');
		option.innerText = lecture;
		filterHTMLelement.appendChild(option);
	});
	textFilter.innerText = filter.lectures[0];
};

const toggleFilter = (elementClicked, elementIDsOfFilter, filterOptions) => {
	if (elementIDsOfFilter[elementClicked.id]) {
		isFilterClicked = !isFilterClicked;
		if (isFilterClicked) {
			filterOptions.classList.remove('hide');
		} else {
			filterOptions.classList.add('hide');
		}
	} else {
		isFilterClicked = false;
		filterOptions.classList.add('hide');
	}
};
const chooseFilter = (elementClicked, filterOptions, textFilter, listOfWords, randomWords) => {
	isFilterClicked = false;
	filterOptions.classList.add('hide');
	filterName = elementClicked.innerText;
	textFilter.innerText = filterName;
	randomise('words', listOfWords, randomWords, false, filterName);
};

const filteringWords = (sectionModifier, words, filterModifier) => {
	if (sectionModifier.filterName !== filterModifier.previousFilter) {
		filterModifier.passedWords = {};
		if (sectionModifier.filterName !== DEFAULT_FILTER) {
			filterModifier.wordsArray = [];
			filterModifier.wordsObj = {};
			for (let wordNum in words) {
				let word = words[wordNum];
				if (word.source === sectionModifier.filterName) filterModifier.wordsArray.push(word);
			}
			for (let i = 0; i < filterModifier.wordsArray.length; i++) {
				filterModifier.wordsObj[i] = filterModifier.wordsArray[i];
			}
			sectionModifier.totalNumberOfElements = filterModifier.wordsArray.length;
		} else {
			filterModifier.wordsObj = words;
		}
		filterModifier.previousFilter = sectionModifier.filterName;
	}
	return filterModifier;
};

export { insertFilters, toggleFilter, chooseFilter, setDefaultFilter, filteringWords, isFilterClicked, filterName };
