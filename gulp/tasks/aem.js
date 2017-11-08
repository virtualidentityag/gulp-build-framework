var gulp = require('gulp');
var hb = require('gulp-hb');
var fs = require('fs');
var globule = require('globule');
var path = require('path');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var handlebars = require('handlebars');
var config = require('./../config');
var cwd = process.cwd();

require.extensions['.html'] = function (module, filename) {
	module.exports = handlebars.compile(fs.readFileSync(filename, 'utf8'));
};

/**
 * render aem components to separate folder
 */
gulp.task('static:hb:aem', function () {

	// let dataObject = {
	// 	templates: [],
	// 	aemTask: true
	// };

	let packageData = {
		package: require(cwd + '/package.json')
	};

	// read all files
	let filepaths = globule.find([
		config.global.src + '/pages/30aem.*.html'
	]);

	// let lastCategory = '';
	for (let index in filepaths) {
		let content = fs.readFileSync(filepaths[index], 'utf8');
		let data = {
			aemTask: true
		};
		// let template = {};
		let sourceFile = filepaths[index];

		// template.file = path.parse(filepaths[index]);

		// check current category
		// let category = template.file.name.substring(2, template.file.name.indexOf('.'));
		// if (lastCategory !== category) {
		// 	lastCategory = category;
		// 	template.category = category;
		// 	template.priority = template.file.name.substring(0, 2);
		// }

		// console.log(filepaths[index]);

		//add template data
		// data.template = template;

		//parse content data
		if (/\{\{>/.test(content)) {
			let matches = content.match(/\S*=('|").*('|")/g);

			matches.map(function(match) {
				let elements = match.split('=');
				let key = elements[0];
				let value = elements[1].slice(1, -1);

				data[key] = value
			});
		}
		// dataObject.templates.push(data);

		if(!data.hasOwnProperty('aemComponent')) {
			continue;
		}

		let hbStream = hb({
			// set to true to see details to partials, data, etc.
			debug: false
		})
		// handlebar helper functions
		// @TODO add possibility to inject helpers from file
			.helpers({
				def: function (a, b) {return a ? a : b;},
				text: function (count, max) {
					if (max !== 0 && typeof max !== 'undefined' && max > count) {
						count = Math.floor(Math.random() * max) + count;
					}
					var text = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ';
					text = text + text + text;
					return text.substr(0, count);
				},
				stringify: function(object) {
					return JSON.stringify(object);
				},
				code: function(content) {
					return content.fn();
				}
			})
			// global partials
			.partials(config.global.src + '/partials/**/*.{html,handlebars,hbs}')
			//data
			.data(data)
			.data(packageData)
			.data(config.global.src + '/_mock/**/*.json');

		// component partials
		config.global.components.map( function(currentComponent, index) {
			hbStream
				.partials(config.global.src + currentComponent + '/**/*.{html,handlebars,hbs}')
				.data(config.global.src + currentComponent + '/**/*.json')
		});

		// dynamic partials
		config.global.resources.map( function(currentResource, index) {
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
