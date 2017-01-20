const path = require('path');

const gulp = require('gulp');
const del = require('del');
const filter = require('gulp-filter');

const conf = require('../conf/gulp.conf');

gulp.task('clean', clean);

function clean() {
  return del([conf.paths.dist, conf.paths.tmp]);
}

function other() {
  const fileFilter = filter(file => file.stat.isFile());

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join(`!${conf.paths.src}`, '/**/*.{scss,js,html}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(conf.paths.dist));
}

gulp.task('fonts:dist', function() {
  return gulp.src(conf.path.src('fonts/**/*'))
  .pipe(gulp.dest(conf.path.dist('styles/resources/fonts')))
})

gulp.task('images:dist', function(){
  return gulp.src([
    path.join(conf.paths.src, '/**/*.+(png|jpg|gif|svg|ico)'),
    path.join(`!${conf.paths.src}`, '/fonts/**/*')
  ])
  .pipe(gulp.dest(conf.path.dist('styles/resources')))
});


gulp.task('other', gulp.parallel('fonts:dist', 'images:dist'));
