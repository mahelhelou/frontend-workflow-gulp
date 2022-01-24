const { src, dest, watch, series } = require('gulp')

// Html packages
const pug = require('gulp-pug')
const pugBeatifier = require('gulp-pug-beautify')

// Styles packages
const sass = require('gulp-sass')
const postCss = require('gulp-postcss')
const cssnano = require('cssnano')

// Scripts packages
const terser = require('gulp-terser')

// Global packages
const browserSync = require('browser-sync').create()
const rename = require('gulp-rename')

// Html
function html() {
  return src('app/assets/pug/*.pug')
    .pipe(pug({pretty: true}))
    .pipe(dest('app'))
}

// Styles
function styles() {
  return src('app/assets/styles/main.scss', { sourcemaps: true })
    .pipe(sass({
      errLogToConsole: true,
      onError: browserSync.notify,
      outputStyle: 'compressed'
    }))
    .pipe(rename('style.css'))
    .pipe(dest('app/dist', { sourcemaps: '.' }))
    .pipe(browserSync.stream())
}

// JavaScript Task
function scripts() {
  return src('app/assets/scripts/app.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(rename('bundled.js'))
    .pipe(dest('app/dist', { sourcemaps: '.' }))
    .pipe(browserSync.stream())
}

// BrowserٍٍٍSync Serve
function browserSyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: 'app',
    },
    notify: false
  })
  cb()
}

// BrowserSync Reload on Save
function browserSyncReload(cb) {
  browserSync.reload()
  cb()
}

// Watch Files
function watchFiles() {
  watch('app/*.html',  browserSyncReload)
  watch(
    ['app/assets/pug/**/*.pug', 'app/assets/styles/**/*.scss', 'app/assets/scripts/**/*.js'],
    series(html, styles, scripts, browserSyncReload)
  )
}

exports.html = html
// Default Gulp Task
exports.default = series(html, styles, scripts, browserSyncServe, watchFiles)
