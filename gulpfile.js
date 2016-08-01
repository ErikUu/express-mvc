var gulp        = require('gulp'),
    nodemon     = require('gulp-nodemon'),
    plumber     = require('gulp-plumber'),
    livereload  = require('gulp-livereload'),
    sass        = require('gulp-sass'),
    maps        = require("gulp-sourcemaps"),
    del         = require("del"),
    concat      = require("gulp-concat"),
    uglify      = require("gulp-uglify"),
    rename      = require("gulp-rename"),
    webpack     = require('gulp-webpack');

//Compile sass
gulp.task('sass', function () {
  gulp.src('./public/styles/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('./public/styles'))
    .pipe(livereload());
});

// webpack
gulp.task('webpack', function() {
    return gulp.src('public/js/scripts.js')
        .pipe(webpack(require('./config/webpack.config.js')))
        .pipe(gulp.dest('public/js/'));
});

//Remove dist folder and all compiled/minified files
gulp.task("clean", function () {
  del(["./public/styles/main.css*", "./public/js/main*.js*", "./public/js/scripts.min.js", './public/components']);
});

//Watch sass files for changes´
gulp.task('watch', function() {
  gulp.watch('./public/styles/**/*.scss', ['sass']);
  gulp.watch('./public/js/**/*.js', ['webpack']);
});

//Live reload
gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'bin/www',
    ext: 'js handlebars',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

//Default task
gulp.task('default', [
  'clean',
  'sass',
  'webpack',
  'develop',
  'watch'
]);
