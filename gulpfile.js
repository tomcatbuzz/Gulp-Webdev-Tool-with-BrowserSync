const gulp = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const browserSync = require('browser-sync').create();
const series = require('gulp');
const parallel = require('gulp');
const { src, dest } = require('gulp');


// Add paths ***FIX***
// const paths = {
//   styles: {
//     src: 'src/styles/**/*.scss',
//     dest: 'public/styles/'
//   },
//   scripts: {
//     src: 'src/scripts/**/*.js',
//     dest: 'public/scripts/'
//   }
// };

// Copy all HTML files
function copyHtml() {
  return src('src/*.html')
    .pipe(dest('./public'));
};

// Optimize Images
function imageMin() {
  return src('src/images/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(dest('./public/images'));
};

// // Minify JS
// function minify() {
//   return gulp.src('./js/*.js')
//     .pipe(uglify())
//     .pipe(gulp.dest('./public/js'));
// }

// Scripts - For Combining Multiple JS files
function scripts() {
  return src('src/js/**/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(dest('./public/js'))
    .pipe(browserSync.stream());
};

// Compile SASS
function style() {
  return src('src/scss/**/*.scss')
    .pipe(sass()) 
    .pipe(dest('./public/css'))
    .pipe(browserSync.stream());
};

function css() {
  return src()
  .pipe(sourcemaps.init())
  .pipe(postcss([ autoprefixer() ]))
  .pipe(sourcemaps.write('.'))
  .pipe(dest('./public/css'))
    .pipe(browserSync.stream());
};

function watch() {
  browserSync.init({
    server: {
      baseDir: './public'
    }
  });

  gulp.watch('src/*.html', copyHtml);
  gulp.watch('src/scss/**/*.scss', style);
  gulp.watch('src/js/*.js', scripts);
  // gulp.watch('./js/*.js', minify);
  gulp.watch('src/*.html').on('change', browserSync.reload);
  gulp.watch('src/js/*.js').on('change', browserSync.reload);
}

gulp.task("default", gulp.series(copyHtml, style, scripts, imageMin, watch));

exports.copyHtml = copyHtml;
exports.imageMin = imageMin;
// exports.minify = minify;
exports.scripts = scripts;
exports.style = style;
exports.watch = watch;
