var gulp = require('gulp'), //基础库
    concat = require('gulp-concat'), //合并文件
    connect = require('gulp-connect'),
    less = require('gulp-less'), //less解析
    minifycss = require('gulp-minify-css'), //css压缩
    jshint = require('gulp-jshint'), //js检查
    header = require('gulp-header'),
    footer = require('gulp-footer'),
    uglify = require('gulp-uglify'), //js压缩
    rename = require('gulp-rename'), //重命名
    clean = require('gulp-clean'), //清空文件夹
    del = require('del'),
    open = require('gulp-open'),
    livereload = require('gulp-livereload'), //livereload
    paths = {
        root: './',
        dist: {
            root: 'dist/'
        },
        source: {
            html: 'src/html/',
            styles: 'src/css/'
        }
    },
    emu = {
        filename: 'emu',
        jsFiles: [
            'src/emu.js',
            'src/emu/window.js',
            'src/emu/request.js',
            'src/emu/app.js',
            'src/emu/tabMark.js',
            'src/emu/event.js'
        ]
    },
    debug = {
        filename: 'debug',
        jsFiles: [
            'src/debug.js',
            'src/debug/device.js',
            'src/debug/os.js',
            'src/debug/app.js',
            'src/debug/dom.js',
            'src/debug/window.js',
            'src/debug/http.js',
            'src/debug/storage.js',
            'src/debug/screen.js',
            'src/debug/audio.js',
            'src/debug/tabMark.js',
            'src/debug/event.js'
        ]
    },
    banner = {
        header: [
            '/**',
            ' * Released on: <%= date.year %>-<%= date.month %>-<%= date.day %>',
            ' * =====================================================',
            ' * <%= name %> v1.0.1 (http://docs.369cloud.com/engine/jssdk/JS-SDK)',
            ' * =====================================================',
            ' */',
            ''
        ].join('\n'),
        footer: [
            '/**',
            ' * Released on: <%= date.year %>-<%= date.month %>-<%= date.day %>',
            ' */',
            ''
        ].join('\n')
    },
    date = {
        year: new Date().getFullYear(),
        month: ('1 2 3 4 5 6 7 8 9 10 11 12').split(' ')[new Date().getMonth()],
        day: new Date().getDate()
    };



gulp.task('cleanDist', function(cb) {
    return del([paths.dist.root]);
});


gulp.task('dist-emu', function(cb) {
    gulp.src(emu.jsFiles) //要合并的文件
        .pipe(concat(emu.filename + ".js")) // 合并匹配到的js文件并命名为 "all.js"
        .pipe(header(banner.header, {
            date: date,
            name: 'EMU'
        }))
        .pipe(gulp.dest(paths.dist.root))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(header(banner.header, {
            date: date,
            name: 'EMU'
        }))
        .pipe(gulp.dest(paths.dist.root))
        .on('finish', function() {
            cb();
        });
});

gulp.task('dist-debug', function(cb) {
    gulp.src(debug.jsFiles) //要合并的文件
        .pipe(concat(debug.filename + ".js")) // 合并匹配到的js文件并命名为 "all.js"
        .pipe(header(banner.header, {
            date: date,
            name: 'DEBUG'
        }))
        .pipe(gulp.dest(paths.dist.root))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(header(banner.header, {
            date: date,
            name: 'DEBUG'
        }))
        .pipe(gulp.dest(paths.dist.root))
        .on('finish', function() {
            cb();
        });
});



gulp.task('dist-html', function(cb) {
    gulp.src(paths.source.html + '*.*')
        .pipe(gulp.dest(paths.dist.root))
        .on('finish', function() {
            cb();
        });
});


gulp.task('dist-css', function(cb) {
    gulp.src(paths.source.css + '*.*')
        .pipe(gulp.dest(paths.dist.root))
        .on('finish', function() {
            cb();
        });
});



gulp.task('build', gulp.series('cleanDist', 'dist-emu', 'dist-debug', 'dist-html', 'dist-css'));

/* =================================
    Watch
================================= */

gulp.task('watch', function(cb) {
    var server = livereload();
    livereload.listen();
    gulp.watch(paths.source + '**/*.*', gulp.series('build'));
    cb();
});



gulp.task('default', gulp.series('build', 'watch'));