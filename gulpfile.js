var rulePrefix = '.antd-ns'

var sourcePath = './node_modules/antd/dist/antd.css'
var targetFolder = './build/static/css/'
var targetFile = 'antd-namespaced.min.css'

/****/

var gulp = require('gulp');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var prefixwrap = require('postcss-prefixwrap');
var dom  = require('gulp-dom');

gulp.task('build-namespaced-css', function() {
	return gulp
	.src(sourcePath)
	.pipe(
		postcss([
			prefixwrap(
				rulePrefix,
				{
					ignoredSelectors: [
						':root',
						/^\.ant(.+)$/,
						/^\.slide-(.+)$/,
					]
				}
			),
			// Minify after prefixwrap
			cssnano({ preset: 'default' }),
		])
	)
	.pipe(rename(targetFile))
	.pipe(gulp.dest(targetFolder))
});

gulp.task('modify-html', function() {
	return gulp.src('./build/index.html')
		.pipe(dom(function () {
			var srcs = this.querySelectorAll('[src^="/"], [href^="/"]');
			srcs.forEach(element => {
				var attr = element.getAttribute('src') ? 'src' : 'href';
				element.setAttribute(attr, element[attr].replace('/', ''));
			});
			return this;
		}))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('./build/'));
});

gulp.task('modify-html-fixed', function() {
	return gulp.src('./build/index.html')
		.pipe(dom(function () {
			this.querySelector('link[rel="stylesheet"][href*="main"]').setAttribute('href', 'static/css/antd-namespaced.min.css');
			var srcs = this.querySelectorAll('[src^="/"], [href^="/"]');
			srcs.forEach(element => {
				var attr = element.getAttribute('src') ? 'src' : 'href';
				element.setAttribute(attr, element[attr].replace('/', ''));
			});
			return this;
		}))
		.pipe(rename('index-fixed.html'))
		.pipe(gulp.dest('./build/'));
});