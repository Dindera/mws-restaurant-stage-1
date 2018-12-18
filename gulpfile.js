

const gulp = require("gulp");
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const gutil = require('gulp-util');
const autoprifixer = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');


gulp.task("default",['copy-html', 'styles'], function() {
    gulp.watch('js/**/.*js', ['scripts-dist']);
    gulp.watch('/index.html', ['copy-html']);
    gulp.watch('.dist/index.html')
        .on('change', browserSync.reload);
        browserSync.init({
        	server: './dist'
	});

});

gulp.task('dist', [
	'copy-html',
	'scripts-dist',
	'sw',
	'styles',
	'copy-img',
	'copy-manifest'	
	]);

gulp.task('copy-html', () =>{
	gulp.src(['./index.html','./restaurant.html' ])
	.pipe(gulp.dest('./dist'));
});

gulp.task('styles', () => {
    gulp.src('css/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(autoprifixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(minify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('sw', () =>{
	gulp.src('./sw.js')
	.pipe(gulp.dest('./dist'));
});

gulp.task('copy-img', () =>{
	gulp.src('src/**/*')
		.pipe(gulp.dest('./dist/src'));
});

gulp.task('copy-manifest', () =>{
	gulp.src('./manifest.json')
		.pipe(gulp.dest('./dist'));
});

gulp.task('scripts-dist', () =>{
	gulp.src('js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(uglify())
		.on('error', function(err) {
			gutil.log(gutil.colors.red('[Error]'), err.toString());
			this.emit('end');
		})
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/js'));

});


