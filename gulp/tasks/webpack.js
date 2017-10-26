var gulp = require('gulp');
var named = require('vinyl-named');
var mergeStream = require('merge-stream');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var webpackTS = require('webpack');
var webpackStream = require('webpack-stream');
var webpackConfig = require('./../../webpack.config.js');
var config = require('./../config');

/**
 * @TODO fix typing errors
 */

gulp.task('webpack:resources:ts', function() {

	if (config.global.tasks.webpack) {
		return mergeStream(config.global.resources.map( function(currentResource) {
			return gulp.src(config.global.src + currentResource + '/ts/*.ts')
				.pipe(named())
				.pipe(webpackStream(webpackConfig, webpackTS).on('error', function(err) {
					gutil.log('Webpack TS', err);
					this.emit('end');
				}))
				.pipe(gulp.dest(config.global.dev + currentResource + '/ts/'));
		}));
	} else {
		gutil.log(gutil.colors.yellow('webpack:ts disabled'));
	}

});

gulp.task('webpack:components:ts', function() {
	if (config.global.tasks.webpack) {
		return mergeStream(config.global.resources.map( function(currentResource, index) {
			let tmp = {};
			return gulp.src(config.global.src + config.global.components[index] + '/**/*.ts')
				.pipe(named())
				.pipe(rename(function (path) {
					tmp[path.basename] = path;
				}))
				.pipe(webpackStream(webpackConfig, webpackTS).on('error', function(err) {
					gutil.log('Webpack TS', err);
					this.emit('end');
				}))
				.pipe(rename(function (path) {
					for (key in tmp) {

						if (key === path.basename) {
							path.dirname = tmp[path.basename].dirname;
						}
						if (key === path.basename.replace('.js', '')) {
							path.dirname = tmp[path.basename.replace('.js', '')].dirname;
						}
					}
				}))
				.pipe(gulp.dest(config.global.dev + currentResource + config.global.components[index]));

		}));
	}
});

gulp.task('watch:webpack:resources:ts', function () {

	if (config.global.tasks.webpack) {
		config.global.resources.forEach(function (currentResource) {
			watch(config.global.src + currentResource + '/ts/**/*.ts', function () {
				runSequence(
					['webpack:resources:ts']
				);
			});
		});
	}

});

gulp.task('watch:webpack:components:ts', function () {

	if (config.global.tasks.webpack) {
		config.global.components.map( function(currentComponent) {
			watch(config.global.src + currentComponent + '/**/*.ts', function () {
				runSequence(
					['webpack:components:ts']
				);
			});
		});
	}

});
