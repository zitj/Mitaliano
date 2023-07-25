import { TEXT } from '../constants.js';
import { hideList } from './list.js';

const addHeadingError = (heading, totalNumberOfVerbs) => {
	let errorMessage = `${TEXT.NUMBER_MUST_BE_SMALLER} ${totalNumberOfVerbs}`;
	heading.innerHTML = errorMessage;
	heading.classList.add('error');
};

const removeHeadingError = (heading) => {
	heading.classList.remove('error');
	heading.innerHTML = TEXT.VERBS_TO_CONJUNGATE;
};

const showHeadingError = (heading, modifiers) => {
	addHeadingError(heading, modifiers.sectionModifier.totalNumberOfElements);
	hideList(modifiers.sectionModifier.list);
};

export { removeHeadingError, showHeadingError };
