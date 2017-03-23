const gulp = require('gulp');
const browserSync = require('browser-sync');
const wiredep = require('wiredep').stream;
const angularFilesort = require('gulp-angular-filesort');
const gulpInject = require('gulp-inject');
const ngInject = require('gulp-angular-inject-module');
const conf = require('../conf/gulp.conf');

const fs = require('fs')
const path = require('path')

gulp.task('jsInject', inject);
gulp.task('ngInject', angularDeps);

function inject() {
  const injectScripts = gulp.src([
    conf.path.tmp('**/*.js'),
    `!${conf.path.tmp('externalPlugins/**/*.js')}`,
    `!${conf.path.tmp('**/*.spec.js')}`
  ])
  .pipe(angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  const injectOptions = {
    ignorePath: [conf.paths.src, conf.paths.tmp],
    addRootSlash: false
  };

  const pluginsInjectOptions = {
    ignorePath: [conf.paths.src, conf.paths.tmp],
    addRootSlash: false,
    name: 'plugins'
  };

  return gulp.src(conf.path.src('index.html'))
    .pipe(gulpInject(injectScripts, injectOptions))
    .pipe(gulpInject(gulp.src([conf.path.tmp('externalPlugins/**/*.js')]), pluginsInjectOptions))
    .pipe(wiredep(Object.assign({}, conf.wiredep)))
    .pipe(gulp.dest(conf.paths.tmp))
    .pipe(browserSync.stream());
}


function angularDeps() {

  function getDirectories (srcpath) {
    return fs.readdirSync(srcpath)
      .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
  }

  var pluginModules = getDirectories(path.resolve(__dirname, '../' + conf.path.src('externalPlugins')));
  console.log('External plugins loaded: ' + pluginModules);
  if (pluginModules && pluginModules.length > 0 ) {
    return gulp.src(conf.path.src('vamp-ui.js'))
      .pipe(ngInject({file: 'vamp-ui.js', module: pluginModules.join(',')}))
      .pipe(gulp.dest(conf.paths.tmp));
  } else {
    return gulp.src(conf.path.src('vamp-ui.js'));
  }
}


gulp.task('inject', gulp.series('jsInject', 'ngInject'));
