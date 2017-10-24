var gulp = require('gulp');
var named = require('vinyl-named');
var mergeStream = require('merge-stream');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

var typescriptConfig = require('./../../typescript.config.js');
var config = require('./../config');

gulp.task('typescript:resources', function() {

	if (config.global.tasks.typescript) {
		return mergeStream(config.global.resources.map( function(currentResource) {

			return gulp.src(config.global.src + currentResource + '/ts/*.ts')
				.pipe(sourcemaps.init())
				.pipe(typescript({
					declaration: true
				}))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(config.global.dev + currentResource + '/ts/'));
		}));
	} else {
		gutil.log(gutil.colors.yellow('typescript disabled'));
	}

});

gulp.task('typescript:components', function() {
	if (config.global.tasks.typescript) {
		return mergeStream(config.global.resources.map( function(currentResource, index) {
			return gulp.src(config.global.src + config.global.components[index] + '/**/*.ts')
				.pipe(sourcemaps.init())
				.pipe(typescript({
					declaration: true
				}))
				.pipe(sourcemaps.write('.'))
				.pipe(gulp.dest(config.global.dev + currentResource + config.global.components[index]));

		}));
	}
});

gulp.task('watch:typescript:resources', function () {

	if (config.global.tasks.typescript) {
		config.global.resources.forEach(function (currentResource) {
			watch(config.global.src + currentResource + '/ts/**/*.ts', function () {
				runSequence(
					['typescript:resources']
				);
			});
		});
	}

});

gulp.task('watch:typescript:components', function () {

	if (config.global.tasks.typescript) {

		let components = [];
		config.global.components.map( function(currentComponent) {
			components.push(config.global.src + currentComponent + '/**/*.ts');
		});

		watch(components, function () {
			runSequence(
				['typescript:components']
			);
		});
	}

});
