var gulp = require('gulp');

gulp.task('dist', ['sass-min', 'browserify-min', 'compress', 'replace-dist']);