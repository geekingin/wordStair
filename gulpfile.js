var gulp=require('gulp');

var autoprefixer=require('gulp-autoprefixer');
// console.log();
gulp.task('prefix',function(){






	gulp.src('./public/less/*.css')
		.pipe(autoprefixer({browser:['> 1% in cn'],cascade:true}))
		.pipe(gulp.dest('./public/css/'));
});

gulp.task('default',function(){
	gulp.watch('./public/*',['prefix']);
})