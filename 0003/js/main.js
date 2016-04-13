
// 登陆弹窗
$('#login').on('click', function () {
	$('#myloginModal').modal('show');
});
// 轮播
// 设置自动轮播时间
 	$('#myCarousel').carousel({
		interval : 5000,
		pause : 'hover',
	});
// 设置左右切换按钮垂直居中
	$('.carousel-control').css('line-height', $('.carousel-inner img').height() + 'px');
	$(window).resize(function () {
		var $height = $('.carousel-inner img').eq(0).height() || 
					  $('.carousel-inner img').eq(1).height() || 
					  $('.carousel-inner img').eq(2).height();
		$('.carousel-control').css('line-height', $height + 'px');
	});
// 视频弹窗
$('#myvideo').on('click', function () {
	$('#myvideoModal').modal('show');
});
// 关闭弹窗时停止视频播放
// $(function(){
// 	if($("#myvideoModal").is(":visible")==false){
// 		var video = $("#orgvideo");
// 		video.pause();
// 	}
// });