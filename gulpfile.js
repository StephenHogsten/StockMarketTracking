const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('default', () => {
  console.log('empty gulp task');
});

gulp.watch('scss/*.scss', (event) => {
  console.log('rebuilding ' + event.path);
  gulp.src(event.path)
    .pipe(sass().on('error', sass.logError))
    .pipe()
    .pipe(gulp.dest('css'));
});