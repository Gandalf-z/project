
$('#datetimepicker').datetimepicker('show');//article中的日历显示
//work中的瀑布流
$(function() {
    var $container = $('#masonry');
	    $container.imagesLoaded(function() {
	        $container.masonry({
	                itemSelector: '.box',
	                gutter: 20,
	                isAnimated: true,
	            });
	    });
});