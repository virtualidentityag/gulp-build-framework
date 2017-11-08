const config = require('./../config');
const gulp = require('gulp');
const fs = require('fs');
const globule = require('globule');
const path = require('path');
const rename = require('gulp-rename');
const watch = require('gulp-watch');
const runSequence = require('run-sequence');
const notify = require("gulp-notify");
const handlebars = require('handlebars');
const packageData = require(config.cwd + '/package.json');

const hbsParser = require('./../lib/hbs-parser');
const iconParser = require('./../lib/icon-parser');


require.extensions['.html'] = function (module, filename) {
	module.exports = handlebars.compile(fs.readFileSync(filename, 'utf8'));
};

gulp.task('static:hb', function () {

	//icon data
	let iconNames = iconParser.getAllIconFileNamesLowerCase(config.global.src + '/_icons/*.svg');
	let hbsData = {
		'icons': iconNames,
		'package': packageData
	};

	let hbStream = hbsParser.createHbsGulpStream(
		config.global.src + '/partials/**/*.{html,handlebars,hbs}',
		hbsData,
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

	/**
	 * reads from pages
	 * puts files to .tmp
	 */
	return gulp
		.src(config.global.src + '/pages/' + '/*.{html,handlebars,hbs}')
		.pipe(hbStream)
		.on('error', notify.onError(function (error) {
			return {
				title: 'static:hb',
				message: error.message
			};
		}))
		.pipe(rename({extname: ".html"}))
		.pipe(gulp.dest(config.global.dev));

});


gulp.task('watch:static:hb', function () {
	let files = [config.global.src + '/partials/**/*.{html,handlebars,hbs}'];

	config.global.components.forEach(function(currentComponent) {
		files.push(config.global.src + currentComponent +'/**/*.{html,handlebars,hbs}');
	});

	watch(files, config.watch, function () {
		runSequence(
			['static:hb']
		);
	});

});


/**
 * indexr creates the preview file index
 */
gulp.task('static:hb:indexr', function () {

	let dataObject = {
		package: packageData,
		templates: []
	};

	// read all files
	let filepaths = globule.find([
		config.global.src + '/pages/*.{html,handlebars,hbs}'
	]);

	let lastCategory = '';
	for (let index in filepaths) {
		let content = fs.readFileSync(filepaths[index], 'utf8');
		let template = {};

		template.file = path.parse(filepaths[index]);

		// check current category
		let category = template.file.name.substring(2, template.file.name.indexOf('.'));
		if (lastCategory !== category) {
			lastCategory = category;
			template.category = category;
			template.priority = template.file.name.substring(0, 2);
		}

		//parse content data
		let data = hbsParser.parsePartialData(content, { template: template });

		dataObject.templates.push(data);
	}

	let hbStream = hbsParser.createHbsGulpStream(null, dataObject);

	gulp.src(config.global.src + '/index.html')
		.pipe(hbStream)
		.pipe(gulp.dest(config.global.dev));

});

gulp.task('watch:static:hb:indexr', function () {

	watch(config.global.src + '/pages/*.{html,handlebars,hbs}', config.watch, function () {
		runSequence(
			['static:hb:indexr']
		);
	});

});
