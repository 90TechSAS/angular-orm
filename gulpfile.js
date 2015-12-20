var gulp       = require('gulp'),
    inject     = require('gulp-inject'),
    annotate   = require('gulp-ng-annotate'),
    babel      = require("gulp-babel"),
    less       = require('gulp-less'),
    minifyCSS  = require('gulp-minify-css'),
    concat     = require('gulp-concat'),
    bowerFiles = require('main-bower-files'),
    browserify = require('browserify'),
    del        = require('del'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer'),
    rename     = require('gulp-rename'),
    uglify     = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    Server     = require('karma').Server;


gulp.task('clean-temp', function(){
    return del(['dest']);
});

gulp.task('es6-commonjs',['clean-temp'], function(){
    return gulp.src(['./app/**/*.js','./app/**/**/*.js', './src/**/*.js'])
        .pipe(babel({auxiliaryCommentBefore: 'istanbul ignore next'}))
        .pipe(gulp.dest('dest/temp'));
});

gulp.task('bundle-commonjs-clean', function(){
    return del(['build']);
});

gulp.task('commonjs-bundle',['bundle-commonjs-clean','es6-commonjs'], function(){
    return browserify(['dest/temp/app.js']).bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(ngAnnotate())
        //.pipe(uglify())
        .pipe(rename('app.js'))
        .pipe(gulp.dest("build"));
});


gulp.task('test', ['commonjs-bundle'], function(done){
    return new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun : true
    }, done).start();
});

gulp.task('index', function () {
  gulp.src('./index.html')
    .pipe(inject(gulp.src(bowerFiles(), {read: false}), {name: 'bower',relative: true}))
    .pipe(inject(gulp.src(['./build/app.js', './assets/css/*.css'], {read: false}), {relative: true}))
    .pipe(gulp.dest('./'));
});


gulp.task('less', function () {
    gulp.src('./assets/less/style.less')
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(minifyCSS())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('./assets/css/'));
});

gulp.task('watch', function(){
    gulp.watch(['./src/**/*.js'], ['commonjs-bundle']);
    gulp.watch(['./app/**/*.js'], ['commonjs-bundle']);
    gulp.watch(['./app/**/**/*.js'], ['commonjs-bundle']);
    gulp.watch(['./assets/less/style.less'],['less']);
});

gulp.task('watch-test',['test'], function(){
    gulp.watch(['./src/**/*.js'], ['test']);
    gulp.watch(['./app/**/*.js'], ['test']);
});

gulp.task('default', ['commonjs-bundle']);