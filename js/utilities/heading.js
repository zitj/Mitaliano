export const addHeadingError = (heading, totalNumberOfVerbs) => {
	let errorMessage = `Number must be smaller than ${totalNumberOfVerbs}`;
	heading.innerHTML = errorMessage;
	heading.classList.add('error');
};

export const removeHeadingError = (heading) => {
	heading.classList.remove('error');
	heading.innerHTML = 'Verbs to conjugate:';
};
