var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css');

var hostname = 'localhost';

gulp.task('express', function() {
    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')({port: 35729}));
    app.use(express.static(__dirname + '/app'));
    app.listen('8000', hostname);
});

var tinylr;
gulp.task('livereload', function() {
    tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});

function notifyLiveReload(event) {
    var fileName = require('path').relative(__dirname, event.path);
    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}

gulp.task('watch', function() {
    gulp.watch('sass/*.sass', ['styles'], notifyLiveReload);
    gulp.watch('app/css/*.css', notifyLiveReload);
    gulp.watch('app/*.html', notifyLiveReload);
});

gulp.task('styles', function () {
    gulp.src('sass/*.sass')
    .pipe(sass({ }).on('error', sass.logError))
    .pipe(rename({suffix: '.min'}))
    .pipe(autoprefixer({
        browsers: ['last 15 versions'],
        cascade: true
    }))
    //.pipe(minifycss())
    .pipe(gulp.dest('app/css'));
});

gulp.task('vendors', function () {
    gulp.src('bower_components/normalize.css/normalize.css')
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('app/vendor/normalize'));
});

gulp.task('default', ['styles', 'express', 'livereload', 'watch'], function() {

});
