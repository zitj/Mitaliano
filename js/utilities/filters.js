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

const insertFilters = (modifier) => {
	modifier.filterHTMLelement.innerHTML = '';
	modifier.filters[modifier.filterID].array.forEach((filterOption) => {
		let option = document.createElement('div');
		option.classList.add(`filter-option`);
		option.filterType = `${modifier.filterID}`;
		option.innerText = filterOption;
		modifier.filterHTMLelement.appendChild(option);
	});
	if (chosenFilters[modifier.type] == null) modifier.filterText.innerText = DEFAULT_FILTER;
};

const insertFiltersOptions = (modifier) => {
	let filterID = modifier.filter.id.split('-')[modifier.filter.id.split('-').length - 1];
	for (let id in IDs.FILTERS) {
		if (IDs.FILTERS[id] === filterID) {
			let filterTextDOM;
			modifier.htmlElements.filterTexts.forEach((filterText) => {
				if (filterText.id.includes(filterID)) {
					filterTextDOM = filterText;
				}
			});
			modifier.htmlElements.filterOptionsLists.forEach((list) => {
				if (list.id.includes(filterID)) {
					modifier.filterHTMLelement = list;
					modifier.filterText = filterTextDOM;
					modifier.filterID = filterID;
					insertFilters(modifier);
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

const insertFiltersOptionsBasedOnChosenFilter = (modifier) => {
	let filtersCopy = _.cloneDeep(filters);
	let optionType = returnOptionTypeBasedOn(modifier.type);
	let options = {
		lectures: [DEFAULT_FILTER],
		dates: [DEFAULT_FILTER],
		wordTypes: [DEFAULT_FILTER],
	};
	for (let number in words) {
		let word = words[number];
		let selectedOption = modifier.elementClicked.innerText;
		if (word[optionType] === selectedOption) {
			for (let option in options) {
				// if (modifier.type !== option) {
				if (option === IDs.FILTERS.DATES) options[option].push(formatDate(word.date.getTime()));
				if (option === IDs.FILTERS.LECTURES) options[option].push(word.source);
				if (option === IDs.FILTERS.WORD_TYPE) options[option].push(word.type);
				// }
			}
		}
	}
	for (let option in options) {
		options[option] = [...new Set(options[option])];
		filtersCopy[option].array = options[option].length > 1 ? options[option] : filters[option].array;
	}

	modifier.htmlElements.filterWrappers.forEach((filter) => {
		modifier.filter = filter;
		modifier.filters = filtersCopy;
		insertFiltersOptions(modifier);
	});
	console.log('Modifier', modifier);
	console.log('Chosen filters', chosenFilters);
	console.log('Filters', filters);
	console.log('FiltersCopy', filtersCopy);
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

const changeInnerTextForFilter = (modifier) => {
	modifier.htmlElements.filterTexts.forEach((filterText) => {
		if (filterText.id.includes(modifier.type)) {
			filterText.innerText = chosenFilters[modifier.type];
		}
	});
};

const toggleFilterList = (modifier) => {
	for (let id in IDs.FILTERS) {
		if (IDs.FILTERS[id] === modifier.type) {
			hideAllElements(modifier.htmlElements.filterOptionsLists);
			for (let name in filters) {
				if (name !== modifier.type) filters[name].isOpen = false;
			}
			modifier.htmlElements.filterOptionsLists.forEach((list) => {
				if (list.id.includes(modifier.type) && !filters[modifier.type].isOpen) {
					list.classList.remove('hide');
					filters[modifier.type].isOpen = true;
				} else if (list.id.includes(modifier.type) && filters[modifier.type].isOpen) {
					list.classList.add('hide');
					filters[modifier.type].isOpen = false;
				}
			});
		}
	}
};

const chooseFilterOption = (modifier) => {
	chosenFilters[modifier.type] = modifier.elementClicked.innerText;
	toggleFilterList(modifier);
	insertFiltersOptionsBasedOnChosenFilter(modifier);

	changeInnerTextForFilter(modifier);
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
