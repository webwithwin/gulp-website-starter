const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const del = require('del');
const concatCss = require('gulp-concat-css');

const paths = {
  layouts: {
    src: 'app/**/*.html',
    dest: 'build'
  },
  styles: {
    src: 'app/scss/**/*.scss',
    dest: 'build/css'
  },
  scripts: {
    src: 'app/js/**/*.js',
    dest: 'build/js'
  },
  vendorsCss: {
    src: 'app/vendors/**/*.css',
    dest: 'build/css/vendors'
  },
  vendorsJs: {
    src: 'app/vendors/**/*.js',
    dest: 'build/js/vendors'
  }
};

// Open browser
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './build/'
    },
    port: 8888
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean build files
function clean() {
  return del(['./build/']);
}

function html() {
  return gulp
    .src(paths.layouts.src)
    .pipe(gulp.dest(paths.layouts.dest))
    // return stream
    .pipe(browsersync.stream())
}

function css() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass())
    .pipe(concatCss('style.css'))
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browsersync.stream())
}

function js() {
  return gulp
    .src(paths.scripts.src)
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.scripts.dest))
    // return stream
    .pipe(browsersync.stream())
}

function copiedCss() {
  return gulp
    .src(paths.vendorsCss.src)
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.vendorsCss.dest))
    .pipe(browsersync.stream())
}

function copiedJs() {
  return gulp
    .src(paths.vendorsJs.src)
    .pipe(gulp.dest(paths.vendorsJs.dest))
    .pipe(browsersync.stream())
}

function watchFiles() {
  gulp.watch(paths.layouts.src, html)
  gulp.watch(paths.styles.src, css)
  gulp.watch(paths.scripts.src, js)
}

const watch = gulp.parallel(watchFiles, browserSync);
const build = gulp.series(clean, gulp.parallel(html, css, js, copiedCss, copiedJs));

exports.html = html;
exports.css = css;
exports.js = js;
exports.copiedCss = copiedCss
exports.copiedJs = copiedJs
exports.clean = clean;
exports.watch = watch;
exports.build = build;

// Default gulp
exports.default = watch;
