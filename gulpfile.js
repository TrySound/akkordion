var gulp = require('gulp'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	header = require('gulp-header'),
	include = require('gulp-file-include'),
	postcss = require('gulp-postcss'),
	template = ['/*!',
				' * <%= name %> <%= version %>',
				' * <%= description %>',
				' * <%= homepage %>',
				' * ',
				' * Released under the <%= license %> license',
				' * Copyright (c) <%= new Date().getFullYear() %>, <%= author %>',
				' */\n\n'].join('\n');


gulp.task('css', function () {
	var pkg = JSON.parse(require('fs').readFileSync('package.json'));
	return gulp.src('src/' + pkg.name + '.css')
		.pipe(postcss([
			require('postcss-easings')(),
			require('autoprefixer-core')('last 2 versions')
		]))
		.pipe(header(template, pkg))
		.pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
	var pkg = JSON.parse(require('fs').readFileSync('package.json'));
	return gulp.src('src/' + pkg.name + '.js')
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
	gulp.watch(['package.json', 'src/**/*.js'], ['js']);
	gulp.watch(['package.json', 'src/*.css'], ['css']);
})
