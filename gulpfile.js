var gulp = require('gulp');
var debug = require('gulp-debug');
var jshint = require('gulp-jshint');

// Tasks
gulp.task('lint', ['jshint']);

// Exclude node_modules
var self = '!node_modules/**/*';

// Lint JavaScript files
gulp.task('jshint', function() {
    return gulp.src(['./**/*.js', self])
        .pipe(debug({title: 'jshint:'}))
        .pipe(jshint())
});
