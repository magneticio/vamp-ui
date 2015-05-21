var gulp = require('gulp');

gulp.task('build', ['browserify', 'markup', 'sass']);
gulp.task('build-min', ['browserify-min', 'markup', 'sass-min', 'compress']);
