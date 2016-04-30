$(function(){
	$('#header .center').hover( function () {
		$(this).addClass("on");
		$('#header .center_ul').slideDown();
	}, function () {
		$(this).removeClass("on");
		$('#header .center_ul').stop().slideUp();
	});
	$('#header .regbtn').on("click",function(){$('#reg').dialog("open")});
	$('#reg').dialog({
		autoOpen : true,
		modal : true,
		resizable : false,
		width : 520,
		buttons : {
			'注册' : function () {
				$(this).submit();
			}
		}
	}).validate({
		submitHandler : function (form) {
			$(form).ajaxSubmit({
				url : 'add.php',
				type : 'POST',
				beforeSubmit : function (formData, jqForm, options) {
					$('#loading').dialog('open');
					$('#reg').dialog('widget').find('button').eq(1).button('disable');
				},
				success : function (responseText, statusText) {
					if (responseText) {
						$('#reg').dialog('widget').find('button').eq(1).button('enable');
						$('#loading').css('background', 'url(img/success.gif) no-repeat 20px center').html('数据新增成功...');
						$.cookie('user', $('#user').val());
						setTimeout(function () {
							$('#loading').dialog('close');
							$('#reg').dialog('close');
							$('#reg').resetForm();
							$('#reg span.star').html('*').removeClass('succ');
							$('#loading').css('background', 'url(img/loading.gif) no-repeat 20px center').html('数据交互中...');
							$('#member, #logout').show();
							$('#reg_a, #login_a').hide();
							$('#member').html($.cookie('user'));
						}, 1000);
					}
				},
			});
		},
	
		showErrors : function (errorMap, errorList) {
			var errors = this.numberOfInvalids();
			
			if (errors > 0) {
				$('#reg').dialog('option', 'height', errors * 20 + 340);
			} else {
				$('#reg').dialog('option', 'height', 340);
			}
			
			this.defaultShowErrors();
		},
		
		highlight : function (element, errorClass) {
			$(element).css('border', '1px solid #630');
			$(element).parent().find('span').html('*').removeClass('succ');
		},
		
		unhighlight : function (element, errorClass) {
			$(element).css('border', '1px solid #ccc');
			$(element).parent().find('span').html('&nbsp;').addClass('succ');
		},
	
		errorLabelContainer : 'ol.reg_error',
		wrapper : 'li',
	
		rules : {
			user : {
				required : true,
				minlength : 2,
				remote : {
					url : 'is_user.php',
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

	$('#loading').dialog({
		autoOpen : false,
		modal : true,
		closeOnEscape : false,
		resizable : false,
		draggable : false,
		width : 180,
		height : 50,
	}).parent().find('.ui-widget-header').hide();

	$('#error').dialog({
		autoOpen : false,
		modal : true,
		closeOnEscape : false,
		resizable : false,
		draggable : false,
		width : 180,
		height : 50,
	}).parent().find('.ui-widget-header').hide();

	$('#birthday').datepicker({
		changeMonth : true,
		changeYear : true,
		yearSuffix : '',
		maxDate : 0,
		yearRange : '1950:2020',

	});
		
	
	$('#email').autocomplete({
		delay : 0,
		autoFocus : true,
		source : function (request, response) {
			//获取用户输入的内容
			//alert(request.term);
			//绑定数据源的
			//response(['aa', 'aaaa', 'aaaaaa', 'bb']);
			
			var hosts = ['qq.com', '163.com', '263.com', 'sina.com.cn','gmail.com', 'hotmail.com'],
				term = request.term,		//获取用户输入的内容
				name = term,				//邮箱的用户名
				host = '',					//邮箱的域名
				ix = term.indexOf('@'),		//@的位置
				result = [];				//最终呈现的邮箱列表
				
				
			result.push(term);
			
			//当有@的时候，重新分别用户名和域名
			if (ix > -1) {
				name = term.slice(0, ix);
				host = term.slice(ix + 1);
			}
			
			if (name) {
				//如果用户已经输入@和后面的域名，
				//那么就找到相关的域名提示，比如bnbbs@1，就提示bnbbs@163.com
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
});
/*
<span class="info info_user">请输入用户名，2~20位，由字母、数字和下划线组成！</span>
          <span class="error error_user">输入不合法，请重新输入！</span>
          <span class="succ succ_user">可用</span>
          <span class="loading">正在检测用户名...</span>
        </dd>

<dd>密　　码： <input type="password" name="pass" class="text" />
          <span class="info info_pass">
            <p>安全级别：<strong class="s s1">■</strong><strong class="s s2">■</strong><strong class="s s3">■</strong> <strong class="s s4" style="font-weight:normal;"></strong></p>
            <p><strong class="q1" style="font-weight:normal;">○</strong> 6-20 个字符</p>
            <p><strong class="q2" style="font-weight:normal;">○</strong> 只能包含大小写字母、数字和非空格字符</p>
            <p><strong class="q3" style="font-weight:normal;">○</strong> 大、小写字母、数字、非空字符，2种以上</p>
          </span>
          <span class="error error_pass">输入不合法，请重新输入！</span>
          <span class="succ succ_pass">可用</span>
        </dd>

        <dd>密码确认： <input type="password" name="notpass" class="text" />
          <span class="info info_notpass">请再一次输入密码！</span>
          <span class="error error_notpass">密码不一致，请重新输入！</span>
          <span class="succ succ_notpass">可用</span>
        </dd>
        <dd><span style="vertical-align:-2px">提　　问：</span> <select name="ques">
                      <option value="0">- - - - 请选择 - - - -</option>
                      <option value="1">- - 您最喜欢吃的菜</option>
                      <option value="2">- - 您的狗狗的名字</option>
                      <option value="3">- - 您的出生地</option>
                      <option value="4">- - 您最喜欢的明星</option>
                      </select>
          <span class="error error_ques">尚未选择提问，请选择！</span>         
        </dd>
        <dd>回　　答： <input type="text" name="ans" class="text" />
          <span class="info info_ans">请输入回答，2~32位！</span>
          <span class="error error_ans">回答不合法，请重新输入！</span>
          <span class="succ succ_ans">可用</span>
        </dd>
        <dd>电子邮件： <input type="text" name="email" class="text" autocomplete="off" />
          <span class="info info_email">请输入电子邮件！</span>
          <span class="error error_email">邮件不合法，请重新输入！</span>
          <span class="succ succ_email">可用</span>
          <ul class="all_email">
            <li><span></span>@qq.com</li>       
            <li><span></span>@163.com</li>
            <li><span></span>@sohu.com</li>
            <li><span></span>@sina.com.cn</li>
            <li><span></span>@gmail.com</li>
          </ul>
        </dd>
        <dd class="birthday"><span style="vertical-align:-2px">生　　日：</span> <select name="year">
                      <option value="0">- 年 -</option>
                      </select> -
                      <select name="month">
                      <option value="0">- 月 -</option>
                      </select> -
                      <select name="day">
                      <option value="0">- 日 -</option>
                      </select>
          <span class="error error_birthday">尚未全部选择，请选择！</span>   
        </dd>
        <dd style="height:105px;"><span style="vertical-align:85px">备　　注：</span> <textarea name="ps"></textarea></dd>     
        <dd style="display:block;" class="ps">还可以输入<strong class="num">200</strong>字</dd> 
        <dd style="display:none;" class="ps">已超过<strong class="num"></strong>字，<span class="clear">清尾</span></dd>   
        <dd style="padding:0 0 0 80px;"><input type="button" name="sub" class="submit" /></dd>