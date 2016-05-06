<?php
	sleep(1);
	require 'config.php';
	// 从数据库获取对应id的所有评论数据
	$_sql = mysql_query("SELECT COUNT(*) AS count FROM comment WHERE titleid='{$_POST['titleid']}'");
	$_result = mysql_fetch_array($_sql, MYSQL_ASSOC);
	// 初始化返回数据条数的上限值_pagesize=2
	$_pagesize = 2;
	// 计算所有评论数量按每次返回最多两条可以返回的次数
	$_count = ceil($_result['count'] / $_pagesize);
	$_page = 1;
	// 前端第一次请求数据没有传递page，则_page赋值为1，则_limit=0，则返回0到_pagesize=2条数据
	// 前端判断评论总数大于2则可以继续请求
	// 第二次请求传递page=2
	// 将前端传递来的page值传递给_page，并与可以返回次数_count比较
	// 如果可以返回次数_count少于等于2次，则将_count赋值给_page，即第二次再返回0-2条评论数据
	// 第三次请求传递page=3
	// 如果可以返回的次数_count不少于2次，则_page=2，
	// 计算$_limit = ($_page - 1) * $_pagesize得到每次返回数据的上下限皆为2，即返回2条数据
	if (!isset($_POST['page'])) {
		$_page = 1;
	} else {
		$_page = $_POST['page'];
		if ($_page > $_count) {
			$_page = $_count;
		}
	}
	
	$_limit = ($_page - 1) * $_pagesize;
	
	
	$query = mysql_query("SELECT ({$_count}) AS count,titleid,comment,user,date FROM comment 
	WHERE titleid='{$_POST['titleid']}' ORDER BY date DESC LIMIT {$_limit},{$_pagesize}") or die('SQL 错误！');
	$json = '';
	
	while (!!$row = mysql_fetch_array($query, MYSQL_ASSOC)) {
		foreach ( $row as $key => $value ) {
			$row[$key] = urlencode(str_replace("\n","", $value));
		}
		$json .= urldecode(json_encode($row)).',';
	}
	
	echo '['.substr($json, 0, strlen($json) - 1).']';
	
	mysql_close();
?>