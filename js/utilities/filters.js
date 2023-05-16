import { returnArrayOfLectures } from '../services/shared-service.js';

const lectures = returnArrayOfLectures();

const insertFilters = (filter, textFilter) => {
	lectures.forEach((lecture) => {
		let option = document.createElement('div');
		option.classList.add('option');
		option.innerText = lecture;
		filter.appendChild(option);
	});
	textFilter.innerText = lectures[0];
};

export { insertFilters };
