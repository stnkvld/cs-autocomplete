const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');
const del = require('del');
const babel = require('gulp-babel');

const cssFiles = [
    'src/css/style.css',
];

const jsFiles = [
    'src/js/script.js',
];

function minifyStyles() {
    return gulp.src(cssFiles)
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
          browsers: ['> 0.1%'],
          cascade: false
        }))
        .pipe(cleanCSS({
          level: 2
        }))
        .pipe(gulp.dest('./dest/css'));
}

function babelScripts() {
    return gulp.src(jsFiles)
        .pipe(concat('script.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(minify({
            ext: {
              min: '.min.js'
            },
            noSource: true
        }))
        .pipe(gulp.dest('./dest/js'));
}

function clean() {
    return del(['dest/*']);
}

function watch() {
    gulp.watch(cssFiles, minifyStyles);
    gulp.watch(jsFiles, babelScripts);
}

gulp.task('minifyStyles', minifyStyles);
gulp.task('babelScripts', babelScripts);
gulp.task('clean', clean);
gulp.task('watch', watch);

gulp.task('build', gulp.series('clean', 
    gulp.parallel('minifyStyles', 'babelScripts')
));
gulp.task('dev', gulp.series('build', 'watch'));