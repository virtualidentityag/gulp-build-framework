const hbsHelpers = require('./hbs-helpers');
const hb = require('gulp-hb');

const createHbsGulpStream = (partials, dataObject, dataGlob, debug=false) => {
	// @TODO add possibility to inject helpers from external file

	let hbStream = hb({ debug: debug })
		.helpers(hbsHelpers);

	if(partials) {
		hbStream.partials(partials);
	}

	if(dataObject) {
		hbStream.data(dataObject);
	}

	if(dataGlob) {
		hbStream.data(dataGlob);
	}

	return hbStream;
};

const parsePartialData = (content, data={}) => {
	if (/\{\{>/.test(content)) {
		let matches = content.match(/\S*=('|").*('|")/g);

		matches.map(function(match) {
			let elements = match.split('=');
			let key = elements[0];

			data[key] = elements[1].slice(1, -1);
		});
	}

	return data;
};

module.exports = {
	createHbsGulpStream: createHbsGulpStream,
	parsePartialData: parsePartialData
};
