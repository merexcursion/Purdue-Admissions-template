
const { series, parallel, watch, src, dest, task } = require('gulp');
const log = require('fancy-log');

const browserSync = require('browser-sync').create();

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const merge = require('merge-stream');
const newer = require('gulp-newer');
const injectPartials = require('gulp-inject-partials');
const minify = require('gulp-minify');
const rename = require('gulp-rename');
const cssmin = require('gulp-cssmin');
const streamqueue = require('streamqueue');

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

/* ------------------------------------------------- */
// dev 

function browserSyncRun(done) {
  browserSync.init({
    server: {
      baseDir: APPPATH.root
    },
    port: 3000
  });
  done();
}
function reload(){
	browserSync.reload();
};

			 
function cleanHTML(cb){
	return src(APPPATH.root + '/*.html', {read: false, force: true })
		.pipe(clean());
	cb();
};

function cleanScripts(cb){
	return src(APPPATH.js + '/*.js', {read: false, force: true })
		.pipe(clean());
	cb();
};

function html(cb){
	return src(SOURCEPATHS.htmlSource)
		.pipe(injectPartials())
		.pipe(dest(APPPATH.root));
	cb();
};

function images(cb){
	return src(SOURCEPATHS.imgSource)
		.pipe(newer(APPPATH.img))
		.pipe(dest(APPPATH.img));
	cb();
};

function moveFonts(cb){
	src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
		  .pipe(dest(APPPATH.fonts));
	cb();
};

function runSass(cb){
	var bootstrapCSS = src('./node_modules/bootstrap/dist/css/bootstrap.css');
	var sassFiles;
	
	sassFiles = src(SOURCEPATHS.sassSource)
		.pipe(autoprefixer({
				browsers: ['last 2 versions', 'ie 7-9'],
				cascade: false
			}))
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	
	
	return merge(sassFiles, bootstrapCSS) 
		.pipe(concat('main.css'))
		.pipe(dest(APPPATH.css))
	cb();
};

function css(cb){
	var cssFiles;
	
	cssFiles = src(SOURCEPATHS.cssSource)
		.pipe(dest(APPPATH.css));
	
	cb();
};


function combineScripts(cb){
	var jqueryJS = src('./node_modules/jquery/dist/jquery.min.js');
	var bootstrapJS = src('./node_modules/bootstrap/dist/js/bootstrap.min.js');
	var objectFitPolyfill = src('./node_modules/objectFitPolyfill/dist/objectFitPolyfill.min.js');
	var jsFiles;
	
	jsFiles = src(SOURCEPATHS.jsSource) 
	return streamqueue({objectMode: true },
			jqueryJS, 
			bootstrapJS, 
			objectFitPolyfill,
			jsFiles
		)
		.pipe(concat('main.js'))
		.pipe(dest(APPPATH.js));
	
	cb();
};

function watchAll(){
	watch([SOURCEPATHS.sassSource], runSass).on('change', reload),
	watch([SOURCEPATHS.cssSource], css).on('change', reload),
	watch([SOURCEPATHS.jsSource], series(cleanScripts, combineScripts)).on('change', reload),
	watch([SOURCEPATHS.imgSource], images).on('change', reload),
	watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource], html).on('change', reload);
	return
};



/* GULP RUN DEFAULT */
exports.default = parallel(
	series(runSass, browserSyncRun), 
	css, 
	cleanHTML, 
	series(cleanScripts, combineScripts), 
	moveFonts, 
	images, 
	html, 
	watchAll
);


/* ------------------------------------------------- */
// production tasks

task('compresscss', (done) => {
	
	sassFiles = src('prod/css/main.css')
		.pipe(autoprefixer({
				browsers: ['last 2 versions'],
				cascade: false
			}))
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(dest(APPPATH.css));
		done();
});


