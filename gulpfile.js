'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');
var assign = require('lodash.assign');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var minifyCss = require('gulp-minify-css');
var webserver = require('gulp-webserver');
var ghPages = require('gulp-gh-pages');

function bundleScriptsBy(bundler) {
  bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/javascripts'));
}

// ###################
// # gulp browserify #
// ###################

gulp.task('browserify', function() {
  var bundler = browserify({
    entries: ['./src/javascripts/main.jsx'],
    transform: [babelify],
    debug: true
  });

  bundleScriptsBy(bundler);
});

// #################
// # gulp watchify #
// #################

gulp.task('watchify', function() {
  var customOptions = {
    entries: ['./src/javascripts/main.jsx'],
    transform: [babelify],
    debug: true
  }
  var options = assign({}, watchify.args, customOptions)

  var bundler = watchify(browserify(options));
  bundler.on('log', gutil.log);
  bundler.on('update', function() {
    bundleScriptsBy(bundler)
  });

  bundleScriptsBy(bundler);
});

// #############
// # gulp jade #
// #############

gulp.task('jade', function() {
  gulp.src(['./src/**/*.jade', '!./src/**/_*.jade'])
    .pipe(jade())
    .pipe(gulp.dest('./dist'))
});

// ###############
// # gulp stylus #
// ###############
gulp.task('stylus', function() {
  gulp.src('./src/stylesheets/main.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({
      compress: true,
      'include css': true
    }))
    .pipe(minifyCss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/stylesheets'));
});

// ##############
// # gulp watch #
// ##############

gulp.task('watch', ['watchify', 'jade', 'stylus'], function () {
  gulp.watch('./src/**/*.jade', ['jade']);
  gulp.watch('./src/stylesheets/*.styl', ['stylus']);
});

// ##################
// # gulp webserver #
// ##################

gulp.task('webserver', function() {
  gulp.src('./dist')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

// ########
// # gulp #
// ########

gulp.task('default', ['watch', 'webserver']);

// ###############
// # gulp deploy #
// ###############

gulp.task('deploy', function() {
  gulp.src('./dist/**/*')
    .pipe(ghPages());
});
