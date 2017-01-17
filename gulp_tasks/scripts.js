const gulp = require('gulp');
const eslint = require('gulp-eslint');
const gulpIf = require('gulp-if');

function isFixed(file) {
	// Has ESLint fixed the file contents?
	return file.eslint != null && file.eslint.fixed;
}

const conf = require('../conf/gulp.conf');

gulp.task('scripts', function () {
  return gulp.src(conf.path.src('**/*.js'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulp.dest(conf.path.tmp()));
});

gulp.task('lint-n-fix', function () {

	return gulp.src(conf.path.src('**/*.js'))
		.pipe(eslint({
			fix: true
		}))
		.pipe(eslint.format())
		// if fixed, write the file to dest
		.pipe(gulpIf(isFixed, gulp.dest(conf.paths.src)));
});

gulp.task('failAfterError', function () {
  return gulp.src(conf.path.src('**/*.js'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
