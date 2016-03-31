
// 公用函数

// addLoadEvent函数
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			oldonload();
			func();
		}
	}
}

// 封装的ajax方法
var ajax = function () {
    var 
    // 创建一个兼容浏览器各个版本的XMLHttpRequest对象
    xmlHttp = function  () {
        return ('XMLHttpRequest' in window) ? function  () {
                return new XMLHttpRequest();
            } : function  () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    }(),
    formatData= function (abc) {
        var res = '';
        for(var a in abc) {
            res += a+'='+abc[a]+'&';
        }
        return res.slice(0,-1);
    },
    AJAX = function(options) {
        var     
        _this = this,
        req = xmlHttp();
        _this.url = options.url;
        _this.type = options.type || 'responseText';
        _this.method = options.method || 'get';
        _this.async = options.async || true;     
        _this.data = options.data || {};
        _this.complete = options.complete || function  () {};
        _this.success = options.success || function(){};
        _this.error =  options.error || function (f) { alert(_this.url+'->status:'+f+'error!')};
        _this.abort = req.abort;
        _this.setData = function  (data) {
            for(var d in data) {
                _this.data[d] = data[d];
            }
        }
        _this.send = function  () {
            var datastring = formatData(_this.data),
            sendstring,
            get = false,
            async = _this.async,
            complete = _this.complete,
            method = _this.method,
            type=_this.type;
            if(method === 'get') {
                _this.url+='?'+datastring;
                get = true;
            }
            req.open(method,_this.url,async);
            if(method === 'post') {
                req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                sendstring = datastring;
            }      
            //在send之前重置onreadystatechange方法,否则会出现新的同步请求会执行两次成功回调(chrome等在同步请求时也会执行onreadystatechange)
            req.onreadystatechange = async ? function  () {
                // console.log('async true');
                if (req.readyState ==4){
                    complete();
                    if(req.status == 200) {
                        _this.success(req[type]);
                    } else {
                        _this.error(req.status);
                    }                   
                }
            } : null;
            req.send(sendstring);
            if(!async) {
                //console.log('async false');
                complete();
                _this.success(req[type]);
            }
        }
        _this.url && _this.send();        
    };
    return function(options) {return new AJAX(options);}    
}();

// 判断element是否有className
  function hasClass(element, className) {
    var classNameList = element.className.split(/\s+/);
    for (var i = 0; i < classNameList.length; i++) {
      if (classNameList[i] == className) {
          return true;
      }
    }
    return false;
  }
  // 为element增加一个className
  function addClass(element, className) {
    var classList = element.className.split(/\s+/);
    if (!classList[0]) {
      element.className = className;
    } else {
      element.className += ' ' + className;
    }
  };
  // 移除element中的className
  function removeClass(element, className) {
    var classList = element.className.split(/\s+/);
    if (!classList[0]) return;
    for (var i = 0; i < classList.length; i++) {
      if (classList[i] == className) {
        classList.splice(i, 1);
        element.className = classList.join(' ');
      }
    }
  };
// 设置cookie
    function setCookie(name, value, days) {
      var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
      var exp = new Date();
      exp.setTime(exp.getTime() + days*24*60*60*1000);
      cookie += '; expires=' + exp.toGMTString();
      document.cookie = cookie;
    };

    // 获取cookie值
    function getCookie() {
      var cookie = {};
      var all = document.cookie;
      if (all === '') return cookie;
      var list = all.split('; ');
      for (var i = 0, len = list.length; i < len; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
      }
      return cookie;
    };
  //通过class获取节点
  function getElementsByClassName(className){ 
    var classArr = [];
    var tags = document.getElementsByTagName('*');
    for(var item in tags){ 
      if(tags[item].nodeType == 1){ 
        if(tags[item].getAttribute('class') == className){ 
          classArr.push(tags[item]);
        }
      }
    }
    return classArr; //返回
  }

/*
  通知条
*/

//加载页面前检查cookie
function checkCookie() {
  //如果通知条cookie已设置，则不再显示通知条
  if (getCookie().tipCookie) {
    hideTip();
  }
}
window.unbeforeunload = checkCookie();

//添加tipClose点击事件，并添加cookie
function closeTip(){
  var tipClose = document.getElementById("tipClose");  
  tipClose.onclick = function() {
    hideTip();
    setCookie("tipCookie","tipCookieValue",30);
  }
}
addLoadEvent(closeTip);
  // 隐藏通知条tip
  function hideTip() {
    var tip = document.getElementById("tip");
    tip.style.display = "none";
  }


 
/*
  头部
*/

//登陆
function logIn() {
  //添加follow点击事件
  var follow = document.getElementById("follow");//获取follow按钮
  follow.onclick = function() { 
    //先判断登陆的cookie是否已设置
    if (checkLoginCookie()) {
    // 登陆cookie未设置，弹出登陆弹窗
      showLoginPop();
      // 为登陆弹窗的关闭按钮添加点击事件
      var loginClose = document.getElementById("loginClose");
      loginClose.onclick = function() {
        closeLoginPop();
      }
      // 为登陆按钮添加点击事件，并做表单验证,验证成功后ajax提交表单，失败后提示正确输入
      var loginButton = document.getElementById("loginButton");
      //点击事件
      loginButton.onclick = function() {
        //获取用户名和密码
        var userName = document.getElementById("userName"),
            password = document.getElementById("password");
        //验证用户名和密码        
        if (validate(userName.value,"请输入用户名") && validate(password.value,"请输入密码")) {
          if (userName.value == "studyOnline" && password.value == "study.163.com") {
            // //ajax登陆
            ajax({
              url : 'http://study.163.com/webDev/login.htm',
              data : {
                md5userName : md5("studyOnline"),
                md5password : md5("study.163.com")
              },
              method : 'get',
              success : function() {
                setCookie("loginSuc","loginSucValue",30);
                // submitFollow("follow");
                hideFollow();
                showFolowSuc();
                setCookie("followSuc","followSucValue",30);
              },
              error : function() {alert("请重新登陆")}
            })
          } else {alert("请正确填写");}
          
        }
      }      
    } else {
      // 已设置登陆成功cookie，调用关注API，并设置关注成功的cookie（followSuc）
      ajax({
        url : 'http://study.163.com/webDev/login.htm',
        data : {
          md5userName : md5("studyOnline"),
          md5password : md5("study.163.com")
        },
        method : 'get',
        success : function() {
          hideFollow();
          showFolowSuc();
          setCookie("followSuc","followSucValue",30);
        }
      })
    } 
    
  }      
  // js表单验证是否输入用户名和密码必填项
  function validate(field,alerttxt) {
    if (field == null || field == "") {
      alert(alerttxt);
      return false;
    } else {return true;}
  }
  //判断登陆成功的cookie是否已设置
  function checkLoginCookie() {
    //如果登陆cookie已设置，则隐藏关注按钮，显示已关注，并返回false
    if (getCookie().loginSuc) {
      return false;
    } else {
      // 登陆cookie未设置返回true
      return true;
    }
  }
  //显示登陆弹窗
  function showLoginPop() {
    // 弹出登陆界面，并遮罩
    document.getElementById("mask").style.display = "block";
    document.getElementById("login").style.display = "block";
  }
  // 关闭登陆弹窗
  function closeLoginPop() {  
    document.getElementById("mask").style.display = "none";
    document.getElementById("login").style.display = "none";
  }
  //隐藏关注
  function hideFollow() {
    var follow = document.getElementById("follow");
    follow.style.display = "none";
  }
  //显示已关注
  function showFolowSuc() {
    var followSuc = document.getElementById("followSuc");
    followSuc.style.display = "block";
  }
}
addLoadEvent(logIn);





/*
  轮播
*/

function circleImg() {
  var curControl = 0, //当前控制按钮
      bannerArr = getElementsByClassName("bannerList")[0].getElementsByTagName("li"), //图片组
      bannerLen = bannerArr.length,
      controlArr = getElementsByClassName("controlList")[0].getElementsByTagName("li"); //控制组
  // 定时器每5秒自动变换一次
  var autoChange = setInterval(function(){ 
    if(curControl < bannerLen -1){ 
      curControl ++; 
    }else{ 
      curControl = 0;
    }
    //调用变换处理函数
    changeTo(curControl); 
  },5000);
  //调用添加事件处理
  addEvent(); 
  //给控制按钮和鼠标悬浮添加事件处理
  function addEvent(){
    for(var i=0;i<bannerLen;i++){ 
      //闭包防止作用域内活动对象item的影响
      (function(j){ 
        //鼠标点击控制按钮作变换处理
        controlArr[j].onclick = function(){ 
          changeTo(j);
          curControl = j;
        };
      })(i);
      (function(j){ 
        //鼠标悬浮图片上方则清除定时器
        bannerArr[j].onmouseover = function(){ 
          clearTimeout(autoChange);
          curControl = j;
        };
        //鼠标滑出图片则重置定时器
        bannerArr[j].onmouseout = function(){ 
          autoChange = setInterval(function(){ 
            if(curControl < bannerLen -1){ 
              curControl ++;
            }else{ 
              curControl = 0;
            }
            //调用变换处理函数
            changeTo(curControl); 
          },5000);
        };
      })(i);
    }
  }
  //变换处理函数
  function changeTo(num){ 
    //设置banner
    var curBanner = getElementsByClassName("bannerOn")[0];
    fadeOut(curBanner); //淡出当前banner
    removeClass(curBanner,"bannerOn");
    addClass(bannerArr[num],"bannerOn");
    fadeIn(bannerArr[num]); //淡入目标banner
    //设置banner的控制按钮
    var curControlOn = getElementsByClassName("controlOn")[0];
    removeClass(curControlOn,"controlOn");
    addClass(controlArr[num],"controlOn");
  } 
  //设置透明度
  function setOpacity(elem,level){ 
    if(elem.filters){ 
      elem.style.filter = "alpha(opacity="+level+")";
    }else{ 
      elem.style.opacity = level / 100;
    }
  } 
  //淡入处理函数
  function fadeIn(elem){ 
    setOpacity(elem,0); //初始全透明
    for(var i = 0;i<=20;i++){ //透明度改变 20 * 5 = 100
      (function(){ 
        var level = i * 5;  //透明度每次变化值
        setTimeout(function(){ 
          setOpacity(elem, level)
        },i*25); //i * 25 即为每次改变透明度的时间间隔，自行设定
      })(i);     //每次循环变化一次
    }
  } 
  //淡出处理函数
  function fadeOut(elem){ 
    for(var i = 0;i<=20;i++){ //透明度改变 20 * 5 = 100
      (function(){ 
        var level = 100 - i * 5; //透明度每次变化值
        setTimeout(function(){ 
          setOpacity(elem, level)
        },i*25); //i * 25 即为每次改变透明度的时间间隔，自行设定
      })(i);     //每次循环变化一次
    }
  } 
}
addLoadEvent(circleImg);

/*
*内容区
 */


// 右侧内容区

// 机构介绍
function videoPlay() {
  var videoImg = document.getElementById("videoImg");
  videoImg.onclick = function() {
    showVideoPop();
  }
  var videoClose = document.getElementById("videoClose");
  videoClose.onclick = function() {
    hideVideoPop();
  }
  // 弹出视频弹窗
  function showVideoPop() {
    document.getElementById("mask").display = "block";
    document.getElementById("videoPop").display = "block";
  }
  // 点击关闭视频弹窗
  function hideVideoPop() {
    document.getElementById("mask").display = "none";
    document.getElementById("videoPop").display = "none";
  }
}
addLoadEvent(videoPlay);

// 热门推荐
function showHotList() {
  var returnData = null,
      elementLi = '',
      num = 0,
      elementUl = document.getElementById("hotList");
  //ajax请求数据
  // 构造单个热门课程项
  function createNode (opt) {
    return '<img src="' + opt.smallPhotoUrl + '" alt="' + opt.name + '" class="hotListPic"><div><p class="hotListTitle">' + opt.name + '</p><span class="hotListUserCount">' + opt.learnerCount + '</span></div>';
  }
  ajax({
    url : 'http://study.163.com/webDev/hotcouresByCategory.htm',
    data : {},
    method : 'get',
    success : function(res) {      
      returnData = JSON.parse(res);
      for (var i=0; i<10; i++) {
        elementLi += '<li class="hotListLi">' + createNode(returnData[i]) + '</li>';
      }
      elementUl.innerHTML = elementLi;
    }
  });

  // 每5秒更新一门课
  var updateCourse = setInterval(function func() {
      elementUl.removeChild(elementUl.childNodes[0]); 
      var liNode = document.createElement('li');
          liNode.setAttribute('class','hotListLi');
          liNode.innerHTML = createNode(returnData[num]);
      elementUl.appendChild(liNode);
      num == 19 ? num = 0 : num++;
    }, 5000);
}
addLoadEvent(showHotList);



// 左侧内容区

function initCourse(pageNo, psize, ptype) {
    var _this = this;
    var rootDom = document.getElementsByClassName("course");

    // 构造单个课程和课程详细的浮层
    function segment(opt) {
        return '<li class="courseLi"><div class="img"><img src="' + opt.middlePhotoUrl + '"></div><div class="title">'
              + opt.name + '</div><div class="orgName">' + opt.provider + '</div><span class="hot">'
              + opt.learnerCount + '</span><div class="discount">¥ <span>' + opt.price + '</span></div>'
              + '<div class="mDialog"><div class="uHead"><img src="'
              + opt.middlePhotoUrl + '" class="pic"><div class="uInfo"><h3 class="uTit">'
              + opt.name +'</h3><div class="uHot"><span class="uNum">'
              + opt.learnerCount +'</span>人在学</div><div class="uPub">发布者：<span class="uOri">'
              + opt.provider + '</span></div><div class="uCategory">分类：<span class="uTag">'
              + opt.categoryName + '</span></div></div></div><div class="uIntro">'
              + opt.description + '</div></div></li>';
    }

    //将每页课程写入html
    function courseRender(arr, num) {
        var courseTemplate = '';

        for (var i = 0; i < num; i++) {
            courseTemplate += segment(arr[i]);
        }

        rootDom[0].innerHTML = courseTemplate;
    }
    // ajax请求数据
    ajax({
      url : 'http://study.163.com/webDev/couresByCategory.htm',
      data : {
          pageNo: pageNo,
          psize: psize,
          type: ptype
      },
      method : 'get',
      success : function(res) {      
        var result = JSON.parse(res);
        courseRender(result.list, result.pagination.pageSize);
        //页码导航功能
        _this.pagination(result, courseRender, ptype, psize);
        // 显示课程详情
        _this.showCourse();
      }
    });   
}


//页码导航功能
function pagination(data, render, courseType, size) {
    var _this = this;

    var paginationDom = document.getElementsByClassName('pagination'),
        paginationList = null,
        prevBtn = null,
        nextBtn = null,
        index = 1; // 当前页数

    // 页码切换
    function reCourse (n) {
        ajax({
          url : 'http://study.163.com/webDev/couresByCategory.htm',
          data : {
              pageNo: n,
              psize: size,
              type: courseType
          },
          method : 'get',
          success : function(res) {      
            var result = JSON.parse(res);
            render(result.list, result.pagination.pageSize);
            // 显示课程详情
            _this.showCourse();
          }
        });   
        
        // 页码样式
        for (var i = 1; i < paginationList.length-1; i++) {
            removeClass(paginationList[i],'on');
        }
        addClass(paginationList[n], 'on');
    }

    // 初始化相关dom
    paginationList = document.getElementsByClassName('ele');
    prevBtn = paginationList[0];
    nextBtn = paginationList[paginationList.length-1];

    // 初始化页码1的样式
    addClass(paginationList[1], 'on');

    //点击事件
    prevBtn.onclick = function () {
        if (index > 1) {
            reCourse(--index);
        }
    }
    nextBtn.onclick = function () {
        if (index < 8) {
            reCourse(++index);
        }
    }
    for (var i = 1; i < paginationList.length-1; i++) {
        paginationList[i].id = i;
        paginationList[i].onclick = function () {
            index = this.id;
            reCourse(this.id);
        }
    }
}

//显示课程详情
function showCourse() {
     var courseCell = document.getElementsByClassName('courseLi');

     for (var i = 0; i < courseCell.length; i++) {
        courseCell[i].onmouseover = function () {
           var dialog = this.getElementsByClassName('mDialog')[0];
           dialog.style.display = 'block';
        }
        courseCell[i].onmouseout = function () {
           var dialog = this.getElementsByClassName('mDialog')[0];
           dialog.style.display = 'none';
        }
     }
}


// 产品设计和编程语言的切换
function tabSwitch(size) {
    var _this = this,
        productBtn = document.getElementsByClassName('product')[0],
        programBtn = document.getElementsByClassName('program')[0],
        data = null;

    // 点击事件
    productBtn.onclick = function () {
        if (hasClass(programBtn, 'current')) {
            removeClass(programBtn,'current');
            addClass(productBtn,'current');
            _this.initCourse(1, size, 10);
        }
    }
    programBtn.onclick = function () {
        if (hasClass(productBtn, 'current')) {
            removeClass(productBtn,'current');
            addClass(programBtn,'current');
            _this.initCourse(1, size, 20);
        }
    }

    // 初始和刷新时自动加载产品设计
    _this.initCourse(1, size, 10);
}

// 自适应布局
function mainContent() {
    var _this = this,
        tag = null; // 记录当前的每页课程数
    
    if (document.body.clientWidth >= 1205) {
        tag = 20;
        _this.tabSwitch(20);
    } else {
        tag = 15;
        _this.tabSwitch(15);
    }

    // 根据窗口大小，做动态的布局改变
    window.onresize = function () {
        if (tag == 15) {
            if (document.body.clientWidth >= 1205) {
                tag = 20;
                _this.tabSwitch(20);
            }
        } else {
            if (document.body.clientWidth <= 1205) {
                tag = 15;
                _this.tabSwitch(15);
            }
        }
    }
}
addLoadEvent(mainContent);
