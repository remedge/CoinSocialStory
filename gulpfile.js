'use strict';

const gulp = require('gulp');
const less = require('gulp-less');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

gulp.task('clear', function () {
	return del(['build']);
});

gulp.task('styles', function() {
  return gulp.src('client/styles/style.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css'))
});
    
gulp.task('js', function() {
  return gulp.src('client/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'))
});

gulp.task('build', gulp.series('clear', 'styles', 'js'));
gulp.task('default', gulp.series('build'));