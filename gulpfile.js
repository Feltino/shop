var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    gutil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    googlecdn = require('gulp-google-cdn'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    data = require('gulp-data'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    uglifycss = require('gulp-uglifycss'),
    gcmq = require('gulp-group-css-media-queries'),
    fileinclude = require('gulp-file-include'),
    concat = require('gulp-concat'),
    csscomb = require('gulp-csscomb');

var path = {
    vendor: {
        js: 'app/js/',
        css: 'app/css/',
        html: 'app/*.html',
    },
    dist: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'dist/',
        js: 'dist/js/',
        styl: 'dist/css/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/'
    },
    app: { //Пути откуда брать исходники
        html: 'app/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'app/js/*.js',//В стилях и скриптах нам понадобятся только main файлы
        comp: 'app/js/',//В стилях и скриптах нам понадобятся только main файлы
        lib: 'app/js/components/*.js',
        styl: 'app/precss/*.styl',
        css: 'app/css/*.css',
        img: 'app/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'app/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        styl: 'app/precss/**/*.styl',
        css: 'app/css/**/*.css',
        img: 'app/img/**/*.*',
        fonts: 'app/fonts/**/*.*'
    },
    clean: './dist'
};

var config = {
    server: {
        baseDir: "./dist"
    }
};



gulp.task('html:build', function () {
    gulp.src(path.app.html) //Выберем файлы по нужному пути
    return gulp.src(path.vendor.html)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.dist.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', function () {
    return gulp.src(path.app.lib)
        .pipe(concat('script.js'))
        .pipe(gulp.dest(path.app.comp)),
    gulp.src(path.app.js) //Найдем наш main файл
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify().on('error', gutil.log))
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.dist.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('styl:build', function () {
    return gulp.src(path.app.styl)
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(stylus({
            compress: false,
            use: nib()
        })) //Скомпилируем
        .pipe(gcmq())
        .pipe(gulp.dest('dist/css'))
        .pipe(csscomb())
        // .pipe(uglifycss({
        //     "maxLineLen": 80,
        //     "uglyComments": true
        // }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.styl))
        .pipe(reload({stream: true}));
});

gulp.task('ccc', function () {
    gulp.src('dist/css/styles.css')
        .pipe(gcmq())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('css:build', function () {
    return gulp.src(path.watch.css)
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(gulp.dest(path.dist.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.app.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'styl:build',
    'css:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.styl], function(event, cb) {
        gulp.start('styl:build');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('css:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
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
