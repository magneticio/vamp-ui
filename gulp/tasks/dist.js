var gulp = require('gulp');

gulp.task('dist', ['build-min', 'replace-dist', 'compress']);