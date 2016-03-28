//Required//

var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var assign = require('lodash.assign');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var del = require('del');



// Scripts Tasks (Browserify, Watchify, Uglify) //
// add custom browserify options here
var customOpts = {
  entries: ['./src/scripts/main.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts)); 

// add transformations here
gulp.task('scripts', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, gutil.colors.red(
       '\n\n*********************************** \n' +
      'BROWSERIFY ERROR:' +
      '\n*********************************** \n\n'
      )))
    .pipe(source('main.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    .pipe(uglify())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('../maps')) // writes .map file
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({stream:true}));
}



// CSS Tasks // (Sass, csso(minify))
gulp.task('css', function() {
    return gulp.src(['src/styles/style.scss'])
        .pipe(rename('main.css'))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(csso())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browserSync.reload({stream:true}));
});



// HTML Tasks //
gulp.task('html', function() {
  return gulp.src('./dist/**/*.html')
    .pipe(browserSync.reload({stream:true}));
});



// Browser-Sync Tasks //

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./dist/"
        }
    });
});



//Watch Tasks//
gulp.task('watch', function() {
    gulp.watch('src/styles/**/*.scss', ['css']);
    gulp.watch('dist/**/*.html', ['html']);
});



//Default Task//
gulp.task('default', ['scripts', 'css', 'browser-sync', 'watch']);
