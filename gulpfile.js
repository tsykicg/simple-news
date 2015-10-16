'use strict';

var gulp     = require('gulp'),
	uglify   = require('gulp-uglify'),
	concat   = require('gulp-concat'),
	plumber  = require('gulp-plumber'),
	ts          = require("gulp-typescript"),
	sourcemaps  = require('gulp-sourcemaps'),
	merge       = require("merge2"),
	browser     = require('browser-sync');

var path = {
	ts: ['./dev/ts/**/*.ts']
};

gulp.task('server', function () {
	browser({
		server: {
			baseDir: './public/'
		}
	});
});

var tsProjects = ts.createProject({
	target: 'ES5',
	removeComments: true,
	sortOutput: true,
	declarationFiles: false,
	noExternalResolve: true
});

gulp.task('ts', function() {
	var tsResult = gulp.src(path.ts)
		.pipe(sourcemaps.init())
		.pipe(ts(tsProjects));

	return merge([
		tsResult.dts.pipe(gulp.dest('./dev/ts/typings')),
		tsResult.js.pipe(gulp.dest('./public/js'))
	]);
});

gulp.task('default', ['server', 'ts'], function () {
	gulp.watch(path.ts, ['ts']);
});
