require('dotenv').config();

const gulp = require('gulp');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
// const plumber = require('gulp-plumber');
const nodemon = require('nodemon');
const browserSync = require('browser-sync');
const browserify = require('browserify');
const watchify = require('watchify');
// const uglify = require('gulp-uglify');
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
      console.log('mememe');
      setTimeout(() => {
        browserSync.reload();
        console.log('we reloaded');
      }, 5000);
    })
    .on('crash', () => {
      // eslint-disable-next-line
      console.log('crashed\n');
      stream.emit('restart', 10);
    });
});

//client js
// we mostly just want to watch the src/components/ folder and compile to the public/components/ folder
/*gulp.task('clientjs.watch', () => {
  gulp.watch('src/components/*.js', ['browser.bundle'], browserSync.reload);
});
function makeBrowserify(cb) {
  var fileArr = [];
  fs.readdir('./src/components', (err, files) => {
    files.forEach( (oneFile) => {
      fileArr.push('./src/components/' + oneFile);
    });
    var b = browserify({
      entries: fileArr,
      presets: ['babel-preset-react', 'babel-preset-es2015']
    });
    cb(b);
  });
}
gulp.task('browser.bundle', () => {
  makeBrowserify( (b) => {
    b.bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('public/components/'));
  });
}); */
gulp.task('clientjs.build', () => {
  fs.readdir('./src/clientjs', (err, files) => {
    if (err) throw err;
    files.forEach(setupOneBrowserify);
    setTimeout(browserSync.reload, 1000);
  });
});
function setupOneBrowserify(filename) {
  console.log('one file: ' + filename);
  let b = watchify(browserify({
    entries: './src/clientjs/' + filename,
    presets: ['babel-preset-react', 'babel-preset-es2015'],
    transforms: ['uglify'],
    debug: true
  })).on('update', function() {
    bundleOneBrowserify(this);
  });
  b.filename = filename;
  bundleOneBrowserify(b);
}
function bundleOneBrowserify(b) {
  b.bundle()
    .pipe(source(b.filename))
      .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true  }))
    .pipe(sourcemaps.write('../../maps'))
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
function buildSass(event) {
  // eslint-disable-next-line
  console.log('rebuild ' + event.path + '\n');
  gulp.src('src/scss/main.scss')
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(prefix({ cascade: false }))
    .pipe(sourcemaps.write('../../maps'))
    .pipe(gulp.dest('public/'))
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