<?php
	/*
	 文章标题+内容+用户名
	 发布成功首页上出现文章标题
	*/
	
	
	sleep(1);
	require 'config.php';
	
	$query = "INSERT INTO issue (title, content, user, date) VALUES ('{$_POST['issue_title']}', '{$_POST['issue_content']}', '{$_POST['user']}', NOW())";
	
	mysql_query($query) or die('新增失败！'.mysql_error());
	
	echo mysql_affected_rows();
	
	mysql_close();
?>