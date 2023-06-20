import { randomise } from '../services/shared-service.js';
import { DEFAULT_FILTER, IDs } from '../constants.js';
import { textFilter, filtersMenuContent } from './html_elements.js';
import { words } from '../../data/words.js';

let isFilterClicked = false;
let filterName = DEFAULT_FILTER;
let filters = {
	lectures: {
		array: [],
		label: 'Lezioni',
	},
	dates: {
		array: [],
		label: 'Dati',
	},
	wordTypes: {
		array: [],
		label: 'Tipi',
	},
};

const createFilterApplyButton = () => {
	let button = document.createElement('button');
	button.innerText = 'Applica filtri';
	filtersMenuContent.appendChild(button);
};

const createFilterDOM = (filters, filter) => {
	let filterDOM = `
		<div id="filter-wrapper-${filter}" class="filter-wrapper">
			<label for="${filter}">${filters[filter].label}</label>
			<div id="filter-frame-${filter}" class="filter-frame">
				<div id="filter-text-${filter}" class="filter-text"></div>
				<div id="filter-arrow-${filter}" class="filter-arrow">></div>
				<div id="filter-options-${filter}" class="filter-options-list hide"></div>
			</div>
		</div>
	`;
	return filterDOM;
};

const returnFiltersDOM = () => {
	let filtersDOM = '';
	for (let filter in filters) {
		filtersDOM += createFilterDOM(filters, filter);
	}
	filtersMenuContent.innerHTML = filtersDOM;
	createFilterApplyButton();
	return document.querySelectorAll('.filter-wrapper');
};

const formatDate = (miliseconds) => {
	if (typeof miliseconds === 'number') {
		const date = new Date(miliseconds);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		return `${day}.${month}.${year}`;
	} else {
		return miliseconds;
	}
};

const returnFilterOptions = (filterType) => {
	let options = [DEFAULT_FILTER];
	for (let number in words) {
		if (filterType === IDs.FILTERS.DATES) options.push(formatDate(words[number].date.getTime()));
		if (filterType === IDs.FILTERS.LECTURES) options.push(words[number].source);
		if (filterType === IDs.FILTERS.WORD_TYPE) options.push(words[number].type);
	}
	options = [...new Set(options)];
	console.log(options);
	return options;
};

filters.lectures.array = returnFilterOptions('lectures');
filters.dates.array = returnFilterOptions('dates');
filters.wordTypes.array = returnFilterOptions('wordTypes');

const setDefaultFilter = () => {
	filterName = DEFAULT_FILTER;
	textFilter.innerText = filterName;
};

const insertFilters = (filterHTMLelement, textFilter, filterName) => {
	filters[filterName].array.forEach((filterOption) => {
		let option = document.createElement('div');
		option.classList.add('filter-option');
		option.innerText = filterOption;
		filterHTMLelement.appendChild(option);
	});
	textFilter.innerText = filters[filterName].array[0];
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

export {
	insertFilters,
	toggleFilter,
	chooseFilter,
	setDefaultFilter,
	filteringWords,
	returnFiltersDOM,
	isFilterClicked,
	filterName,
	filters,
};
