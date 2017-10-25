var gulp = require('gulp');
var runSequence = require('run-sequence');

// Prevent errors caused by too many listeners in gulp-watch
require('events').EventEmitter.defaultMaxListeners = 0;

// configure default task
gulp.task('default', ['serve']);


// build templates for development
gulp.task('build:dev', function (callback) {
	runSequence(
		'checkDependencies',
		[
			'clean:dev',
			'clean:iconfont'
		],
		[
			'lint:resources:sass',
			'lint:components:sass',
			'lint:json',
			'jshint:resources',
			'jshint:components',
			'eslint:resources',
			'eslint:components',
			'iconfont',
			'copy:dev:npm:js',
			'copy:dev:npm:css'
		],
		[
			'handlebars',
			'angularTemplates'
		],
		[
			'static:hb',
			'static:hb:indexr'
		],
		[
			'resources:sass',
			'components:sass',
			'typescript:resources',
			'typescript:components',
			'copy:dev:components:js'
		],
		[
			'modernizr',
			'htmlhint'
		],
		callback
	);
});


// build templates for production
gulp.task('build', function (callback) {
	runSequence(
		[
			'clean:dist',
			'build:dev'
		],
		[
			'copy:dev:js'
		],
		[
			'copy:dist:js',
			'copy:dist:react',
			'copy:dist:ts',
			'copy:dist:flash',
			'copy:dist:json',
			'copy:dist:fonts',
			'copy:dist:img',
			'copy:dist:assets',
			'copy:dist:css',
			'copy:dist:mock',
			'copy:dist:hbs'
		],
		[
			'uglify:resources:dist',
			'uglify:components:dist',
			'cleanCss:resources:dist',
			'cleanCss:components:dist'
		],
		[
			'useref'
		],
		[
			'useref:assets',
			'image:dist',
			'favicons'
		],
		[
			'inject',
			'clean:useref',
			'markdown',
			'cssstats'
		],
		callback
	);
});


// serve development templates
gulp.task('serve', function (callback) {
	runSequence(
		'build:dev',
		[
			'watch:static:hb:indexr',
			'watch:components:js',
			'watch:components:sass',
			'watch:resources:sass',
			'watch:jshint:components',
			'watch:jshint:resources',
			'watch:eslint:components',
			'watch:eslint:resources',
			'watch:handlebars',
			'watch:angularTemplates',
			'watch:json',
			'watch:html',
			'watch:typescript:resources',
			'watch:typescript:components',
			'watch:static:hb',
			'watch:icons'
		],
		'connect',
		'livereload:init',
		'livereload',
		'connect:open',
		callback
	);
});


// serve production templates
gulp.task('serve:dist', function (callback) {
	runSequence(
		'build',
		callback
	);
});
