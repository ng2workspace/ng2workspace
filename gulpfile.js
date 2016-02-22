'use strict';

var gulp = require('gulp');
var del = require('del');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var tslint = require("gulp-tslint");
var stylish = require('gulp-tslint-stylish');

var tsOptions = {
  noImplicitAny: true
};

var tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', function() {
  return del(['dist/**/*']);
});

gulp.task('build', ['clean'], function() {
  var tsResult = gulp.src(['typings/main.d.ts', 'src/**/*.+(ts)'])
      .pipe(tslint())
      .pipe(tslint.report(stylish, {
        emitError: false,
        sort: true,
        bell: true
      }))
      .pipe(sourcemaps.init())
      .pipe(ts(tsProject));

  return merge([
    tsResult.dts.pipe(gulp.dest('dist')),
    tsResult.js.pipe(gulp.dest('dist')).pipe(sourcemaps.write('.'))
  ]);
});


gulp.task('watch', ['build'], function() {
  gulp.watch('src/**/*.+(ts)', ['build']);
});

gulp.task('default', ['build']);