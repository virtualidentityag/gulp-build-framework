var gulp = require('gulp');
var gutil = require('gulp-util');
var iconfontCss = require('gulp-iconfont-css');
var svgicons2svgfont = require('gulp-svgicons2svgfont');
var svg2ttf = require('gulp-svg2ttf');
var ttf2eot = require('gulp-ttf2eot');
var ttf2woff = require('gulp-ttf2woff');
var watch = require('gulp-watch');
var config = require('./../config');
var runSequence = require('run-sequence');
var mergeStream = require('merge-stream');

gulp.task('iconfont', function (callback) {

	if (config.global.tasks.iconfont) {
		runSequence(
			'convertIconsToTtf',
			[
				'convertTtfToEot',
				'convertTtfToWoff'
			],
			callback
		);
	} else {
		callback();
		gutil.log(gutil.colors.yellow('iconfont disabled'));
	}

});

gulp.task('convertIconsToTtf', function () {

	var iconfontArray = config.iconfontCss;

	if (!Array.isArray(iconfontArray)) {
		iconfontArray = [iconfontArray];
	}

	return mergeStream(iconfontArray.map(function(currentIconResource) {
		return mergeStream(config.global.resources.map( function(currentResource, index) {
			return gulp.src(config.global.src + currentResource + '/icons/*.svg')
				.pipe(iconfontCss(currentIconResource))
				.pipe(svgicons2svgfont(config.iconfont))
				.pipe(svg2ttf())
				.pipe(gulp.dest(config.global.dev + currentResource + '/fonts/icons/'));
		}));
	}));

});

gulp.task('convertTtfToEot', function () {

	return gulp.src(config.global.dev + '/resources/fonts/icons/*.ttf')
		.pipe(ttf2eot())
		.pipe(gulp.dest(config.global.dev + '/resources/fonts/icons/'));

});

gulp.task('convertTtfToWoff', function () {

	return gulp.src(config.global.dev + '/resources/fonts/icons/*.ttf')
		.pipe(ttf2woff())
		.pipe(gulp.dest(config.global.dev + '/resources/fonts/icons/'));

});

gulp.task('watch:icons', function() {

	config.global.resources.map( function(currentResource) {

		watch(config.global.src + currentResource + '/icons/*.svg', config.watch, function () {
			runSequence(
				'iconfont',
				[
					'static:hb',
					'resources:sass'
				]
			);
		});
	});

});
