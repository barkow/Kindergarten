// Node modules
var fs = require('fs'), vm = require('vm'), merge = require('deeply'), chalk = require('chalk'), es = require('event-stream');

// Gulp and plugins
var gulp = require('gulp'), rjs = require('gulp-requirejs-bundler'), concat = require('gulp-concat'), clean = require('gulp-clean'),
    replace = require('gulp-replace'), uglify = require('gulp-uglify'), htmlreplace = require('gulp-html-replace');

// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;');
    requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
        out: 'scripts.js',
        baseUrl: './src',
        name: 'app/startup',
        paths: {
            requireLib: 'bower_modules/requirejs/require'
        },
        include: [
            'requireLib',
            'components/nav-bar/nav-bar',
            'components/home-page/home',
            'components/families-page/families-page',
            'components/family-details-page/family-details-page',
            'components/child-details-page/child-details-page',
            'components/contact-details-page/contact-details-page',
            'components/taglist-page/taglist-page',
            'components/login-page/login-page',
            'components/lunch-page/lunch-page',
            'components/next-birthdays-element/next-birthdays-element',
            'text!components/about-page/about.html'
        ],
        insertRequire: ['app/startup'],
        bundles: {
            // If you want parts of the site to load on demand, remove them from the 'include' list
            // above, and group them into bundles here.
            // 'bundle-name': [ 'some/module', 'another/module' ],
            // 'another-bundle-name': [ 'yet-another-module' ]
        }
    });

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
gulp.task('js', function () {
    return rjs(requireJsOptimizerConfig)
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(gulp.dest('./dist/'));
});

// Concatenates CSS files, rewrites relative paths to Bootstrap fonts, copies Bootstrap fonts
gulp.task('css', function () {
    var bowerCss = gulp.src(['src/bower_modules/components-bootstrap/css/bootstrap.min.css', 
                             'src/bower_modules/select2/select2.css',
                             'src/bower_modules/select2/select2-bootstrap.css',
                             'src/bower_modules/x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css'])
            .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),
        appCss = gulp.src('src/css/*.css'),
        combinedCss = es.concat(bowerCss, appCss).pipe(concat('css.css')),
        fontFiles = gulp.src('./src/bower_modules/components-bootstrap/fonts/*', { base: './src/bower_modules/components-bootstrap/' }),
        picFiles = gulp.src(['./src/bower_modules/select2/*.gif', './src/bower_modules/select2/*.png'], { base: './src/bower_modules/select2/' });
    return es.concat(combinedCss, fontFiles, picFiles)
        .pipe(gulp.dest('./dist/'));
});

// Copies index.html, replacing <script> and <link> tags to reference production URLs
gulp.task('html', function() {
    return gulp.src('./src/index.php')
        .pipe(htmlreplace({
            'css': 'css.css',
            'js': 'scripts.js'
        }))
        .pipe(gulp.dest('./dist/'));
});

// Removes all files from ./dist/
gulp.task('clean', function() {
    return gulp.src('./dist/**/*', { read: false })
        .pipe(clean());
});

gulp.task('default', ['html', 'js', 'css'], function(callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});
