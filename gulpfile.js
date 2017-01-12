'use strict';

var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var prefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

var sourceDir = path.join(__dirname, '/src');
var sourceStylesDir = path.join(sourceDir, '/styles');
var sourceAssetsDir = path.join(sourceDir, '/assets');
var sourceImagesDir = path.join(sourceAssetsDir, '/images');
var sourceTranslationsDir = path.join(sourceDir, '/translations');

var targetDir = path.join(__dirname, '/public');
var targetStylesDir = path.join(targetDir, '/styles');
var targetFontsDir = path.join(targetDir, '/fonts');
var targetImagesDir = path.join(targetDir, '/images');
var targetTranslationsDir = path.join(targetDir, '/i18n');

var nodeModulesDir = path.join(__dirname, '/node_modules');

gulp.task('default', [
  'vendor.fonts',
  'vendor.styles',
  'application.styles',
  'application.images',
  'application.translations'
]);

gulp.task('application.styles', [], function() {
  var files = [
    path.join(sourceStylesDir, '/main.less')
  ];
  return gulp.src(files)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(prefixer({browsers: ['last 50 versions']}))
    .pipe(cleanCss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(targetStylesDir));
});

gulp.task('application.translations', function() {
  return gulp.src(path.join(sourceTranslationsDir, '/*'))
    .pipe(gulp.dest(targetTranslationsDir));
});

gulp.task('application.images', function() {
  return gulp.src(path.join(sourceImagesDir, '/**/*'))
    .pipe(gulp.dest(targetImagesDir));
});

gulp.task('vendor.styles', function() {
  var files = [
    path.join(nodeModulesDir, '/font-awesome/css/font-awesome.min.css'),
    path.join(nodeModulesDir, '/semantic-ui-css/semantic.min.css')
  ];
  return gulp.src(files)
    .pipe(gulp.dest(targetStylesDir));
});

gulp.task('vendor.fonts', function() {
  var files = [
    path.join(nodeModulesDir, '/font-awesome/fonts/*'),
    path.join(nodeModulesDir, '/semantic-ui-css/themes/default/assets/fonts/*')
  ];
  return gulp.src(files)
    .pipe(gulp.dest(targetFontsDir));
});
