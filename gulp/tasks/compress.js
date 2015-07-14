var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var config = require('../config');

gulp.task('compress', ['browserify-min'], function() {
  return gulp.src('./build/app.js')
    .pipe(uglify({
    	output: {
            comments: /^!|\b(copyright|license)\b|@(preserve|license|cc_on)\b/i
        }
    }))
    .pipe(rename("app.min.js"))
    .pipe(gulp.dest('./build/'));
});