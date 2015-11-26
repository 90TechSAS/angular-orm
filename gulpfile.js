var gulp       = require('gulp'),
    inject     = require('gulp-inject'),
    annotate   = require('gulp-ng-annotate'),
    babel      = require("gulp-babel"),
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
    return gulp.src(['./tst/**/*.js', './src/**/*.js'])
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


gulp.task('watch', function(){
    gulp.watch(['./src/**/*.js'], ['commonjs-bundle']);
    gulp.watch(['./tst/**/*.js'], ['commonjs-bundle']);
});

gulp.task('watch-test',['test'], function(){
    gulp.watch(['./src/**/*.js'], ['test']);
    gulp.watch(['./tst/**/*.js'], ['test']);
});


gulp.task('default', ['commonjs-bundle']);