<?php
	require 'config.php';
	
	$query = mysql_query("SELECT title FROM issue WHERE title='{$_POST['issue_title']}'") or die('SQL 错误！');
	
	if (mysql_fetch_array($query, MYSQL_ASSOC)) {
		echo 'false';
	} else {
		echo 'true';
	}
	
	mysql_close();
?>