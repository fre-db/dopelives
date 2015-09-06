﻿<?
if (isset($_COOKIE['chatsize'])) {
	$chatSize = intval($_COOKIE['chatsize']);
	$chatHidden = $chatSize == 0;
} else {
	$chatSize = 500;
	$chatHidden = false;
}
?><!DOCTYPE html>
<html>

	<head>
		<title>Dopefish Lives</title>
		<meta charset="utf-8" /> 
		<link rel="icon" href="/images/favicon.png" sizes="16x16" type="image/png" />

		<link rel="stylesheet" type="text/css" href="/style/font.css" />
		<link rel="stylesheet" type="text/css" href="/style/layout.css" />
		<link rel="stylesheet" type="text/css" href="/style/watch.css" />

		<script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
		<script src="http://code.jquery.com/ui/1.11.4/jquery-ui.min.js" type="text/javascript"></script>
		<link rel="stylesheet" type="text/css" href="http://code.jquery.com/ui/1.11.4/themes/black-tie/jquery-ui.css" />
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
		
		<script src="http://content.jwplatform.com/libraries/i2wbg4Bq.js"></script>
		<script>jwplayer.key="b3eA3XrzNeYTKIscnX3RJQKfYGPDtXzXSoYDVw==";</script>
		
		<script src="/script/functions.js"></script>
		<script src="/script/watch.js"></script>
		<script src="/script/script.js"></script>
		
	</head>

	<body>
		<div id="header"<?= ($chatHidden ? ' class="hidden" style="opacity:0; height:0px;"' : '') ?>>
			<div id="headerlayout">
				<div id="logo"></div>
				
				<div id="title">
					<div id="title_name">Dopefish Lives</div>
					<div id="title_slogan">more gooder then you're moms' stream</div>
				</div>
				
				<div id="menu">
					<a class="menubutton" href="/newfriend.html" target="_blank" style="background-image:url(/images/newfriend.png);">Hello!</a>
					<a class="menubutton" href="http://vacker.tv/ondemand" target="_blank" style="background-image:url(/images/vacker.png);">OnDemand</a>
					<a class="menubutton" href="http://dopefish.freeforums.org/" target="_blank" style="background-image:url(/images/forums.png);">Forums</a>
					<a class="menubutton" href="http://youtube.com/dopelives" target="_blank" style="background-image:url(/images/utubs.png);">YouTube</a>
				</div>
			</div>
		</div>
		<div id="content">
			<div id="video">
				<div id="flash"></div>
			</div>
			<div id="chat"<?= ($chatHidden ? ' class="hidden" style="width:0px; background-color:rgba(61, 167, 60, 0);"' : ' style="width:' . $chatSize . 'px;"') ?>>
				<iframe src="http://webchat.quakenet.org/?channels=dopefish_lives&amp;uio=MTE9MTAz8d" class="fullContentHeight"></iframe>
				<a id="expand" href="javascript:;" onclick="expandStream();"></a>
			</div>
		</div>
	</body>
</html>