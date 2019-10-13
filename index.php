<?
if (isset($_COOKIE['chatsize'])) {
	$chatSize = intval($_COOKIE['chatsize']);
	$chatHidden = $chatSize == 0;
} else {
	$chatSize = 500;
	$chatHidden = false;
}

$vackerPromo = false;
$spooks = (date('m') == 10);

$hls = isset($_GET['hls']);
?><!DOCTYPE html>
<html>

	<head>
		<title>Dopefish Lives</title>
		<meta charset="utf-8" /> 
		<link rel="icon" href="/images/favicon.png" sizes="16x16" type="image/png" />

		<link rel="stylesheet" type="text/css" href="style/font.css" />
		<link rel="stylesheet" type="text/css" href="style/layout.css" />
		<link rel="stylesheet" type="text/css" href="style/watch.css" />
		<? if ($spooks) { ?>
			<link rel="stylesheet" type="text/css" href="style/spooks.css" />
		<? } ?>

		<script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
		<script src="http://code.jquery.com/ui/1.11.4/jquery-ui.min.js" type="text/javascript"></script>
		<link rel="stylesheet" type="text/css" href="http://code.jquery.com/ui/1.11.4/themes/black-tie/jquery-ui.css" />
		<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
		
		<? if ($hls) { ?>
				<script src="http://content.jwplatform.com/libraries/<?= ($spooks ? '0LjSzsNc' : 'i2wbg4Bq') ?>.js"></script>
		<? } else { ?>
				<script src="script/jwplayer-7.12.13.js"></script>
		<? } ?>
		<script>
				jwplayer.key="b3eA3XrzNeYTKIscnX3RJQKfYGPDtXzXSoYDVw==";
				var hls = <?= $hls ? 'true' : 'false' ?>;
		</script>
		
		<script src="script/functions.js"></script>
		<script src="script/watch.js"></script>
		<script src="script/script.js"></script>
		<? if ($spooks) { ?>
			<script src="script/spooks.js"></script>
			<script type="text/javascript">
				var mainRgb = "204, 0, 0";
			</script>
			<link rel="stylesheet" type="text/css" href="style/shake.css">
		<? } ?>
		
	</head>

	<body>
		<div id="header"<?= ($chatHidden ? ' class="hidden" style="opacity:0; height:0px;"' : '') ?>>
			<div id="headerlayout">
				<div id="logo"></div>
				
				<div id="title">
					<div id="title_name">Dopefish Lives</div>
					<div id="title_slogan"><?= ($spooks ? 'more spookier then you\'re moms\' stream' : 'more gooder then you\'re moms\' stream') ?></div>
				</div>
				<? if ($vackerPromo) { ?>
					<div id="promo">
						<a href="https://www.patreon.com/vackersimon?ty=h" target="_blank">Support Dopelives and<br />become a #BackerOfVacker</a>
					</div>
				<? } ?>
				<? if ($spooks) { ?>
					<div id="spoopyskeletons">
						<img src="images/spooks/spoopyskeletons.png" />
					</div>
				<? } ?>
				<div id="menu">
					<a class="menubutton" href="newfriend.html" target="_blank" style="background-image:url(/images/<?= ($spooks ? 'spooks/' : NULL) ?>newfriend.png);">Hello!</a><?
					?><a class="menubutton" href="https://vacker.tv/ondemand" target="_blank" style="background-image:url(/images/vacker.png);">OnDemand</a><?
					?><a class="menubutton" href="http://dopefish.freeforums.org/" target="_blank" style="background-image:url(/images/forums.png);">Forums</a><?
					?><a class="menubutton" href="http://youtube.com/dopelives" target="_blank" style="background-image:url(/images/utubs.png);">YouTube</a><?
					?><a class="menubutton" href="https://vacker.tv/donate" target="_blank" style="background-image:url(/images/donate.png);">Donate</a>
				</div>
			</div>
		</div>
		<div id="content">
			<div id="playerError"></div>
			<div id="video">
				<div id="flash"></div>
			</div>
			<div id="chat"<?= ($chatHidden ? ' class="hidden" style="width:0px; background-color:rgba(61, 167, 60, 0);"' : ' style="width:' . $chatSize . 'px;"') ?>>
				<iframe src="http://webchat.quakenet.org/?channels=dopefish_lives&amp;uio=<?= ($spooks ? 'MTE9MA4c' : 'MTE9MTAz8d') ?>" class="fullContentHeight"></iframe>
				<a id="expand" href="javascript:;" onclick="expandStream();"></a>
			</div>
		</div>
	</body>
</html>