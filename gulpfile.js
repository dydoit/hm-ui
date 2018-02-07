const gulp = require('gulp')
const pug = require('gulp-pug')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const clean = require('gulp-clean')
const notify = require('gulp-notify')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const bs = require('browser-sync').create()

// build:js
gulp.task('build:js', () => {
  return gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('../sourcemaps/js'))
    .pipe(gulp.dest('dist/js'))
})

// watch:js
gulp.task('watch:js', ['build:js'], () => {
  gulp.watch('src/js/**/*.js', ['build:js'])
})

// build:sass
gulp.task('build:sass', () => {
  return gulp.src('src/style/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: [
        "last 2 version",
        "> 0.1%",
        "ie <= 11",
        "Firefox < 20",
        "Chrome < 43",
      ]
    }))
    .pipe(sourcemaps.write('../sourcemaps/css'))
    .pipe(gulp.dest('dist/css'))
})

// watch:sass
gulp.task('watch:sass', ['build:sass'], () => {
  gulp.watch('src/style/**/*.scss', ['build:sass'])
})

// build:view
gulp.task('build:view', () => {
  return gulp.src('src/view/page/**/*.pug')
    .pipe(pug({ pretty: '  ' }).on('error', notify.onError(error => `pug went wrong, ${error}`)))
    .pipe(gulp.dest('dist/page'))
})

// watch:view
gulp.task('watch:view', ['build:view'], () => {
  gulp.watch('src/view/**/*.pug', ['build:view'])
})

// copy:assets
gulp.task('copy:assets', () => {
  return gulp.src('src/assets/**/*')
  .pipe(gulp.dest('dist/assets'))
})

// watch:assets
gulp.task('watch:assets', ['copy:assets'], () => {
  gulp.watch('src/assets/**/*', ['copy:assets'])
})

// clean
gulp.task('clean', () => {
  return gulp.src('dist', { read: false })
    .pipe(clean())
})

////////////////////////////////////////////////////////////
// build
gulp.task('build', ['build:js', 'build:sass', 'build:view', 'copy:assets'])

// watch
gulp.task('watch', ['watch:js', 'watch:sass', 'watch:view', 'watch:assets'])

// default(dev server)
gulp.task('default', ['watch'], () => {
  bs.init({
    startPath: 'page',
    server: './dist',
    port: 3000
  })
  gulp.watch('./dist/**/*').on('change', bs.reload)
})
