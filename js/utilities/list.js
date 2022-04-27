export const showList = (list, content) => {
	list.innerHTML = content;
	list.classList.add('active');
};

export const hideList = (list) => {
	list.innerHTML = '';
	list.classList.remove('active');
};
