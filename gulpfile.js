/* --- VARS --- */	
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var newer = require('gulp-newer');
var injectPartials = require('gulp-inject-partials');
var minify = require('gulp-minify');
var rename = require('gulp-rename');
var cssmin = require('gulp-cssmin');
var streamqueue = require('streamqueue');

var SOURCEPATHS = {
	sassSource: 'dev/scss/*.scss',
	htmlSource: 'dev/*.html',
	htmlPartialSource: 'dev/partials/*.html',
	jsSource: 'dev/js/*.js',
	imgSource: 'dev/images/**'
} 
var APPPATH = {
	root: 'prod/',
	css: 'prod/css',
	js: 'prod/js',
	fonts: 'prod/fonts',
	img: 'prod/images'
}

/* --- TASKS --- */	
/* dev */
gulp.task('clean-html', function(){
	return gulp.src(APPPATH.root + '/*.html', {read: false, force: true })
		.pipe(clean());
});
gulp.task('clean-scripts', function(){
	return gulp.src(APPPATH.js + '/*.js', {read: false, force: true })
		.pipe(clean());
});
gulp.task('html', function(){
	return gulp.src(SOURCEPATHS.htmlSource)
		.pipe(injectPartials())
		.pipe(gulp.dest(APPPATH.root))
});
gulp.task('images', function(){
	return gulp.src(SOURCEPATHS.imgSource)
		.pipe(newer(APPPATH.img))
		.pipe(gulp.dest(APPPATH.img));
});
gulp.task('moveFonts', function(){
	gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
		  .pipe(gulp.dest(APPPATH.fonts))
});
gulp.task('sass', function(){
	var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
	var sassFiles;
	
	sassFiles = gulp.src(SOURCEPATHS.sassSource)
		.pipe(autoprefixer({
				browsers: ['last 2 versions'],
				cascade: false
			}))
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	
	return merge(sassFiles, bootstrapCSS)
		.pipe(concat('main.css'))
		.pipe(gulp.dest(APPPATH.css));
});
gulp.task('scripts', ['clean-scripts'], function(){
	var jqueryJS = gulp.src('./node_modules/jquery/dist/jquery.js');
	var bootstrapJS = gulp.src('./node_modules/bootstrap/dist/js/bootstrap.js');
	var jsFiles;
	
	jsFiles = gulp.src(SOURCEPATHS.jsSource) 
	return streamqueue({objectMode: true },
			jqueryJS, 
			bootstrapJS, 
			jsFiles
		)
		.pipe(concat('main.js'))
		.pipe(gulp.dest(APPPATH.js))
});
gulp.task('serve', ['sass'], function(){ 
	browserSync.init([ APPPATH.css + '/*.css', APPPATH.root +  '/*.html', APPPATH.js +  '/*.js'], {
		server: {
			baseDir: APPPATH.root
		}
	})
});

/* production */
gulp.task('compress', function(){
	gulp.src(SOURCEPATHS.jsSource)
		.pipe(concat('main.js'))
		.pipe(minify())
		.pipe(gulp.dest(APPPATH.js))
});
gulp.task('compresscss', function(){
	var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
	var sassFiles;
	
	sassFiles = gulp.src(SOURCEPATHS.sassSource)
		.pipe(autoprefixer({
				browsers: ['last 2 versions'],
				cascade: false
			}))
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	
	return merge(sassFiles, bootstrapCSS)
		.pipe(concat('main.css'))
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(APPPATH.css));
});


/* --- CLI TASKS --- */

gulp.task('watch', ['serve', 'sass', 'clean-html','scripts', 'moveFonts', 'images', 'html'], function(){
	gulp.watch([SOURCEPATHS.sassSource], ['sass']);
	gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
	gulp.watch([SOURCEPATHS.imgSource], ['images']);
	gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource], ['html'])
});

gulp.task('default', ['watch']);

gulp.task('production', ['compresscss', 'compress'])
						 
						 