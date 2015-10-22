var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
    gulp.src('assets/sass/style.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('public/css'));
});

gulp.task('sass:watch', function() {
    gulp.watch('assets/sass/style.scss', ['sass']);
});