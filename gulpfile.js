'use strict';
var debug = false;  
var   gulp = require('gulp'),
      concat = require('gulp-concat'),
      prefixer = require('gulp-autoprefixer'),
      uglify = require('gulp-uglify'),
      sourcemaps = require('gulp-sourcemaps'),
      cssmin = require('gulp-minify-css'),
      imagemin = require('gulp-imagemin'),
      pngquant = require('imagemin-pngquant'),
      browserSync = require("browser-sync"),
      reload = browserSync.reload;

gulp.task('css', function() {
    var css = [
        'assets/src/css/style.css',
        'assets/vendor/bootstrap/css/bootstrap.min.css'
    ];      
    gulp.src(css)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('assets/css'));
});

var config = {
    server: 
    {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "My template"
};

var path = {
    build: {
        js: 'build/js/',
        style: 'build/css/',
        img: 'build/img/',
       fonts: 'build/fonts/'
    },
    src: {
        js: [
            'assets/vendor/jquery/jquery-2.2.3.min.js',
            'assets/vendor/bootstrap/js/bootstrap.min.js',
            'assets/src/js/script.js',
    ], 
        style: [
            'assets/src/css/style.css',
            'assets/vendor/bootstrap/css/bootstrap.min.css'
            ],
       img: 'assets/src/img/**/*.*',
       fonts: 'assetsd/src/fonts/**/*.*'
    },
    watch: {
             js: 'assets/src/js/script.js',
             style: 'assets/src/css/*.css',
       img: 'assets/src/img/**/*.*',
       fonts: 'assetsd/src/fonts/**/*.*'
            },
    clean: './build'
};


gulp.task('js:build', function () {
    gulp.src(path.src.js) 
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.init()) 
        .pipe(uglify()) 
        .pipe(sourcemaps.write()) 
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) 
        .pipe(concat('vendor.css'))
        .pipe(sourcemaps.init())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.style))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) 
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);


gulp.task('watch', function(){
    gulp.watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    gulp.watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    gulp.watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    gulp.watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});



gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


gulp.task('default', ['build', 'webserver', 'watch']);