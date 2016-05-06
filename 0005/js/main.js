 $(function(){
 	// dialog弹窗在浏览器滚动和改变大小时始终自动居中
 	(function(){
 		$(window).on('scroll', center_dialog);
		$(window).on('resize', center_dialog);
		function center_dialog(){
			var dialog = $(".ui-dialog:visible");
			var top = ($(window).innerHeight() - $(dialog).height()) / 2 +$(window).scrollTop();
			var left = ($(window).innerWidth - $(dialog).width()) / 2 + $(window).scrollLeft();
			$(dialog).css("top", top);
			$(dialog).css("left", left);
		}
 	})();
 	// 个人中心
	(function(){
		// 头部个人中心的鼠标滑过滑出效果
		$('#header .center').hover( function () {
			$(this).addClass("on");
			$('#header .center_ul').slideDown();
		}, function () {
			$(this).removeClass("on");
			$('#header .center_ul').stop().slideUp();
		});
	})();
	
	//表单验证
	
	// 注册表单
	(function(){
		// 头部注册按钮点击弹出注册表单
		$('#header .regbtn').on("click",function(){$('#reg').dialog("open")});
		// 注册表单
		$('#reg').dialog({
			autoOpen : false,
			modal : true,
			resizable : false,
			width : 320,
			height : 340,
			buttons : {
				'注册' : function () {
					$(this).submit();
				}
			}
		}).buttonset().validate({	//buttonset设置单选按钮样式，validate验证注册表单
			// 注册表单提交处理函数
			submitHandler : function (form) {
				reg_submit_fuc(form);
			},
			// 错误信息显示处理函数，每产生一个错误信息就将注册表单的高度增加20px
			showErrors : function (errorMap, errorList) {
				var errors = this.numberOfInvalids();			
				if (errors > 0) {
					$('#reg').dialog('option', 'height', errors * 20 + 340);
				} else {
					$('#reg').dialog('option', 'height', 340);
				}			
				this.defaultShowErrors();
			},
			// 高亮显示出错表单项，并重置其后的星号*
			highlight : function (element, errorClass) {
				$(element).css('border', '1px solid red');
				$(element).parent().find('span').html('*').removeClass('succ');
			},
			// 输入正确则去除高亮显示，并替换其后星号*为成功标志
			unhighlight : function (element, errorClass) {
				$(element).css('border', '1px solid #ccc');
				$(element).parent().find('span').html('&nbsp;').addClass('succ');
			},
			// 错误提示信息显示位置设置
			errorLabelContainer : 'ol.reg_error',
			// 错误提示信息容器设置
			wrapper : 'li',
			// 验证规则设置
			rules : {
				user : {
					required : true,
					minlength : 2,
					// 远程验证用户名是否已存在
					remote : {
						url : 'php/has_user.php',
						type : 'POST',
					},
				},
				pass : {
					required : true,
					minlength : 6,
				},
				email : {
					required : true,
					email : true
				},
				date : {
					date : true,
				},
			},
			// 错误提示信息设置
			messages : {
				user : {
					required : '帐号不得为空！',
					minlength : jQuery.format('帐号不得小于{0}位！'),
					remote : '帐号被占用！',
				},
				pass : {
					required : '密码不得为空！',
					minlength : jQuery.format('密码不得小于{0}位！'),
				},
				email : {
					required : '邮箱不得为空！',
					minlength : '请输入正确的邮箱地址！',
				},	
			}
		});
 		function reg_submit_fuc(form){
 			$(form).ajaxSubmit({
					url : 'php/add_user.php',
					type : 'POST',
					// 提交之前，显示loading数据交互中对话框，并禁用注册按钮
					beforeSubmit : function (formData, jqForm, options) {
						$('#loading').dialog('open');
						$('#reg').dialog('widget').find('button').eq(1).button('disable');
					},
					// 提交成功后，恢复注册按钮，显示loading注册成功请登录对话框，并设置cookie，
					// 1秒钟后恢复loading的数据交互中对话框并关闭，重置注册表单并关闭，恢复注册表单后的星号*
					success : function (responseText) {
						if (responseText) {
							$('#reg').dialog('widget').find('button').eq(1).button('enable');
							$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html('注册成功请登录...');
							setTimeout(function () {
								$('#loading').dialog('close');
								$('#reg').dialog('close');
								$('#login').dialog('open');
								$('#reg').resetForm();
								$('#reg span.star').html('*').removeClass('succ');
								$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html('数据交互中...');
							}, 1000);
						}
					},
				});
 		}
		// 生日输入框设置
		$('#date').datepicker({
			changeMonth : true,
			changeYear : true,
			maxDate : 0,
			yearRange : '1950:2020',
			closeText: "关闭", // Display text for close link
			prevText: "上月", // Display text for previous month link
			nextText: "下月", // Display text for next month link
			currentText: "今天", // Display text for current month link
			monthNames: ["一月","二月","三月","四月","五月","六月",
				"七月","八月","九月","十月","十一月","十二月"], // Names of months for drop-down and formatting
			monthNamesShort: ["一月","二月","三月","四月","五月","六月",
				"七月","八月","九月","十月","十一月","十二月"], // For formatting
			dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], // For formatting
			dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"], // For formatting
			dayNamesMin: ["日","一","二","三","四","五","六"], // Column headings for days starting at Sunday
			dateFormat: "yy-mm-dd", // See format options on parseDate
			firstDay: 1, // The first day of the week, Sun = 0, Mon = 1, ...
		});
		// 邮箱的自动补全
		$('#email').autocomplete({
			delay : 0,
			autoFocus : true,
			source : function (request, response) {
				var hosts = ['qq.com', '163.com', '162.com', 'sina.com.cn','gmail.com', 'hotmail.com'],
					term = request.term,		//获取用户输入的内容
					name = term,				//邮箱的用户名
					host = '',					//邮箱的域名
					ix = term.indexOf('@'),		//@的位置
					result = [];				//最终呈现的邮箱列表				
				result.push(term);			
				//当有@的时候，重新分别获得用户名和域名
				if (ix > -1) {
					name = term.slice(0, ix);
					host = term.slice(ix + 1);
				}			
				if (name) {
					//如果用户已经输入@和后面的域名，
					//那么就找到相关的域名提示，比如123@1，就提示123@163.com
					//如果用户还没有输入@或后面的域名，
					//那么就把所有的域名都提示出来				
					var findedHosts = (host ? $.grep(hosts, function (value, index) {
							return value.indexOf(host) > -1
						}) : hosts),
						findedResult = $.map(findedHosts, function (value, index) {
						return name + '@' + value;
					});				
					result = result.concat(findedResult);
				}			
				response(result);
			},	
		});
	})();

	// 登录表单
	(function(){
		// 头部登录按钮点击弹出登陆表单
		$('#header .loginbtn').on("click",function () {
			$('#login').dialog('open');
		});	
		// 登录表单
		$('#login').dialog({
			autoOpen : false,
			modal : true,
			resizable : false,
			width : 320,
			height : 240,
			buttons : {
				'登录' : function () {
					$(this).submit();
				}
			}
		}).validate({	//登录表单验证
			// 登录表单提交处理函数,类似注册表单
			submitHandler : function (form) {
				login_submit_fuc(form);
			},	
			showErrors : function (errorMap, errorList) {
				var errors = this.numberOfInvalids();			
				if (errors > 0) {
					$('#login').dialog('option', 'height', errors * 20 + 240);
				} else {
					$('#login').dialog('option', 'height', 240);
				}			
				this.defaultShowErrors();
			},		
			highlight : function (element, errorClass) {
				$(element).css('border', '1px solid red');
				$(element).parent().find('span').html('*').removeClass('succ');
			},		
			unhighlight : function (element, errorClass) {
				$(element).css('border', '1px solid #ccc');
				$(element).parent().find('span').html('&nbsp;').addClass('succ');
			},	
			errorLabelContainer : 'ol.login_error',
			wrapper : 'li',	
			rules : {
				login_user : {
					required : true,
					minlength : 2,
				},
				login_pass : {
					required : true,
					minlength : 6,
					remote : {
						url : 'php/login.php',
						type : 'POST',
						data : {
							login_user : function () {
								return $('#login_user').val();
							},
						},
					},
				},
			},
			messages : {
				login_user : {
					required : '帐号不得为空！',
					minlength : jQuery.format('帐号不得小于{0}位！'),
				},
				login_pass : {
					required : '密码不得为空！',
					minlength : jQuery.format('密码不得小于{0}位！'),
					remote : '帐号或密码不正确！',
				}
			}
		});
 		function login_submit_fuc(form){
 			$(form).ajaxSubmit({
					url : 'php/login.php',
					type : 'POST',
					beforeSubmit : function (formData, jqForm, options) {
						$('#loading').dialog('open');
						$('#login').dialog('widget').find('button').eq(1).button('disable');
					},
					success : function (responseText, statusText) {
						if (responseText) {
							$('#login').dialog('widget').find('button').eq(1).button('enable');
							$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html('登录成功...');
							if ($('#expires').is(':checked')) {
								$.cookie('user', $('#login_user').val(), {
									expires : 7,
								});
							} else {
								$.cookie('user', $('#login_user').val());
							}
							setTimeout(function () {
								$('#loading').dialog('close');
								$('#login').dialog('close');
								$('#login').resetForm();
								$('#login span.star').html('*').removeClass('succ');
								$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html('数据交互中...');
								$('#header .member, #header .logout').show();
								$('#header .regbtn, #header .loginbtn').hide();
								$('#header .member').html($.cookie('user'));
							}, 1000);
						}
					},
				});
 		}
	})();

	// 发文表单
 	(function(){
 		// 头部发文按钮点击事件,检查是否登陆
	 	// 未登录则提示error对话框,1秒后隐藏error对话框并显示登陆对话框
	 	// 已登录则显示发文对话框
		$('#header .issuebtn').on("click",function () {
			if ($.cookie('user')) {
				$('#issue').dialog('open');
			} else {
				$('#error').dialog('open');
				setTimeout(function () {
					$('#error').dialog('close');
					$('#login').dialog('open');
				}, 1000);
			}
		});
		// 发文表单
		$('#issue').dialog({
			autoOpen : false,
			modal : true,
			resizable : false,
			width : 500,
			height : 360,
			buttons : {
				'发布' : function () {
					issue_submit_fuc();
				}
			}
		}).validate({
			showErrors : function (errorMap, errorList) {
				var errors = this.numberOfInvalids();			
				if (errors > 0) {
					$('#issue').dialog('option', 'height', errors * 20 + 360);
				} else {
					$('#issue').dialog('option', 'height', 360);
				}			
				this.defaultShowErrors();
			},		
			highlight : function (element, errorClass) {
				$(element).css('border', '1px solid red');
				$(element).parent().find('span').html('*').removeClass('succ');
			},		
			unhighlight : function (element, errorClass) {
				$(element).css('border', '1px solid #ccc');
				$(element).parent().find('span').html('&nbsp;').addClass('succ');
			},	
			errorLabelContainer : 'ol.issue_error',
			wrapper : 'li',
			rules : {
				issue_title : {
					required : true,
					minlength : 2,
					remote : {
						url : 'php/has_issue.php',
						type : 'POST',
					},
				},
				issue_content : {
					required : true,
					minlength : 6,				
				},
			},
			messages : {
				issue_title : {
					required : '文章标题不得为空！',
					minlength : jQuery.format('文章标题不得小于{0}位！'),
					remote : '文章标题已存在！',
				},
				issue_content : {
					required : '文章内容不得为空！',
					minlength : jQuery.format('文章内容不得小于{0}位！'),				
				}
			}
		});
 		function issue_submit_fuc(){
 			$(this).ajaxSubmit({
				url : 'php/add_issue.php',
				type : 'POST',
				data : {
					user : $.cookie('user'),
					issue_title : $("#issue_title").val(),
					issue_content : $('#issue .issue_content').val(),
				},
				beforeSubmit : function (formData, jqForm, options) {
					$('#loading').dialog('open');
					$('#issue').dialog('widget').find('button').eq(1).button('disable');
				},
				success : function (responseText, statusText) {
					if (responseText) {
						$('#issue').dialog('widget').find('button').eq(1).button('enable');
						$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html('发布文章成功...');
						setTimeout(function () {
							$('#loading').dialog('close');
							$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html('数据交互中...');
							$('#issue').dialog('close');
							$('#issue').resetForm();
							$('#issue span.star').html('*').removeClass('succ');
						}, 1000);
					}
				},
			});
 		}
 		// $('#issue .issue_content').uEditor();
 	})();
 	
 	// 换肤
 	(function(){
 		//更换皮肤弹窗
		$('#header .skinbtn').on("click",function () {
			$('#skin').dialog('open');
			$('#skin').html('<span class="loading"></span>');
			get_skin();
		});
		$('#skin').dialog({
			autoOpen : false,
			modal : true,
			resizable : false,
			width : 670,
			height : 360,
		});
		// 获取皮肤列表函数
		function get_skin(){
			$.ajax({
				method : 'post',
				url : 'php/get_skin.php',
				data : {
					'type' : 'all'
				},
				success : function (text) {
					var json = JSON.parse(text);
					var html = '';
					for (var i = 0; i < json.length; i ++) {
						html += '<dl><dt><img src="img/' + json[i].small_bg 
						+ '" big_bg="' + json[i].big_bg + '" bg_color="' 
						+ json[i].bg_color + '" alt=""></dt><dd>' 
						+ json[i].bg_text + '</dd></dl>';
					}
					$('#skin').html(html).fadeIn();
					$('#skin dl dt img').on("click",function () {
						var _this = this;
						$(this).ajaxSubmit({
							method : 'post',
							url : 'php/get_skin.php',
							data : {
								'type' : 'set',
								'big_bg' : $(_this).attr('big_bg')
							},
							beforeSubmit : function(){
								$('#loading').dialog('open');
							},
							success : function (text) {
								$('body').css('background', $(_this).attr('bg_color') 
									+ ' ' + 'url(img/' + $(_this).attr('big_bg') + ') repeat-x');
								$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html('皮肤更换成功！');
								setTimeout(function () {
									$('#loading').dialog('close');
									$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html('数据交互中...');
								}, 1000);
							},
							async : false
						});
					});
				}
			});
		}
		//默认显示背景样式
		$.ajax({
			method : 'post',
			url : 'php/get_skin.php',
			data : {
				'type' : 'main'
			},
			success : function (text) {
				var json = JSON.parse(text);
				$('body').css('background', json.bg_color + ' ' + 'url(img/' + json.big_bg + ') repeat-x');
			},
		});
 	})();

 	// error对话框,并隐藏jquery ui的header
	$('#error').dialog({
		autoOpen : false,
		modal : true,
		closeOnEscape : false,
		resizable : false,
		draggable : false,
		width : 180,
		height : 50,
	}).parent().find('.ui-widget-header').hide();

	// loading对话框,并隐藏jquery ui的header
	$('#loading').dialog({
		autoOpen : false,
		modal : true,
		closeOnEscape : false,
		resizable : false,
		draggable : false,
		width : 180,
		height : 50,
	}).parent().find('.ui-widget-header').hide();

	// 默认隐藏用户名和登出按钮
	$('#header .member,#header .logout').hide();

	// 检查cookie user是否存在,若存在则显示用户名和登出按钮,否则不显示
	if ($.cookie('user')) {
		$('#header .member, #header .logout').show();
		$('#header .regbtn, #header .loginbtn').hide();
		$('#header .member').html($.cookie('user'));
	} else {
		$('#header .member, #header .logout').hide();
		$('#header .regbtn, #header .loginbtn').show();
	}
	
	// 登出按钮点击则删除user cookie并重载页面
	$('#header .logout').click(function () {
		$.removeCookie('user');
		window.location.href = '/0005/';
	});
	
	// 导航
	(function(){
		//滑动导航
		var start_on = {
				nav_2:$('#nav .nav_2_on').position().left,
				nav_3:$('#nav .nav_3_on').position().left,
			};
		$('#nav .nav_4 li').on({
			mouseover : function () {
				var hover_on = $(this).first().position();
				$('#nav .nav_2').animate({
					left : hover_on.left + 20,			
				},
				100,
				function(){
					$('#nav .nav_3').animate({
						left : - hover_on.left
					},200);
				});	
			},
			mouseout : function () {
				$('#nav .nav_2').animate({
					left : start_on.nav_2,			
				},
				1,
				function(){
					$('#nav .nav_3').animate({
						left : start_on.nav_3
					},2);
				});
			}
		});
	})();

	// 分享侧边栏
	(function(){
		//分享初始化位置,设置为当前视口高度和share css高度之和的一半再加上滚动条的滚动高度
		$('#share').css('top', $(window).scrollTop() + ($(window).innerHeight() - parseInt($('#share').first().css('height'))) / 2 + 'px');
		// 当页面发生滚动时，每隔0.2秒重置一下分享的位置
		$(window).on('scroll', function () {
			setTimeout(function () {
				$('#share').css('top', $(window).scrollTop() + ($(window).innerHeight() - parseInt($('#share').first().css('height'))) / 2 + 'px');
			}, 200);
		});
		//分享收缩效果
		$('#share').hover(function () {
			$(this).animate({
				left:0
			},200);
		}, function () {
			$(this).stop().animate({
				left:-211
			},200);
		});
	})();

	
});