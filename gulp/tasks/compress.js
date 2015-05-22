var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var config = require('../config');
//var rimraf = require('rimraf');

gulp.task('compress', function() {
  return gulp.src('./build/app.js')
    .pipe(uglify())
    .pipe(rename("app.min.js"))
    .pipe(gulp.dest('./build/'));
});