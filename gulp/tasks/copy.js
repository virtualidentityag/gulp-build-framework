var gulp = require('gulp');
var mergeStream = require('merge-stream');
var config = require('./../config');
var debug = require('gulp-debug');
var filter = require('gulp-filter');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');


gulp.task('copy:dev:js', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.src + currentResource + '/js/**/*.js')
			.pipe(gulp.dest(config.global.dev + currentResource + '/js/'));
	}));

});

gulp.task('copy:dev:components:js', function () {

	return mergeStream(config.global.resources.map( function(currentResource, index) {
		return gulp.src(config.global.src + config.global.components[index] + '/**/*.js')
			.pipe(gulp.dest(config.global.dev + currentResource + config.global.components[index]));
	}));

});

gulp.task('copy:dist:js', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.dev + currentResource + '/js/**/*.js')
			.pipe(gulp.dest(config.global.dist + currentResource + '/js/'));
	}));

});

gulp.task('copy:dist:react', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.dev + currentResource + '/react/*.js')
			.pipe(gulp.dest(config.global.dist + currentResource + '/react/'));
	}));

});

gulp.task('copy:dist:ts', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.dev + currentResource + '/ts/*.js')
			.pipe(gulp.dest(config.global.dist + currentResource + '/ts/'));
	}));

});

gulp.task('copy:dev:npm:js', function () {
	return mergeStream(config.global.resources.map( function(currentResource) {
		var object = config.global.externalResources;

		return mergeStream(Object.keys(object).map(function(key, index) {
			if( typeof object[key] === 'string' ) {
				object[key] = [object [key]];
			}

			return mergeStream(object[key].map(function(file) {
				return gulp.src(config.global.node + '/' + key + '/' + file)
					.pipe(filter('*.js'))
					.pipe(gulp.dest(config.global.dev + currentResource + '/js/vendor/'));
			}));
		}));

	}));
});

gulp.task('copy:dev:npm:css', function () {
	return mergeStream(config.global.resources.map( function(currentResource) {
		var object = config.global.externalResources;

		return mergeStream(Object.keys(object).map(function(key, index) {
			if( typeof object[key] === 'string' ) {
				object[key] = [object [key]];
			}

			return mergeStream(object[key].map(function(file) {
				return gulp.src(config.global.node + '/' + key + '/' + file)
					.pipe(filter('*.css', '*.scss'))
					.pipe(gulp.dest(config.global.dev + currentResource + '/css/vendor/'));
			}));
		}));

	}));
});

/**
 * backwards compatibility for bower components
 * dev copy task
 */
gulp.task('copy:dev:npm:bower', function () {
	return mergeStream(config.global.resources.map( function(currentResource) {
		var object = config.global.bowerResources;

		return mergeStream(Object.keys(object).map(function(key, index) {
			if( typeof object[key] === 'string' ) {
				object[key] = [object [key]];
			}

			return mergeStream(object[key].map(function(file) {
				let paths = file.split('/');
				paths.pop();

				let filePath = path.join(key, ...paths);

				return gulp.src(config.global.node + '/' + key + '/' + file)
					.pipe(gulp.dest(config.global.dev + currentResource + '/bower_components/' + filePath));
			}));
		}));
	}));
});

/**
 * backwards compatibility for bower
 * dist copy task
 */
gulp.task('copy:dist:bower', function () {

	return gulp.src(config.global.dev + '/resources/bower_components/**/*')
		.pipe(gulp.dest(config.global.dist + '/resources/bower_components/'));

});

gulp.task('copy:dist:flash', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.src + currentResource + '/flash/**/*')
			.pipe(gulp.dest(config.global.dist + currentResource + '/flash/'));
	}));

});

gulp.task('copy:dist:json', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.src + currentResource + '/json/**/*')
			.pipe(gulp.dest(config.global.dist + currentResource + '/json/'));
	}));

});

gulp.task('copy:dist:fonts', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src([
			config.global.src + currentResource + '/fonts/**/*',
			config.global.dev + currentResource + '/fonts/**/*'
		])
			.pipe(gulp.dest(config.global.dist + currentResource + '/fonts/'));
	}));

});

gulp.task('copy:dist:img', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.src + currentResource + '/img/**/*')
			.pipe(gulp.dest(config.global.dist + currentResource +  '/img/'));
	}));

});

gulp.task('copy:dist:assets', function () {

	return gulp.src(config.global.src + '/_assets/**/*')
		.pipe(gulp.dest(config.global.dist + '/_assets/'));

});

gulp.task('copy:dist:css', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.src + currentResource + '/css/**/*.css')
			.pipe(gulp.dest(config.global.dist + currentResource + '/css/'));
	}));

});

gulp.task('copy:dist:mock', function () {

	return gulp.src(config.global.src + '/_mock/**/*')
		.pipe(gulp.dest(config.global.dist + '/_mock/'));

});

gulp.task('copy:dist:hbs', function () {

	return mergeStream(config.global.resources.map( function(currentResource) {
		return gulp.src(config.global.src + currentResource + '/templates/**/*')
			.pipe(gulp.dest(config.global.dist + currentResource + '/templates/'));
	}));

});


gulp.task('watch:components:js', function() {
	config.global.components.forEach(function(currentComponent) {
		watch(config.global.src + currentComponent +'/**/*.js', config.watch, function () {
			runSequence(
				['copy:dev:components:js']
			);
		});
	});
});
