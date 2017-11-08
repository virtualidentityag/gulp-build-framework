const config = require('./../config');
const gulp = require('gulp');
const fs = require('fs');
const globule = require('globule');
const path = require('path');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const watch = require('gulp-watch');
const runSequence = require('run-sequence');
const handlebars = require('handlebars');
const packageData = require(config.cwd + '/package.json');

const hbsParser = require('./../lib/hbs-parser');

require.extensions['.html'] = function (module, filename) {
	module.exports = handlebars.compile(fs.readFileSync(filename, 'utf8'));
};

/**
 * render aem components to separate folder
 */
gulp.task('static:hb:aem', function () {

	// read all files
	let filepaths = globule.find([
		config.global.src + '/pages/30aem.*.html'
	]);

	// let lastCategory = '';
	for (let index in filepaths) {
		let content = fs.readFileSync(filepaths[index], 'utf8');
		let sourceFile = filepaths[index];

		//parse content data
		let dataObject = hbsParser.parsePartialData(content, { package: packageData });
		if(!dataObject.hasOwnProperty('aemComponent')) {
			// @TODO: Think about info/warning/error to console
			continue;
		}

		let hbStream = hbsParser.createHbsGulpStream(
			config.global.src + '/partials/**/*.{html,handlebars,hbs}',
			dataObject,
			[ config.global.src + '/_mock/**/*.json' ]
		);

		// component partials
		config.global.components.map( function(currentComponent) {
			hbStream
				.partials(config.global.src + currentComponent + '/**/*.{html,handlebars,hbs}')
				.data(config.global.src + currentComponent + '/**/*.json')
		});

		// dynamic partials
		config.global.resources.map( function(currentResource) {
			hbStream
				.partials(config.global.src + currentResource + '/**/*.hbs')
				.data(config.global.src + currentResource + '/**/*.json');
		});

		let targetFolder = path.join(config.global.dev, 'aem', data.aemComponent);

		console.log(sourceFile + ' => ' + targetFolder);

		gulp.src(filepaths[index])
			.pipe(rename('index.html'))
			.pipe(hbStream)
			.pipe(replace('"./', '"./application_root/../'))
			.pipe(replace('[./', '[./application_root/../'))
			.pipe(gulp.dest(targetFolder));
	}
});

gulp.task('watch:static:hb:aem', function () {

	watch(config.global.src + '/pages/30aem.*.html', function () {
		runSequence(
			['static:hb:indexr']
		);
	});

});
