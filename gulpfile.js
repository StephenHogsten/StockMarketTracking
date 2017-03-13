require('dotenv').config();

// const plumber = require('gulp-plumber');
const gulp = require('gulp');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('nodemon');
const browserSync = require('browser-sync');
const browserify = require('browserify');
// const babelify = require('babelify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const fs = require('fs');

// kick off all the gulp stuff
// gulp.task('default', ['watch css', 'log'], () => {
//   browserSync.init({ server: './app' });
//   // refresh browser by piping to browsersync.stream
// });
gulp.task('default', ['nodemon', 'browserSync.init', 'scss.watch', 'clientjs.build'], () => {
  // watch html files and reload browser
  gulp.watch('public/*.html', ['browserSync.reload']);
});

//server js
// set-up to autorestart on changes (only to server.js for now)
gulp.task('nodemon', () => {
  let stream = nodemon({
    script: "server.js",
    ignore: "src/"
  });
  stream
    .on('restart', () => {
      setTimeout(browserSync.reload, 1500);
    })
    .on('crash', () => {
      // eslint-disable-next-line
      console.log('crashed\n');
      stream.emit('restart', 10);
    });
});

//client js
// we mostly just want to watch the src/clientjs/ folder and compile to the public/clientjs/ folder
gulp.task('clientjs.build', () => {
  fs.readdir('./src/clientjs', (err, files) => {
    if (err) throw err;
    files.forEach((val) => {
      setupOneBrowserify(val);
    });
  });
});
function setupOneBrowserify(filename) {
  filename = 'index.js';
  let b = browserify({
    entries: './src/clientjs/' + filename,    
    debug: true,
    plugin: [watchify]
  }).transform(
    'babelify', {presets: ['react', 'es2015']}
  ).on('update', function() {
    bundleOneBrowserify(this);
  });
  b.filename = filename;
  bundleOneBrowserify(b);
}
function bundleOneBrowserify(b) {
  let f = b.filename;
  console.log('rebuilding client js: ' + f); // eslint-disable-line
  b.bundle()
    .pipe(source(f))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true  }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('public/clientjs/'));
}

//css
// set-up the watching task for the scss
gulp.task('scss.watch', () => {
  gulp.watch('src/scss/*.scss', (event) => {
    buildSass(event);
  });
});
// actually trigger rebuilding etc. for scss
function buildSass() {
  gulp.src('src/scss/main.scss')
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(prefix({ cascade: false }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('public/css/'))
    .pipe(browserSync.stream());
}

//html - watch the html and refresh
// initialize the browsersync module
gulp.task('browserSync.init', ()=> {
  if (browserSync.active) return;   // leave if it's already created
  browserSync.init({
    proxy: 'http://localhost:3000',
    port: +(process.env.PORT) + 10000
  });
});
// actually refresh
gulp.task('browserSync.reload', () => {
  browserSync.reload();
});