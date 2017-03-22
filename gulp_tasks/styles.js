const path = require('path');
const gulp = require('gulp');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const svgSprite = require('gulp-svg-sprite');
const concat = require('gulp-concat');

var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var runTimestamp = Math.round(Date.now()/1000);

const conf = require('../conf/gulp.conf');

gulp.task('css', styles);

function styles() {
  return gulp.src([
      conf.path.src('/styles/index.scss'),
      conf.path.src('externalPlugins/**/*.scss')
    ])
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'})).on('error', conf.errorHandler('Sass'))
    .pipe(postcss([autoprefixer()])).on('error', conf.errorHandler('Autoprefixer'))
    .pipe(sourcemaps.write())
    .pipe(concat('index.css'))
    .pipe(gulp.dest(conf.path.tmp('styles')))
    .pipe(browserSync.stream());
}

gulp.task('Iconfont', function(){
  return gulp.src(conf.path.src('**/*.svg'))
    .pipe(iconfontCss({
      fontName: 'vampIcons',
      path: 'scss',
      targetPath: '../styles/_icons.scss',
      fontPath: 'resources/fonts/',
      cssClass: 'vampIcons'
    }))
    .pipe(iconfont({
      fontName: 'vampIcons', // required
      prependUnicode: true, // recommended option
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'], // default, 'woff2' and 'svg' are available
      timestamp: runTimestamp, // recommended to get consistent builds when watching files
      normalize: true
    }))
    .pipe(gulp.dest(conf.path.src('/fonts')));
});

gulp.task('fonts', function() {
  return gulp.src(conf.path.src('fonts/**/*'))
  .pipe(gulp.dest(conf.path.tmp('styles/resources/fonts')))
})

gulp.task('images', function(){
  return gulp.src([
    path.join(conf.paths.src, '/**/*.+(png|jpg|gif|svg|ico)'),
    path.join(`!${conf.paths.src}`, '/fonts/**/*')
  ])
  .pipe(gulp.dest(conf.path.tmp('styles/resources')))
});

gulp.task('styles', gulp.series('fonts', 'images', 'css'));
