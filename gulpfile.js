var del        = require('del');             // npm module
var gulp       = require('gulp');
var webserver  = require('gulp-webserver');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var concat     = require('gulp-concat-sourcemap');
var plumber    = require('gulp-plumber');
var uglify     = require('gulp-uglify');
var notify     = require('gulp-notify');

gulp.task('ts', function() {

    del(['js/*.js']).then(paths => 
    {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });

    var ts = [
        'app.ts',
    ].map(filename=>'./ts/'+filename);

    var tsr = 
    gulp.src(ts)
        .pipe(sourcemaps.init())
        .pipe(typescript())
        .pipe(concat('client.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./js'))
        .pipe(notify({message:'compile complite'}))
    
    
});

gulp.task('webserver', function ()
{
    gulp.src('.')
        .pipe(webserver({
            host: '0.0.0.0',
            port: 9999,
            livereload: true
       }));
});

gulp.task('watch', ['webserver'], function() {
	gulp.watch(['./ts/*.ts', '*.html', './css/*.css'], ['ts']);
});

gulp.task('default', ['watch']);

