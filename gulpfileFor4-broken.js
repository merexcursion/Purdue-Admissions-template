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
	cssSource: 'dev/scss/*.css',
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
gulp.task('clean-html', (done) => {
	return gulp.src(APPPATH.root + '/*.html', {read: false, force: true })
		.pipe(clean());
	done();
});
gulp.task('clean-scripts', (done) => {
	return gulp.src(APPPATH.js + '/*.js', {read: false, force: true })
		.pipe(clean());
	done();
});
gulp.task('html', (done) => {
	return gulp.src(SOURCEPATHS.htmlSource)
		.pipe(injectPartials())
		.pipe(gulp.dest(APPPATH.root));
	done();
});
gulp.task('images', (done) => {
	return gulp.src(SOURCEPATHS.imgSource)
		.pipe(newer(APPPATH.img))
		.pipe(gulp.dest(APPPATH.img));
	done();
});
gulp.task('moveFonts', (done) => {
	gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
		  .pipe(gulp.dest(APPPATH.fonts));
	done();
});
gulp.task('sass', (done) => {
	var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
	var sassFiles;
	
	sassFiles = gulp.src(SOURCEPATHS.sassSource)
		.pipe(autoprefixer({
				browsers: ['last 2 versions', 'ie 7-9'],
				cascade: false
			}))
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	
	return merge(sassFiles, bootstrapCSS) 
		.pipe(concat('main.css'))
		.pipe(gulp.dest(APPPATH.css));
	done();
});
gulp.task('css', (done) => {
	var cssFiles;
	
	cssFiles = gulp.src(SOURCEPATHS.cssSource)
		.pipe(gulp.dest(APPPATH.css));
	done();
});
gulp.task('scripts', gulp.series(gulp.parallel('clean-scripts'), (done) => {
	var jqueryJS = gulp.src('./node_modules/jquery/dist/jquery.min.js');
	var bootstrapJS = gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js');
	var objectFitPolyfill = gulp.src('./node_modules/objectFitPolyfill/dist/objectFitPolyfill.min.js');
	var jsFiles;
	
	jsFiles = gulp.src(SOURCEPATHS.jsSource) 
	return streamqueue({objectMode: true },
			jqueryJS, 
			bootstrapJS, 
			objectFitPolyfill,
			jsFiles
		)
		.pipe(concat('main.js'))
		.pipe(gulp.dest(APPPATH.js));
	done();
}));

gulp.task('serve', gulp.series('sass'), () => { 
	browserSync.init([ APPPATH.css + '/*.css', APPPATH.root +  '/*.html', APPPATH.js +  '/*.js'], {
		server: {
			baseDir: APPPATH.root
		}
	});
	browserSync.reload;
});


/* production */
gulp.task('compress', (done) => {
	//gulp.src(SOURCEPATHS.jsSource)
		//.pipe(concat('main.js'))
		gulp.src('prod/js/main.js')
		.pipe(minify())
		.pipe(gulp.dest(APPPATH.js));
		done();
});
gulp.task('compresscss', (done) => {
	//var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
	//var sassFiles;
	
	//sassFiles = gulp.src(SOURCEPATHS.sassSource)
	sassFiles = gulp.src('prod/css/main.css')
		.pipe(autoprefixer({
				browsers: ['last 2 versions'],
				cascade: false
			}))
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	
	//return merge(sassFiles, bootstrapCSS)
		//.pipe(concat('main.css'))
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(APPPATH.css));
		done();
});


/* --- CLI TASKS --- */

gulp.task('watch', gulp.series('serve', 'sass', 'css', 'clean-html','scripts', 'moveFonts', 'images', 'html'), () =>{
	gulp.watch([SOURCEPATHS.sassSource], ['sass']);
	gulp.watch([SOURCEPATHS.cssSource], ['css']);
	gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
	gulp.watch([SOURCEPATHS.imgSource], ['images']);
	gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource], ['html']);
	
});

gulp.task('default', gulp.series('watch'));

gulp.task('production', gulp.series(gulp.parallel('compresscss', 'compress')));
						 
						 