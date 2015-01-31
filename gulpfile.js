var gulp = require('gulp'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	header = require('gulp-header'),
	include = require('gulp-file-include'),
	pkg = JSON.parse(require('fs').readFileSync('package.json')),
	template = ['/*!',
				' * <%= name %> <%= version %>',
				' * <%= description %>',
				' * <%= homepage %>',
				' * ',
				' * Released under the <%= license %> license',
				' * Copyright (c) <%= new Date().getFullYear() %>, <%= author %>',
				' */\n\n'].join('\n');


gulp.task('css', function () {
	return gulp.src('src/akkordion.css')
		.pipe(header(template, pkg))
		.pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
	return gulp.src('src/akkordion.js')
		.pipe(include('// @@'))
		.pipe(header(template, pkg))
		.pipe(gulp.dest('dist'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['css', 'js'])

gulp.task('dev', ['default'], function () {
	gulp.watch('src/**/*.js', ['js']);
	gulp.watch('src/*.css', ['css']);
})
