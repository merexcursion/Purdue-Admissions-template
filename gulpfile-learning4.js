
// this was usefukL https://browsersync.io/docs/gulp
/* ---------------------------------------------------------------
	GULPFILES, TASKS, ASYNC
-----------------------------------------------------------------*/
https://gulpjs.com/docs/en/getting-started/javascript-and-gulpfiles
https://gulpjs.com/docs/en/getting-started/creating-tasks
https://gulpjs.com/docs/en/getting-started/async-completion

const { src, dest } = require('gulp');

function streamTask() {
  return src('*.js')
    .pipe(dest('output'));
}

exports.default = streamTask;

 ---
 
function promiseTask() {
  return Promise.resolve('the value is ignored');
}

exports.default = promiseTask;

---

const { EventEmitter } = require('events');

function eventEmitterTask() {
  const emitter = new EventEmitter();
  // Emit has to happen async otherwise gulp isn't listening yet
  setTimeout(() => emitter.emit('finish'), 250);
  return emitter;
}

exports.default = eventEmitterTask;

---

const { exec } = require('child_process');

function childProcessTask() {
  return exec('date');
}

exports.default = childProcessTask;

---

const { Observable } = require('rxjs');

function observableTask() {
  return Observable.of(1, 2, 3);
}

exports.default = observableTask;

---

Using an error-first callback
If nothing is returned from your task, you must use the error-first callback to signal completion. The callback will be passed to your task as the only argument - named cb() in the examples below.

function callbackTask(cb) {
  // `cb()` should be called by some async work
  cb();
}

exports.default = callbackTask;

To indicate to gulp that an error occurred in a task using an error-first callback, call it with an Error as the only argument.

function callbackError(cb) {
  // `cb()` should be called by some async work
  cb(new Error('kaboom'));
}

exports.default = callbackError;

However, you'll often pass this callback to another API instead of calling it yourself.

const fs = require('fs');

function passingCallback(cb) {
  fs.access('gulpfile.js', cb);
}

exports.default = passingCallback;

---

When not using any of the previous options, you can define your task as an async function, which wraps your task in a promise. This allows you to work with promises synchronously using await and use other synchronous code.

const fs = require('fs');

async function asyncAwaitTask() {
  const { version } = fs.readFileSync('package.json');
  console.log(version);
  await Promise.resolve('some result');
}

exports.default = asyncAwaitTask;

---

Resources for those above : 
https://nodejs.org/api/errors.html#errors_error_first_callbacks
https://nodejs.org/api/stream.html#stream_stream
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
https://nodejs.org/api/events.html#events_events
https://nodejs.org/api/child_process.html#child_process_child_process
https://github.com/tc39/proposal-observable/blob/master/README.md

////////////////////////////////////////////////////////////////////////////////////////////

/* ---------------------------------------------------------------
	WORKING WITH FILES / GLOBS
-----------------------------------------------------------------*/

The src() and dest() methods are exposed by gulp to interact with files on your computer.
src() is given a glob to read from the file system and produces a Node stream. It locates all matching files and reads them into memory to pass through the stream.
The main API of a stream is the .pipe() method for chaining Transform or Writable streams.

const { src, dest } = require('gulp');
const babel = require('gulp-babel');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(dest('output/'));
}

dest() is given an output directory string and also produces a Node stream which is generally used as a terminator stream. When it receives a file passed through the pipeline, it writes the contents and other details out to the filesystem at a given directory. The symlink() method is also available and operates like dest(), but creates links instead of files (see symlink() for details).

Most often plugins will be placed between src() and dest() using the .pipe() method and will transform the files within the stream.

const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(src('vendor/*.js'))
    .pipe(uglify())
    .pipe(dest('output/'));
}

Output in phases
dest() can be used in the middle of a pipeline to write intermediate states to the filesystem. When a file is received, the current state is written out to the filesystem, the path is updated to represent the new location of the output file, then that file continues down the pipeline.

This feature can be useful to create unminified and minified files with the same pipeline.

const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

exports.default = function() {
  return src('src/*.js')
    .pipe(babel())
    .pipe(src('vendor/*.js'))
    .pipe(dest('output/'))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('output/'));
}

Modes: streaming, buffered, and empty
src() can operate in three modes: buffering, streaming, and empty. These are configured with the buffer and read options on src().

Buffering mode is the default and loads the file contents into memory. Plugins usually operate in buffering mode and many don't support streaming mode.

Streaming mode exists mainly to operate on large files that can't fit in memory, like giant images or movies. The contents are streamed from the filesystem in small chunks instead of loaded all at once. If you need to use streaming mode, look for a plugin that supports it or write your own.

Empty mode contains no contents and is useful when only working with file metadata.

On globs for files (for example - 'scripts/**/*.js'):
https://gulpjs.com/docs/en/getting-started/explaining-globs

/* ---------------------------------------------------------------
	PLUGINS
-----------------------------------------------------------------*/
	
Gulp plugins are Node Transform Streams that encapsulate common behavior to transform files in a pipeline - often placed between src() and dest() using the .pipe() method. They can change the filename, metadata, or contents of every file that passes through the stream.

Plugins from npm - using the "gulpplugin" and "gulpfriendly" keywords - can be browsed and searched on the plugin search page. https://gulpjs.com/plugins/

Each plugin should only do a small amount of work, so you can connect them like building blocks. You may need to combine a bunch of them to get the desired result.

const { src, dest } = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

exports.default = function() {
  return src('src/*.js')
    // The gulp-uglify plugin won't update the filename
    .pipe(uglify())
    // So use gulp-rename to change the extension
    .pipe(rename({ extname: '.min.js' }))
    .pipe(dest('output/'));
}

Not everything in gulp should use plugins. They are a quick way to get started, but many operations are improved by using a module or library instead.

const { rollup } = require('rollup');

// Rollup's promise API works great in an `async` task
exports.default = async function() {
  const bundle = await rollup.rollup({
    input: 'src/index.js'
  });

  return bundle.write({
    file: 'output/bundle.js',
    format: 'iife'
  });
}

Plugins should always transform files. Use a (non-plugin) Node module or library for any other operations.

const del = require('delete');

exports.default = function(cb) {
  // Use the `delete` module directly, instead of using gulp-rimraf
  del(['output/*.js'], cb);
}

Conditional plugins
Since plugin operations shouldn't be file-type-aware, you may need a plugin like gulp-if to transform subsets of files.

const { src, dest } = require('gulp');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');

function isJavaScript(file) {
  // Check if file extension is '.js'
  return file.extname === '.js';
}

exports.default = function() {
  // Include JavaScript and CSS files in a single pipeline
  return src(['src/*.js', 'src/*.css'])
    // Only apply gulp-uglify plugin to JavaScript files
    .pipe(gulpif(isJavaScript, uglify()))
    .pipe(dest('output/'));
}

Inline plugins (ones you write yourself)
Inline plugins are one-off Transform Streams you define inside your gulpfile by writing the desired behavior.

There are two situations where creating an inline plugin is helpful:

Instead of creating and maintaining your own plugin.
Instead of forking a plugin that exists to add a feature you want.
const { src, dest } = require('gulp');
const uglify = require('uglify-js');
const through2 = require('through2');

exports.default = function() {
  return src('src/*.js')
    // Instead of using gulp-uglify, you can create an inline plugin
    .pipe(through2.obj(function(file, _, cb) {
      if (file.isBuffer()) {
        const code = uglify.minify(file.contents.toString())
        file.contents = Buffer.from(code)
      }
      cb(null, file);
    }))
    .pipe(dest('output/'));
}

/* ---------------------------------------------------------------
	WATCHING
-----------------------------------------------------------------*/

The watch() API connects globs to tasks using a file system watcher. It watches for changes to files that match the globs and executes the task when a change occurs. If the task doesn't signal Async Completion, it will never be run a second time.

This API provides built-in delay and queueing based on most-common-use defaults.

const { watch, series } = require('gulp');

function clean(cb) {
  // body omitted
  cb();
}

function javascript(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

// You can use a single task
watch('src/*.css', css);
// Or a composed task
watch('src/*.js', series(clean, javascript));


Warning: avoid synchronous
A watcher's task cannot be synchronous, like tasks registered into the task system. If you pass a sync task, the completion can't be determined and the task won't run again - it is assumed to still be running.

There is no error or warning message provided because the file watcher keeps your Node process running. Since the process doesn't exit, it cannot be determined whether the task is done or just taking a really, really long time to run.

Watched events
By default, the watcher executes tasks whenever a file is created, changed, or deleted. If you need to use different events, you can use the events option when calling watch(). The available events are 'add', 'addDir', 'change', 'unlink', 'unlinkDir', 'ready', 'error'. Additionally 'all' is available, which represents all events other than 'ready' and 'error'.

const { watch } = require('gulp');

// All events will be watched
watch('src/*.js', { events: 'all' }, function(cb) {
  // body omitted
  cb();
});

Initial execution
Upon calling watch(), the tasks won't be executed, instead they'll wait for the first file change.

To execute tasks before the first file change, set the ignoreInitial option to false.

const { watch } = require('gulp');

// The task will be executed upon startup
watch('src/*.js', { ignoreInitial: false }, function(cb) {
  // body omitted
  cb();
});

Delay
Upon file change, a watcher task won't run until a 200ms delay has elapsed. This is to avoid starting a task too early when many files are being changed at once - like find-and-replace.

To adjust the delay duration, set the delay option to a positive integer.

const { watch } = require('gulp');

// The task won't be run until 500ms have elapsed since the first change
watch('src/*.js', { delay: 500 }, function(cb) {
  // body omitted
  cb();
});

/* ---------------------------------------------------------------
	GULP APIs
-----------------------------------------------------------------*/

// *************  VINYL	
Apis use Vinyl metadata objects: https://gulpjs.com/docs/en/api/concepts
https://gulpjs.com/docs/en/api/vinyl
https://gulpjs.com/docs/en/api/vinyl-isvinyl
https://gulpjs.com/docs/en/api/vinyl-iscustomprop

// *************  src() & dest()

const { src, dest } = require('gulp');

function copy() {
  return src('input/*.js')
    .pipe(dest('output/'));
}

exports.copy = copy;


src() Creates a stream for reading Vinyl objects from the file system.

Returns
A stream that can be used at the beginning or in the middle of a pipeline to add files based on the given globs.

more: https://gulpjs.com/docs/en/api/src


dest() Creates a stream for writing Vinyl objects to the file system.

Returns
A stream that can be used in the middle or at the end of a pipeline to create files on the file system. Whenever a Vinyl object is passed through the stream, it writes the contents and other details out to the file system at the given directory. If the Vinyl object has a symlink property, a symbolic link will be created instead of writing the contents. After the file is created, its metadata will be updated to match the Vinyl object.

Whenever a file is created on the file system, the Vinyl object will be modified.

The cwd, base, and path properties will be updated to match the created file.
The stat property will be updated to match the file on the file system.
If the contents property is a stream, it will be reset so it can be read again.

more: https://gulpjs.com/docs/en/api/dest


// *************  symlink() = https://gulpjs.com/docs/en/api/symlink

// *************  lastRun() = https://gulpjs.com/docs/en/api/lastrun (When combined with src(), enables incremental builds to speed up execution times by skipping files that haven't changed since the last successful task completion.)

// *************  series() = https://gulpjs.com/docs/en/api/series (Combines task functions and/or composed operations into larger operations that will be executed one after another, in sequential order. There are no imposed limits on the nesting depth of composed operations using series() and parallel().)

// *************  parallel() = https://gulpjs.com/docs/en/api/parallel (*same as above)

// *************  watch() = https://gulpjs.com/docs/en/api/watch (Allows watching globs and running a task when a change occurs. Tasks are handled uniformly with the rest of the task system.)

const { watch } = require('gulp');

watch(['input/*.js', '!input/something.js'], function(cb) {
  // body omitted
  cb();
});


// *************  task() = https://gulpjs.com/docs/en/api/task
Reminder: This API isn't the recommended pattern anymore - export your tasks.
Defines a task within the task system. The task can then be accessed from the command line and the series(), parallel(), and lastRun() APIs.

Register a named function as a task:

const { task } = require('gulp');

function build(cb) {
  // body omitted
  cb();
}

task(build);

---
	
Register an anonymous function as a task:

const { task } = require('gulp');

task('build', function(cb) {
  // body omitted
  cb();
});

---
	
Retrieve a task that has been registered previously:

const { task } = require('gulp');

task('build', function(cb) {
  // body omitted
  cb();
});

const build = task('build');

// *************  registry() = https://gulpjs.com/docs/en/api/registry (Allows custom registries to be plugged into the task system, which can provide shared tasks or augmented functionality.)

// *************  tree() = https://gulpjs.com/docs/en/api/tree (Fetches the current task dependency tree - in the rare case that it is needed.)


////////////////////////////////////////////////////////////////////////////////////////////
// playing around tests that worked
////////////////////////////////////////////////////////////////////////////////////////////
const { series, parallel } = require('gulp');
const log = require('fancy-log');
						 
function log1(done){
	log('\n\nhi\n\n');
	done();
}			 
function log2(done){
	log('\n\nthere\n\n');
	done();
}
exports.default = parallel(log1, log2);
