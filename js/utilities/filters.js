import { randomise, hideAllElements } from '../services/shared-service.js';
import { DEFAULT_FILTER, IDs } from '../constants.js';
import { textFilter, filtersMenuContent, filterMenu, overlay } from './html_elements.js';
import { words } from '../../data/words.js';

let isFilterClicked = false;
let filterName = DEFAULT_FILTER;
let filters = {
	lectures: {
		array: [],
		label: 'Lezioni',
		isOpen: false,
	},
	dates: {
		array: [],
		label: 'Dati',
		isOpen: false,
	},
	wordTypes: {
		array: [],
		label: 'Tipi',
		isOpen: false,
	},
};
let chosenFilters = {
	lectures: null,
	dates: null,
	wordTypes: null,
};
let previousFilterName = '';

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
	filterHTMLelement.innerHTML = '';
	filters[filterName].array.forEach((filterOption) => {
		let option = document.createElement('div');
		option.classList.add(`filter-option`);
		option.filterType = `${filterName}`;
		option.innerText = filterOption;
		filterHTMLelement.appendChild(option);
	});
	textFilter.innerText = filters[filterName].array[0];
};

const insertFiltersOptions = (filter, filterTexts, filterOptionsLists) => {
	let filterID = filter.id.split('-')[filter.id.split('-').length - 1];
	for (let id in IDs.FILTERS) {
		if (IDs.FILTERS[id] === filterID) {
			let filterTextDOM;
			filterTexts.forEach((filterText) => {
				if (filterText.id.includes(filterID)) {
					filterTextDOM = filterText;
				}
			});
			filterOptionsLists.forEach((list) => {
				if (list.id.includes(filterID)) {
					insertFilters(list, filterTextDOM, filterID);
				}
			});
		}
	}
};
const returnOptionTypeBasedOn = (filterType) => {
	if (filterType === IDs.FILTERS.LECTURES) return 'source';
	if (filterType === IDs.FILTERS.DATES) return 'date';
	if (filterType === IDs.FILTERS.WORD_TYPE) return 'type';
};

const insertFiltersOptionsBasedOnChosenFilter = (filterID, chosenOption) => {
	let filtersCopy = filters;
	let optionType = returnOptionTypeBasedOn(filterID);
	let options = {
		lectures: [DEFAULT_FILTER],
		dates: [DEFAULT_FILTER],
		wordTypes: [DEFAULT_FILTER],
	};
	for (let number in words) {
		if (words[number][optionType] === chosenOption) {
			for (let option in options) {
				if (filterID !== option) {
					if (option === IDs.FILTERS.DATES) options[option].push(formatDate(words[number].date.getTime()));
					if (option === IDs.FILTERS.LECTURES) options[option].push(words[number].source);
					if (option === IDs.FILTERS.WORD_TYPE) options[option].push(words[number].type);
				}
			}
		}
	}
	for (let option in options) {
		options[option] = [...new Set(options[option])];
		filtersCopy[option].array = options[option].length > 1 ? options[option] : filters[option].array;
	}
	console.log('Filters', filters);
	console.log('FiltersCopy', filters);
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

const changeInnerTextForFilter = (filterType, filterTexts, filterOption) => {
	filterTexts.forEach((filterText) => {
		if (filterText.id.includes(filterType)) {
			filterText.innerText = filterOption;
		}
	});
};

const toggleFilterList = (filterName, filterOptionsLists) => {
	for (let id in IDs.FILTERS) {
		if (IDs.FILTERS[id] === filterName) {
			hideAllElements(filterOptionsLists);
			for (let name in filters) {
				if (name !== filterName) filters[name].isOpen = false;
			}
			filterOptionsLists.forEach((list) => {
				if (list.id.includes(filterName) && !filters[filterName].isOpen) {
					list.classList.remove('hide');
					filters[filterName].isOpen = true;
				} else if (list.id.includes(filterName) && filters[filterName].isOpen) {
					list.classList.add('hide');
					filters[filterName].isOpen = false;
				}
			});
		}
	}
};

const chooseFilterOption = (filterType, filterOptionsLists, filterTexts, elementClicked, filterWrappers) => {
	chosenFilters[filterType] = elementClicked.innerText;
	toggleFilterList(filterType, filterOptionsLists);
	changeInnerTextForFilter(filterType, filterTexts, elementClicked.innerText);
	insertFiltersOptionsBasedOnChosenFilter(filterType, elementClicked.innerText, filterWrappers);
};

const showFilterMenu = () => {
	filterMenu.classList.add('active');
	overlay.classList.add('active');
};

const hideFilterMenu = () => {
	filterMenu.classList.remove('active');
	overlay.classList.remove('active');
};

const closeFilterMenu = (filterOptionsLists) => {
	hideFilterMenu();
	hideAllElements(filterOptionsLists);
};

export {
	insertFilters,
	chooseFilter,
	setDefaultFilter,
	filteringWords,
	returnFiltersDOM,
	insertFiltersOptions,
	changeInnerTextForFilter,
	toggleFilterList,
	chooseFilterOption,
	showFilterMenu,
	closeFilterMenu,
	insertFiltersOptionsBasedOnChosenFilter,
	isFilterClicked,
	filterName,
	filters,
};
