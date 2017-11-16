var gulp = require('gulp');
var useref = require('gulp-useref');
var hb = require('gulp-hb');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var lec = require('gulp-line-ending-corrector');
var config = require('./../config');

gulp.task('useref', function () {

	return gulp.src(config.global.dev + '/*.html')
		.pipe(lec(config.lec))
		.pipe(useref({
			noAssets: true
		}))
		.pipe(filter(['**/*.html']))
		.pipe(gulp.dest(config.global.dist));

});

gulp.task('useref:assets', function () {

	var jsFilter = filter(['**/*.js'], {restore: true});
	var cssFilter = filter(['**/*.css'], {restore: true});

	let hbStream = hb().partials(config.global.src + '/**/*.hbs');

	return gulp.src(config.global.src + '/resources/_useref.html')
		.pipe(lec(config.lec))
		.pipe(hbStream)
		.pipe(useref())

		.pipe(jsFilter)
		.pipe(uglify(config.uglify))
		.pipe(jsFilter.restore)

		.pipe(cssFilter)
		.pipe(cleanCss(config.cleanCss))
		.pipe(cssFilter.restore)

		.pipe(filter(['**', '!**/_useref.html']))

		.pipe(gulp.dest(config.global.dist));
});
