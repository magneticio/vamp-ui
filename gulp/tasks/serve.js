var gulp = require('gulp'),
  	connect = require('gulp-connect');
 
gulp.task('connect', function() {
  connect.server({
  	port: 3000,
  	root: 'build',
  });
});
 
gulp.task('serve', ['connect']);