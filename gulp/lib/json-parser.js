const globule = require('globule');
const path = require('path');
const fs = require('fs');
const config = require('./../config');

const getAllJSONData = (glob, externalData) => {

	let dataObject = {};
	dataObject.data = externalData;

	let filepaths = globule.find(glob);

	for (let index in filepaths) {
		// read contents
		let content = JSON.parse(fs.readFileSync(filepaths[index], 'utf8'));

		// normalize path and file name
		let file = path.parse(filepaths[index]);
		let dirs = file.dir.split('/');
		dirs.push(file.name);
		dirs.forEach(function(currentDir, index) {
			if (currentDir !== config.global.src) {
				let objectName = camelCase(currentDir);

				dirs[index] = objectName;
			} else {
				dirs.splice(index, 1);
			}
		});

		// modfiy object
		modifyObject(dataObject.data, dirs, content);
	}

	return dataObject;
};

// modfiy object to add new keys and apply the value to the last key
const modifyObject = (obj, keys, val) => {
	const lastKey = keys.pop();
	const lastObj = keys.reduce((obj, key) =>
			obj[key] = obj[key] || {},
		obj);
	lastObj[lastKey] = val;
};

// create CamelCase from dot notation
const camelCase = (input) => {
	return input.replace(/\.(.)/g, function(match, group1) {
		return group1.toUpperCase();
	});
};

module.exports = {
	getAllJSONData: getAllJSONData
};
