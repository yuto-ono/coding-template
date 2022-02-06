const {
	series,
	parallel,
	src,
	dest,
	watch,
} = require('gulp')

const browserSync = require('browser-sync')
const ejs = require('gulp-ejs')
const sass = require('gulp-sass')(require('sass'))
const sassGlob = require('gulp-sass-glob')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const changed = require('gulp-changed')
const rename = require('gulp-rename')
const shell = require('gulp-shell')

// パスの設定
const path = {
	src: {
		ejs: 'src/ejs/**/*.ejs',
		ejsExcept: '!src/ejs/**/_*.ejs',
		scss: 'src/scss/**/*.scss',
		image: 'src/img/**/*',
		js: 'src/js/**/*',
	},
	dest: {
		root: 'docs/',
		html: 'docs/**/*.html',
		ejs: 'docs/',
		css: 'docs/assets/css',
		image: 'docs/assets/img',
		js: 'docs/assets/js/**/*.js'
	},
}

const isProduction = process.env.NODE_ENV === 'production'


// ローカルサーバー
const serve = cb => {
	browserSync({
		server: { baseDir: path.dest.root },
		ghostMode: false,
		files: [
			path.dest.html,
			path.dest.css + '/**/*.css',
			path.dest.image + '/**/*',
			path.dest.js,
		]
	})
	cb()
}


// EJS
const ejsTask = cb => src([ path.src.ejs, path.src.ejsExcept ])
	.pipe( plumber({ errorHandler: notify.onError('<%= error.message %>') }) )
	.pipe( ejs() )
	.pipe( rename({ extname: '.html' }))
	.pipe( dest(path.dest.ejs) )


// CSS
const css = cb => src( path.src.scss )
	.pipe( plumber({ errorHandler: notify.onError('<%= error.message %>') }) )
	.pipe( sassGlob() )
	.pipe( sass({ outputStyle: isProduction ? 'compressed' : 'expanded' }) )
	.pipe( autoprefixer() )
	.pipe( dest( path.dest.css ) )


// JS
const js = shell.task(
	isProduction
		? 'rollup -c --environment NODE_ENV:production'
		: 'rollup -c'
)

// 画像圧縮
const image = cb => src( path.src.image )
	.pipe( plumber({ errorHandler: notify.onError('<%= error.message %>') }) )
	.pipe( changed(path.dest.image) )
	.pipe( imagemin() )
	.pipe( dest(path.dest.image) )


// ファイル監視
const watchTask = cb => {
	watch( path.src.ejs, ejsTask )
	watch( path.src.scss, css )
	watch( path.src.js, js )
	watch( path.src.image, image )
}

const build = series( ejsTask, css, js, image )


// Public Tasks
exports.build = build
exports.ejs = ejsTask
exports.css = css
exports.js = js
exports.image = image
exports.default = series( build, parallel( serve, watchTask ))
