const showList = (list, content) => {
	list.innerHTML = content;
	list.classList.add('active');
};

const hideList = (list) => {
	list.innerHTML = '';
	list.classList.remove('active');
};

const resetClassListFor = (elements) => {
	elements.forEach((element) => {
		element.classList.remove('visited');
		element.classList.remove('hide');
	});
};

export { showList, hideList, resetClassListFor };
