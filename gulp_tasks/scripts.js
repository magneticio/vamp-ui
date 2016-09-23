const gulp = require('gulp');
const eslint = require('gulp-eslint');

const conf = require('../conf/gulp.conf');

gulp.task('lint', lint);

function lint() {
  return gulp.src(conf.path.src('**/*.js'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulp.dest(conf.path.tmp()));
}

gulp.task('lint-strict', lintStrict);

function lintStrict() {
  return lint().pipe(eslint.failOnError());
}
