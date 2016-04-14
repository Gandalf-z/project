
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

// ajax请求hotlist数据
$(function () {
	var $rootDom = $('.hotList');  // 渲染根节点
    $.ajax({
        url:"http://study.163.com/webDev/hotcouresByCategory.htm",
        data: {},
        method:"GET",
        success: function (data) {
            $hotList = JSON.parse(data);
            var $template = '';
            for (num = 0; num < 10; num++) {
                $template += '<li class="cell">' + render($hotList[num]) + '</li>';
            }
            $rootDom.html($template);
        } 
    });
    // 构造单个热门课程项
    function render (opt) {
        return '<div class="media"><div class="media-left"><img src="' 
        		+ opt.smallPhotoUrl + '" alt="' 
        		+ opt.name + '" class="media-object hotlistpic"></div><div class="media-body"><h6 class="hotlisttit">' 
        		+ opt.name + '</h6><span class="hotlistnum">' 
        		+ opt.learnerCount + '</span></div></div>';
    }
    // 每5秒更新一门课
    setInterval(function fn() {
        $rootDom[0].removeChild($rootDom[0].childNodes[0]);        
        var $liNode = document.createElement('li');
        $liNode.setAttribute('class','cell');
        $liNode.innerHTML = render($hotList[num]);      
        $rootDom[0].appendChild($liNode);
        num == 19 ? num = 0 : num++;
    }, 5000);
});

// ajax请求课程数据
function initCourse(pageNo,psize,ptype) {
	var $rootDom = $('.course');  // 渲染根节点
    $.ajax({
        url:"http://study.163.com/webDev/couresByCategory.htm",
        data: {
        	pageNo: pageNo,
            psize: psize,
            type: ptype
        },
        method:"GET",
        success: function (data) {
            var $result = JSON.parse(data);
            courseRender($result.list, $result.pagination.pageSize);
            //页码导航功能
        	pagination(courseRender, ptype, psize);
            showCourse();
        } 
    });
    function courseRender(arr, num) {
        var courseTemplate = '';
        for (var i = 0; i < num; i++) {
            courseTemplate += segment(arr[i]);
        }
        $rootDom.html(courseTemplate);
    }
    // 单个课程的html模板，包含了课程详细介绍的弹层
    function segment(opt) {
        return '<li class="cell"><div><img src="' + opt.middlePhotoUrl + '"  class="img"></div><div class="tit">'
              + opt.name + '</div><div class="orgName">' + opt.provider + '</div><span class="hot">'
              + opt.learnerCount + '</span><div class="discount">¥ <span>' + opt.price + '</span></div>'
              + '<div class="m-dialog" id="m-dialog"><div class="u-head clearfix"><img src="'
              + opt.middlePhotoUrl + '" id="pic"><div class="u-info"><h3 class="u-tit">'
              + opt.name +'</h3><div class="u-hot"><span class="u-num">'
              + opt.learnerCount +'</span>人在学</div><div class="u-pub">发布者：<span class="u-ori">'
              + opt.provider + '</span></div><div class="u-category">分类：<span class="u-tag">'
              + opt.categoryName + '</span></div></div></div><div class="u-intro">'
              + opt.description + '</div></div></li>';
    };
}
function tabSwitch(size) {
    var $product = $('.product'),
    	$program = $('.program'),
    	data = null;
    // 点击事件
    $product.click(function () {
        if ($program.hasClass('current')) {
            $program.removeClass('current');
            $product.addClass('current');
            initCourse(1, size, 10);
        }
    });
    $program.click(function () {
        if ($product.hasClass('current')) {
            $product.removeClass('current');
            $program.addClass('current');
            initCourse(1, size, 20);
        }
    });
    // 初始&刷新时自动加载产品课程
    initCourse(1, size, 10);
}

// 最重要的：课程内容的总构建
$(function mainContent() {
    var tag = null; // 用来记录当前的每页课程数    
    if (document.body.clientWidth >= 1205) {
        tag = 20;
        tabSwitch(20);
    } else {
        tag = 15;
        tabSwitch(15);
    }
    // 根据窗口大小，做动态的布局改变
    $(window).bind('resize', function () {
        if (tag == 15) {
            if (document.body.clientWidth >= 1205) {
                tag = 20;
                tabSwitch(20);
            }
        } else {
            if (document.body.clientWidth <= 1205) {
                tag = 15;
                tabSwitch(15);
            }
        }
    });
});
// 课程详情浮层
function showCourse() {
     var $courseCell = $('.course .cell');
     for (var i = 0; i < $courseCell.length; i++) {
        $courseCell[i].onmouseenter = function () {
           var $dialog = this.getElementsByClassName('m-dialog')[0];
           $dialog.style.display = 'block';
        };
        $courseCell[i].onmousemove= function () {
           var dialog = this.getElementsByClassName('m-dialog')[0];
           dialog.style.display = 'block';
        };
        $courseCell[i].onmouseout = function () {
           var $dialog = this.getElementsByClassName('m-dialog')[0];
           $dialog.style.display = 'none';
        };
     }
}
function pagination(courseRender, ptype, psize) {
    var $index = 1; // 当前页码
    // 初始化相关dom
    var $paginationList = $('.ele'),
    	$prevBtn = $paginationList[0],
    	$nextBtn = $paginationList[$paginationList.length-1];
    // 页码切换
    function reCourse (n) {
        $.ajax({
        	url : "http://study.163.com/webDev/couresByCategory.htm",
        	data : {
            	pageNo: n,
            	psize: psize,
            	type: ptype
        	},
        	method : "GET",
        	success : function(res) {      
        		var $result1 = JSON.parse(res);
            	courseRender($result1.list, $result1.pagination.pageSize);
            	// 显示课程详情
            	showCourse();
          	}
        });
        // 页码样式变换
        for (var i = 1; i < $paginationList.length-1; i++) {
            $(paginationList[i]).removeClass('on');
        }
        $(paginationList[n]).addClass('on');
    }    
    //上一页、下一页点击事件
    $prevBtn.click(function () {
        if ($index > 1) {
            reCourse(--$index);
            $prevBtn.removeClass("disabled")
        } else {
        	$prevBtn.addClass("disabled")
        }
    });
    $nextBtn.click(function () {
        if ($index < 8) {
            reCourse(++$index);
            $nextBtn.removeClass("disabled")
        } else {
        	$nextBtn.addClass("disabled")
        }
    });
    // 页码数字点击事件
    for (var i = 1; i < $paginationList.length-1; i++) {
        $paginationList[i].id = i;
        $paginationList[i].click(function () {
            $index = this.id;
            reCourse(this.id);
        });
    }
}