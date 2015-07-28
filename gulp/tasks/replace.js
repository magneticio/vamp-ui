var gulp = require('gulp');
var htmlreplace = require('gulp-html-replace');
 
gulp.task('replace-dev', function() {
  gulp.src('src/www/index.html')
    .pipe(htmlreplace({
        'js': 'app.js'
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('replace-dist', ['browserify-min', 'compress'], function() {
  gulp.src('src/www/index.html')
    .pipe(htmlreplace({
        'js': 'app.min.js'
    }))
    .pipe(gulp.dest('build/'));
});