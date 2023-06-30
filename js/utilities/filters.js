import { randomise, hideAllElements, returnFilterIDBasedOn } from '../services/shared-service.js';
import { DEFAULT_FILTER, IDs } from '../constants.js';
import { textFilter, filtersMenuContent, filterMenu, overlay } from './html_elements.js';
import { words } from '../../data/words.js';

let isFilterClicked = false;
let filterName = DEFAULT_FILTER;
let filtersAlreadyApplied = {};
let testingmadafaking = Object.values(words);
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
let filterOptions = {
	lectures: [DEFAULT_FILTER],
	dates: [DEFAULT_FILTER],
	wordTypes: [DEFAULT_FILTER],
};
let chosenFilters = {
	lectures: null,
	dates: null,
	wordTypes: null,
};

const createFilterApplyButton = () => {
	let button = document.createElement('button');
	button.innerText = 'Applica filtri';
	button.id = 'filter-apply-button';
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
	miliseconds = +miliseconds;
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
		if (filterType === IDs.FILTERS.DATES) options.push(formatDate(words[number].date));
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
	let filterID = returnFilterIDBasedOn(modifier.filter.id);
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
const returnFilterTypeBasedOn = (optionType) => {
	if (optionType === 'source') return IDs.FILTERS.LECTURES;
	if (optionType === 'date') return IDs.FILTERS.DATES;
	if (optionType === 'type') return IDs.FILTERS.WORD_TYPE;
};

const allFiltersAreChosenExceptLast = () => {
	let result = true;
	for (let i = 0; i < Object.keys(chosenFilters).length - 1; i++) {
		if (
			chosenFilters[Object.keys(chosenFilters)[i]] === null &&
			chosenFilters[Object.keys(chosenFilters)[i]] === DEFAULT_FILTER
		) {
			result = false;
		}
	}
	return result;
};

const resetFilterFields = (modifier) => {
	for (let filterType in chosenFilters) {
		if (modifier.type === IDs.FILTERS.LECTURES) {
			if (modifier.type !== filterType) {
				chosenFilters[filterType] = DEFAULT_FILTER;
			}
		}
		if (modifier.type === IDs.FILTERS.DATES) {
			chosenFilters.wordTypes = DEFAULT_FILTER;
		}
		if (chosenFilters[filterType] === null || chosenFilters[filterType] === DEFAULT_FILTER) {
			filterOptions[filterType] = [DEFAULT_FILTER];
		}
	}
};

const addOption = (option, word) => {
	if (option === IDs.FILTERS.DATES) {
		if (
			word.source === chosenFilters.lectures ||
			(word.source === chosenFilters.lectures && word.type === chosenFilters.type)
		) {
			filterOptions[option].push(word.date);
		}
	}
	if (option === IDs.FILTERS.WORD_TYPE) {
		if (allFiltersAreChosenExceptLast()) {
			if (
				word.source === chosenFilters.lectures ||
				(word.source === chosenFilters.lectures && word.date === chosenFilters.dates)
			) {
				filterOptions[option].push(word.type);
			}
		}
	}
};

const addOptionsToFilters = (modifier, optionType) => {
	for (let number in words) {
		let word = words[number];
		let selectedOption = modifier.elementClicked.innerText;
		if (typeof word.date === 'number') word.date = formatDate(word.date);
		if (word[optionType] == selectedOption) {
			for (let option in filterOptions) {
				addOption(option, word);
			}
		}
	}
};

const insertFiltersOptionsBasedOnChosenFilter = (modifier) => {
	let filtersCopy = _.cloneDeep(filters);
	let optionType = returnOptionTypeBasedOn(modifier.type);
	resetFilterFields(modifier);
	addOptionsToFilters(modifier, optionType);
	for (let option in filterOptions) {
		filterOptions[option] = [...new Set(filterOptions[option])];
		filtersCopy[option].array = filterOptions[option].length > 1 ? filterOptions[option] : filters[option].array;
	}
	modifier.htmlElements.filterWrappers.forEach((filter) => {
		modifier.filter = filter;
		modifier.filters = filtersCopy;
		insertFiltersOptions(modifier);
	});
};

const chooseFilter = (elementClicked, filterOptions, textFilter, listOfWords, randomWords) => {
	isFilterClicked = false;
	filterOptions.classList.add('hide');
	filterName = elementClicked.innerText;
	textFilter.innerText = filterName;
	randomise('words', listOfWords, randomWords, false, filterName);
};

const filteringWords = (sectionModifier, words, filterModifier) => {
	// developing new logic for filtering words
	let test = [];
	let allFiltersApplied = true;
	let filtersApplied = {};

	for (let filter in filterModifier.filtersToApply) {
		let bind = returnOptionTypeBasedOn(filter);
		if (
			filterModifier.filtersToApply[filter] === null ||
			filterModifier.filtersToApply[filter] === DEFAULT_FILTER
		) {
			allFiltersApplied = false;
		} else {
			filtersApplied[bind] = filterModifier.filtersToApply[filter];
		}
		delete filtersAlreadyApplied[bind];
	}
	if (Object.keys(filtersAlreadyApplied).length === 0) {
		testingmadafaking = Object.values(words);
	}
	for (let key in filtersApplied) {
		if (filtersAlreadyApplied[key] === undefined) {
			filtersAlreadyApplied[key] = filtersApplied[key];
			testingmadafaking = testingmadafaking.filter((word) => word[key] === filtersApplied[key]);
		}
	}
	console.log(testingmadafaking);
	console.log('Filters already applied', filtersAlreadyApplied);
	//ENDS developing new logic for filtering words ENDS

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

const allFieldsAreSelected = () => {
	let filtersLength = Object.keys(chosenFilters).length;
	let allSelected = true;

	for (let i = 0; i < filtersLength; i++) {
		if (
			chosenFilters[Object.keys(chosenFilters)[i]] === null ||
			chosenFilters[Object.keys(chosenFilters)[i]] === DEFAULT_FILTER
		) {
			allSelected = false;
		}
	}
	return allSelected;
};

const resetAllFiltersExceptTheLastOne = (modifier) => {
	let filtersLength = Object.keys(chosenFilters).length;
	let lastFilterIndex = filtersLength - 1;
	let lastFilterName = Object.keys(chosenFilters)[lastFilterIndex];
	let lastFilter = chosenFilters[lastFilterName];

	if (
		lastFilter !== null &&
		lastFilter !== DEFAULT_FILTER &&
		!allFieldsAreSelected() &&
		modifier.type == lastFilterName
	) {
		for (let i = lastFilterIndex - 1; i >= 0; i--) {
			chosenFilters[Object.keys(chosenFilters)[i]] = DEFAULT_FILTER;
		}
	}
	changeInnerTextForFilter(modifier);
};

const changeInnerTextForFilter = (modifier) => {
	modifier.htmlElements.filterTexts.forEach((filterText) => {
		let filterID = returnFilterIDBasedOn(filterText.id);
		if (filterText.id.includes(modifier.type)) {
		}
		if (chosenFilters[filterID] !== null) {
			filterText.innerText = chosenFilters[filterID];
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

const applyFilters = (modifier) => {
	console.log(modifier);

	closeFilterMenu(modifier.filterModifier.htmlElements.filterOptionsLists);
	randomise(modifier);
};

export {
	applyFilters,
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
	chosenFilters,
};
