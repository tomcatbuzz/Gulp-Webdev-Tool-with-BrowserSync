const gulp = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

// Copy all HTML files
gulp.task('copyHtml', function(){
  gulp.src('src/*.html')
    .pipe(gulp.dest('./public'));
});

// Optimize Images
gulp.task('imageMin', function(){
  gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./public/images'));
});

// Minify JS
gulp.task('minify', function(){
  gulp.src('src/js/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('./public/js'));
});

// Scripts - For Combining Multiple JS files
gulp.task('scripts', function(){
  gulp.src('src/js/*.js')
  .pipe(concat('main.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./public/js'));
});

// Compile SASS
gulp.task('sass', () => {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass({ 
      outputStyle: 'expanded' 
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./public/css')).pipe(browserSync.stream());
});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: './public',
    notify: false,
    open: false
  });
});

gulp.task('default', ['sass', 'browser-sync', 'copyHtml', 'imageMin', 'scripts'], () => {
  gulp.watch('src/js/*.js', ['scripts']);
  gulp.watch('src/images/*', ['imageMin']);
  gulp.watch('src/*.html', ['copyHtml']);
  gulp.watch('./src/sass/**/*.scss', ['sass']);
  gulp.watch('./public/*.html').on('change', browserSync.reload);
});

