const gulp = require('gulp');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync');
const browserify = require('browserify');
const watchify = require('watchify');
const fs = require('fs');

gulp.task('default', ['watch css', 'log'], () => {
  browserSync.init({ server: './app' });
  // refresh browser by piping to browsersync.stream
});

gulp.task('log', () => {
  console.log('test log message');
});

gulp.task('watch css', () => {
  gulp.watch('scss/*.scss', buildSass);
});

gulp.task('rebuild server js', () => {

});

const b = browserify({
  cache: {},
  entries: ['scripts/src/*/*.js'],
  packageCache: {},
  plugin: [watchify]
});

function getSrcFiles() {

}

function bundleJs() {
  return b.bundle()
    .

}

function buildSass(event) {
  // eslint-disable-next-line
  console.log('rebuild ' + event.path);
  gulp.src(event.path)
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(prefix({ cascade: false }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.stream());
}