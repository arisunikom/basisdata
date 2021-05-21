const {dest, src, series, watch, parallel}   =   require('gulp');
    gulpSass      =   require('gulp-sass');
    gulpPostcss   =   require('gulp-postcss');
    gulpRename    =   require('gulp-rename');
    autoprefixer  =   require('autoprefixer');
    browserSync   =   require('browser-sync').create();
    cssnano       =   require('cssnano');

const files ={
    sassPath    : 'public/assets/scss/**/*.scss',
    cssPath     : 'public/assets/css',
    syncPath    : 'public/**/*.html',
    bootstrap   : {
        css     : 'node_modules/bootstrap/dist/css/bootstrap.min.css',
        js      : 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
        dest : 'public/assets/vendor/bootstrap'
    },
    jqueryPath  : 'node_modules/jquery/dist/jquery.min.js',
}

function cssCompile(){
        return src(files.sassPath)
        .pipe(gulpSass().on('error', gulpSass.logError ))
        .pipe(gulpPostcss([autoprefixer(), cssnano()]))
        .pipe(gulpRename({suffix : '.min'}))
        .pipe(dest(files.cssPath))
        .pipe(browserSync.stream())
}
function vendorImport(){
    // import bootstrap
    src([files.bootstrap.css, files.bootstrap.js])
    .pipe(dest(files.bootstrap.dest))
     // import jquery
     src(files.jqueryPath)
     .pipe(dest(files.bootstrap.dest))
}
function runCompile(){
    watch(files.sassPath, cssCompile);
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    })
    watch(files.syncPath).on('change', browserSync.reload);
}
exports.default = parallel(
    vendorImport,
    cssCompile,
    runCompile
)