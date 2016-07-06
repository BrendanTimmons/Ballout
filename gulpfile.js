var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var order = require("gulp-order");

gulp.task("default", [
    "compile:js",
    "watch"
]);

gulp.task("compile:js", function () {
  return gulp.src("js/src/**/*.js")
    .pipe(order([
      "helpers.js",
      "boot.js",
      "config.js",
      "load.js",
      "menu.js",
      "play.js",
      "game.js"
    ]))
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat("all.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("js"));
});

gulp.task("watch", function () {
  return gulp.watch("js/src/**/*.js", function(){
    gulp.start('compile:js');
  });
});
