var gulp = require('gulp'),
  compass = require('gulp-compass'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  handleErrors = require('../util/handleErrors'),
  config = require('../config').sass;

gulp.task('sass', function() {
  return gulp.src(config.src)
    .pipe(sourcemaps.init())
    .pipe(compass({
      config_file: './config.rb',
      css: './build',
      sass: './src/scss',
      style: 'expanded'
    }))
    .on('error', handleErrors)
    .pipe(autoprefixer({cascade: false, browsers: ['last 2 versions']}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.dest));
});

gulp.task('sass-min', function() {
  return gulp.src(config.src)
    .pipe(sourcemaps.init())
    .pipe(compass({
      config_file: './config.rb',
      css: './build',
      sass: './src/scss',
      style: 'compressed'
    }))
    .on('error', handleErrors)
    .pipe(autoprefixer({cascade: false, browsers: ['last 2 versions']}))
    .pipe(gulp.dest(config.dest));
});