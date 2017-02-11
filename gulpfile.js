'use strict';
 
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    naturalSort = require("gulp-natural-sort"),
    inject = require('gulp-inject'),
    webserver = require('gulp-webserver'),
    runSequence = require('run-sequence'),
    autoprefixer = require('gulp-autoprefixer');

var appBaseUrl = 'http://localhost:8000/index.html';
 
gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))    
    .pipe(gulp.dest('./css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('inject', function () {
  var target = gulp.src('./index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp
    .src(['./css/**/*.css'
          ], {
            read: false
          })
    .pipe(naturalSort());
 
  return target
    .pipe(inject(sources))
    .pipe(gulp.dest('.'));
});

gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: appBaseUrl
    }));
});

gulp.task('default', function() {
  runSequence('serve');
});

gulp.task('serve', function() {
  runSequence('sass', 'inject', 'webserver', 'sass:watch');
});

gulp.task('prod', function() {
  runSequence('sass', 'inject');
});