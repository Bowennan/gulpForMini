let gulp = require('gulp'); //gulp
let sass = require('gulp-sass'); // scss --> css
let rename = require('gulp-rename'); // fixed the css to wxss
let babel = require('gulp-babel'); // to  es2015
let del = require('del') // clear files in distFile
let runSequence = require('run-sequence') // doing task in order
let pump = require('pump')
let uglify = require('gulp-uglify')
let uglifycss = require('gulp-uglifycss');
let imageMin = require('gulp-imagemin');


gulp.task('image', function() {
	gulp.src('./images/*.*').pipe(imageMin({progressive: true, optimizationLevel: 3})).pipe(gulp.dest('dist/images'))
})

const srcDir = {
	js: './page/**/*.js',
	json: './page/**/*.json',
	scss: './page/**/*.scss',
	wxml: './page/**/*.wxml'
}

const compDir = {
	js: './components/*.js',
	json: './components/*.json',
	scss: './components/*.scss',
	wxml: './components/*.wxml'
}

const globalFile = {
	js: './app.js',
	scss: './app.scss',
	json: './app.json'
}

const destDir = './dist/'
const destComp = './dist/components/'

gulp.task('devbind', () => {
  // return del(['./dist/**'])
  console.log("编译中...")
})

gulp.task('probind', () => {
  // return del(['./dist/**'])
  console.log("线上环境打包......")
})

//以下方法只是导出全局文件

gulp.task('gJs', () => {
	gulp.src(globalFile.js).pipe(babel({presets: ['@babel/env']})).pipe(gulp.dest(destDir))
})

gulp.task('gScss', () => {
	gulp.src(globalFile.scss).pipe(sass().on('error', sass.logError)).pipe(rename({extname: '.wxss'})).pipe(gulp.dest(destDir));
})

gulp.task('gJson', () => {
	gulp.src(globalFile.json).pipe(gulp.dest(destDir))
})

//以下方法是打包单独页面和相关组件的，不参与全局文件的打包和压缩

gulp.task('sass', function () {
     gulp.src(srcDir.scss).pipe(sass().on('error', sass.logError)).pipe(rename({extname: '.wxss'})).pipe(gulp.dest(destDir));
})

gulp.task('prosass', function () {
     gulp.src(srcDir.scss).pipe(sass().on('error', sass.logError)).pipe(uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    })).pipe(rename({extname: '.wxss'})).pipe(gulp.dest(destDir));
})

gulp.task("js", function() {
	gulp.src(srcDir.js).pipe(babel({presets: ['@babel/env']})).pipe(gulp.dest(destDir))
})

gulp.task("projs", function() {
	pump([
           gulp.src(srcDir.js),
           babel({presets: ['@babel/env']}),
           uglify(),
           gulp.dest(destDir)
		])
})

gulp.task("wxml", function() {
	gulp.src(srcDir.wxml).pipe(gulp.dest(destDir))
})


gulp.task("json", function() {
	gulp.src(srcDir.json).pipe(gulp.dest(destDir))
})

//dev中不使用压缩

gulp.task('devcompsass', function () {
     gulp.src(compDir.scss).pipe(sass().on('error', sass.logError)).pipe(rename({extname: '.wxss'})).pipe(gulp.dest(destComp));
})

gulp.task("devcompjs", function() {
	gulp.src(compDir.js).pipe(babel({presets: ['@babel/env']})).pipe(gulp.dest(destComp))
})

//pro中进行代码压缩

gulp.task('procompsass', function () {
     gulp.src(compDir.scss).pipe(sass().on('error', sass.logError)).pipe(uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    })).pipe(rename({extname: '.wxss'})).pipe(gulp.dest(destComp));
})

gulp.task("procompjs", function() {
	pump([
           gulp.src(compDir.js),
           babel({presets: ['@babel/env']}),
           uglify(),
           gulp.dest(destComp)
		])
})

gulp.task("compwxml", function() {
	gulp.src(compDir.wxml).pipe(gulp.dest(destComp))
})


gulp.task("compjson", function() {
	gulp.src(compDir.json).pipe(gulp.dest(destComp))
})

//不同环境的数据请求接口 dev   pro

gulp.task("devurl", function() {
	gulp.src('./urlconfig/dev_url.js').pipe(rename("urlconfig/url.js")).pipe(gulp.dest(destDir))
})

gulp.task("prourl", function() {
	gulp.src('./urlconfig/pro_url.js').pipe(rename("urlconfig/url.js")).pipe(gulp.dest(destDir))
})

gulp.task("dev", ['devbind'], function() {
	runSequence(
		'gJs',
        'gScss',
        'gJson',
        "sass", "js", "wxml", "json",
        'devcompsass',
		'devcompjs',
		'compwxml',
		'compjson',
		'image',
		'devurl'
		)
	console.log("编译成功，监听中...")
	let watcher = gulp.watch([srcDir.scss, srcDir.js, srcDir.wxml, srcDir.json, compDir.scss, compDir.js, compDir.wxml, compDir.json], ["sass", "js", "wxml", "json", 'devcompsass', 'devcompjs', 'compwxml', 'compjson']);
	watcher.on('change', function(event) {
	  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
})


gulp.task("default", ['probind'], function() {
	runSequence(
		'gJs',
        'gScss',
        'gJson',
        "prosass", "projs", "wxml", "json",
        'procompsass',
		'procompjs',
		'compwxml',
		'compjson',
		'image',
		'prourl'
		)
	console.log("打包成功")
})