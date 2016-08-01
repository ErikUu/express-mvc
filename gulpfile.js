var gulp        = require('gulp'),
    nodemon     = require('gulp-nodemon'),
    plumber     = require('gulp-plumber'),
    livereload  = require('gulp-livereload'),
    sass        = require('gulp-sass'),
    maps        = require("gulp-sourcemaps"),
    del         = require("del"),
    concat      = require("gulp-concat"),
    uglify      = require("gulp-uglify"),
    rename      = require("gulp-rename");

//Compile sass
gulp.task('sass', function () {
  gulp.src('./public/styles/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('./public/styles'))
    .pipe(livereload());
});

//Concat and map scripts
gulp.task("concatScripts" ,function () {
  return gulp.src(["./public/js/**/*.js", "!./public/js/**/main*.js*"])
    .pipe(plumber())
    .pipe(maps.init())
    .pipe(concat("main.js"))
    .pipe(maps.write("/."))
    .pipe(gulp.dest("./public/js"))
    .pipe(livereload());
});

//Minify scripts
gulp.task("minifyScripts", ["concatScripts"], function () {
  return gulp.src("./public/js/main.js")
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest("./public/js/mini/"));
});

//Remove dist folder and all compiled/minified files
gulp.task("clean", function () {
  del(["./public/styles/main.css*", "./public/js/main*.js*", "./public/js/mini"]);
});

//Watch sass files for changes
gulp.task('watch', function() {
  gulp.watch('./public/styles/**/*.scss', ['sass']);
  gulp.watch('./public/js/**/*.js', ['concatScripts']);
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
  'minifyScripts',
  'develop',
  'watch'
]);
