const WORDS = 'words';
const VERBS = 'verbs';
const DEFAULT_FILTER = 'Senza filtro';
const errorMessageText = 'Il numero deve essere meno di';
const headingText = 'Verbi da coniugare';
const showTranslationBtnContent = 'Mostra traduzione';
const CLASSES = {
	VERB_LINK: 'verb-link',
	NAVIGATION_LINK: 'navigation-link',
	TRANSLATION_BUTTON: 'translation-button',
	FILTER_OPTION: 'filter-option',
	VERBS_SECTION_LINK: 'verbs-section-link',
	WORDS_SECTION_LINK: 'words-section-link',
	FILTER_ICON: 'filter-icon',
};
const IDs = {
	NEXT_BUTTON: 'next-btn',
	FILTER_APPLY_BUTTON: 'filter-apply-button',
	OVERLAY: 'overlay',
	FILTERS: {
		LECTURES: 'lectures',
		DATES: 'dates',
		WORD_TYPE: 'wordTypes',
	},
};
const WORD_BINDS = {
	LECTURES: 'source',
	DATES: 'date',
	WORD_TYPE: 'type',
};

export {
	WORDS,
	VERBS,
	DEFAULT_FILTER,
	CLASSES,
	IDs,
	WORD_BINDS,
	showTranslationBtnContent,
	errorMessageText,
	headingText,
};
