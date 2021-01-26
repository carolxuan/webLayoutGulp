var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var ghPages = require('gulp-gh-pages');

sass.compiler = require('node-sass');

// 舊的寫法
// gulp.task('html',function(){
// 	return gulp.src('./app/**/*.html')
// 	 .pipe(gulp.dest('./dist/'));
// })

// 新的寫法
// 1
// function copyHTML(cb){
// 	gulp.src('./app/**/*.html')
// 	.pipe(gulp.dest('./dist/'));
// 	cb();
// }

//2
function copyHTML(){
	return gulp.src('./app/**/*.html')
		.pipe(gulp.dest('./dist/'))
		// 最後加上
		.pipe(
			browserSync.reload({
				stream: true,
			}),
		);
}

function scss(){
	return gulp.src('./app/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write('.')) // 一定要加'.'
		.pipe(gulp.dest('./dist/css'))
		// 最後加上
		.pipe(
			browserSync.reload({
				stream: true,
			}),
		);
}

function browser() {
    browserSync.init({
        server: {
            baseDir: "./dist",
				},
				port: 8080,
    });
}

function deploy(){
	return gulp.src('./dist/**/*')
		.pipe(ghPages());
}

function watch(){
	gulp.watch('./app/**/*.html', gulp.series(copyHTML))
	gulp.watch('./app/scss/**/*.scss', gulp.series(scss))
}

// 同步編譯 終端機要輸入 gulp 編譯
exports.default = gulp.series(copyHTML, scss, gulp.parallel(browser, watch));
exports.build = gulp.series(copyHTML, scss);
exports.deploy = deploy;
// exports.scss = gulp.series(scss);

// 終端機要輸入 gulp copy 編譯
// exports.copy = copyHTML;