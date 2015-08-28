var gulp = require('gulp');
var protractor = require("gulp-protractor").protractor;

gulp.task('e2e', function(){
 	gulp.src(["./spec/e2e/*.js"])
	.pipe(protractor({
	    configFile: "./spec/protractor.conf.js",
	    args: ['--baseUrl', 'http://localhost:4000']
	}))
	.on('error', function(e) { throw e });
});