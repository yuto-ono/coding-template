import gulp from 'gulp'
import browserSync from 'browser-sync'
import ejs from 'gulp-ejs'
import rename from 'gulp-rename'
import sass from 'gulp-dart-sass'
import sassGlob from 'gulp-sass-glob-use-forward'
import autoPrefixer from 'gulp-autoprefixer'
import imagemin from 'gulp-imagemin'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import changed from 'gulp-changed'
import shell from 'gulp-shell'
import del from 'del'

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

const isProd = process.env.NODE_ENV === 'production'

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
const ejsTask = cb => gulp.src([ path.src.ejs, path.src.ejsExcept ])
	.pipe( plumber({ errorHandler: notify.onError('<%= error.message %>') }))
	.pipe( ejs() )
	.pipe( rename({ extname: '.html' }))
	.pipe( gulp.dest(path.dest.ejs) )

// CSS
const css = cb => gulp.src(path.src.scss)
	.pipe( plumber({ errorHandler: notify.onError('<%= error.message %>') }))
	.pipe( sassGlob() )
	.pipe( sass({ outputStyle: isProd ? 'compressed' : 'expanded' }))
	.pipe( autoPrefixer() )
	.pipe( gulp.dest( path.dest.css ) )

// JS
const js = shell.task(`rollup -c${ isProd ? ' --environment NODE_ENV:production' : '' }`)

// 画像圧縮
const image = cb => gulp.src(path.src.image)
	.pipe( plumber({ errorHandler: notify.onError('<%= error.message %>') }))
	.pipe( changed(path.dest.image) )
	.pipe( imagemin() )
	.pipe( gulp.dest(path.dest.image) )

// ファイル監視
const watchTask = cb => {
	gulp.watch( path.src.ejs, ejsTask )
	gulp.watch( path.src.scss, css )
	gulp.watch( path.src.js, js )
	gulp.watch( path.src.image, image )
}

// docs削除
const clean = cb => del(path.dest.root + '**/*').then(() => cb)

// ビルド
const build = gulp.series( clean, ejsTask, css, js, image )

// デフォルト（ビルド + サーバー起動 + 監視）
const defaultTask = gulp.series( build, gulp.parallel( serve, watchTask ))

export {
	build,
	clean,
	ejsTask as ejs,
	css,
	js,
	image,
}

export default defaultTask
