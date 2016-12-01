/*jshint node:true  */
'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var gutil = require('gulp-util');
var cache = require('gulp-cache');
var htmlmin = require('gulp-html-minifier');
var flatten = require('gulp-flatten');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var gulp = require('gulp');

var DEST_JS = 'app/';
var DEST_CSS = 'app/css/';
var DEST_TEMP = 'app/templates/';

var browserifyOpts = {
    entries: 'src/app/app.module.js',
    debug: true
};

var bundler = watchify(browserify(browserifyOpts), watchify.args);

bundler.on('update', function() {
    bundling();
});

gulp.task('browserSync', function() {
    browserSync.init({
		proxy: "http://localhost/ngStudio/"
    });
});

gulp.task('jshint', function(){
    gulp.src('src/app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('css', function() {
    return gulp.src('src/css/*.css')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(cleanCSS())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(DEST_CSS));
});

function bundling() {
    return bundler.bundle()
        .on('error', function(err){
            console.log(err.message);
            // end this stream
            this.emit('end');
        })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(rename({ extname: '.min.js' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(DEST_JS));
}

gulp.task('javascript', function () {
    bundling();
});

gulp.task('html', function () {
    return gulp.src('src/app/**/*.html')
        .pipe(htmlmin(({collapseWhiteSpace: true, ignorePath: '/src'})))
        .pipe(flatten())
        .pipe(gulp.dest(DEST_TEMP));
});

// Cleaning 
gulp.task('clean', function() {
    return del.sync('app').then(function(cb) {
        return cache.clearAll(cb);
    });
});

gulp.task('clean:dist', function() {
    return del.sync(['app/**/*']);
});

// Watchers
gulp.task('watch', function() {

    gulp.watch('src/app/**/*.html', ['html']);
    gulp.watch('src/app/**/*.js', ['jshint', 'javascript']);
    gulp.watch('src/css/*.css', ['css']);

    gulp.watch('app/**/*.html').on('change', browserSync.reload);
    gulp.watch('app/js/*.js').on('change', browserSync.reload);
    gulp.watch('app/css/*.css').on('change', browserSync.reload);
});

gulp.task('build', function(callback) {
    runSequence(
        'clean:dist',
        'html',
        'css',
        'jshint',
        'javascript',
        callback
    );
});

gulp.task('default', function(callback) {
    runSequence(
        'build',
        'browserSync',
        'watch',
        callback
    );
});
