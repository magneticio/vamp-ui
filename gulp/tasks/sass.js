var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  handleErrors = require('../util/handleErrors'),
  config = require('../config').sass;


gulp.task('sass', function() {
   return gulp.src(config.src)
     .pipe(sourcemaps.init())
     .pipe(sass())
     .on('error', handleErrors)
     .pipe(autoprefixer({cascade: false, browsers: ['last 2 versions']}))
     .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.dest));

});

gulp.task('sass-min', function() {
   return gulp.src(config.src)
     .pipe(sass({outputStyle: 'compressed'}))
     .on('error', handleErrors)
     .pipe(autoprefixer({cascade: false, browsers: ['last 2 versions']}))
    .pipe(gulp.dest(config.dest));
});

// gulp.src('./scss/*.scss')
//   .pipe(sourcemaps.init())
//     .pipe(sass())
//   .pipe(sourcemaps.write())
//   .pipe(gulp.dest('./css'));

// gulp.task('sass', function() {
//   return gulp.src(config.src)
//     .pipe(sourcemaps.init())
//     .pipe(compass({
//       config_file: './config.rb',
//       css: './build',
//       sass: './src/scss',
//       style: 'expanded'
//     }))
//     .on('error', handleErrors)
//     .pipe(autoprefixer({cascade: false, browsers: ['last 2 versions']}))
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest(config.dest));
// });

// gulp.task('sass-min', function() {
//   return gulp.src(config.src)
//     .pipe(compass({
//       config_file: './config.rb',
//       css: './build',
//       sass: './src/scss',
//       style: 'compressed'
//     }))
//     .on('error', handleErrors)
//     .pipe(autoprefixer({cascade: false, browsers: ['last 2 versions']}))
//     .pipe(gulp.dest(config.dest));
// });