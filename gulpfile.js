const gulp = require('gulp');

// Server
const browserSync = require('browser-sync');

// EJS
const ejs = require('gulp-ejs');

// CSS
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const through2 = require('through2');

// JS
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

// imagemin
const imagemin = require('gulp-imagemin');

// Others
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const changed = require('gulp-changed');
const rename = require('gulp-rename');

// パスの設定
const path = {
	root: 'docs/',
	html: 'docs/**/*.html',
	ejsSrc: 'src/ejs/**/*.ejs',
	ejsSrcExcept: '!src/ejs/**/_*.ejs',
	ejsDist: 'docs/',
	scss: 'src/sass/**/*.scss',
	css: 'docs/assets/css',
	jsSrc: 'src/js/',
	jsDist: 'docs/assets/js',
	imageSrc: 'src/img/**/*',
	imageDist: 'docs/assets/img'
}

// 開発中 true, 納品時 false
const isDev = true;


// ローカルサーバー
const serve = cb => {
	browserSync({
		server: { baseDir: path.root },
		ghostMode: false
	});
	cb();
}


// EJS
const ejs_task = cb => gulp.src([ path.ejsSrc, path.ejsSrcExcept ])
	.pipe( plumber({ errorHandler: notify.onError('<%= error.message %>') }) )
	.pipe( ejs() )
	.pipe( rename({ extname: '.html' }))
	.pipe( gulp.dest(path.ejsDist) );


// CSS
const css = cb => gulp.src( path.scss )
	.pipe( plumber({ errorHandler: notify.onError('<%= error.message %>') }) )
	.pipe( sassGlob() )
	.pipe( sass({ outputStyle: isDev ? 'expanded' : 'compressed' }) )
	.pipe( autoprefixer() )
	.pipe( through2.obj( (chunk, enc, callback) => {
		chunk.stat.atime = chunk.stat.mtime = new Date();
		callback(null, chunk);
	}))
	.pipe( gulp.dest( path.css ) )
	.pipe( browserSync.reload({ stream: true }) );


// JS
const js = cb => gulp.src([ 'group1/*.js', 'group2/*.js' ], { cwd: path.jsSrc })
	.pipe( plumber({ errorHandler: notify.onError('<%= error.toString() %>') }) )
	.pipe( concat('common.js') )
	.pipe( uglify({ output: { comments: /^!/i } }) )
	.pipe( gulp.dest(path.jsDist) );


// 画像圧縮
const image = cb => gulp.src( path.imageSrc )
	.pipe( plumber({ errorHandler: notify.onError('<%= error.message %>') }) )
	.pipe( changed(path.imageDist) )
	.pipe( imagemin() )
	.pipe( gulp.dest(path.imageDist) );


// ファイル監視
const watch = cb => {
	gulp.watch( path.ejsSrc, ejs_task ).on('change', browserSync.reload);
	gulp.watch( path.scss, css );
	gulp.watch( path.jsSrc, js ).on('change', browserSync.reload);
	gulp.watch( path.imageSrc, image ).on('change', browserSync.reload);
}


// Public Tasks
exports.all = gulp.series( ejs_task, css, js, image, cb => cb() );
exports.ejs = ejs_task;
exports.css = css;
exports.js = js;
exports.image = image;

exports.default = gulp.parallel( serve, watch );
