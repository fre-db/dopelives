var pumpkinDuration = 2000;
var pumpkinFadeDuration = 750;
var pumpkingMaxWidth = 2298;
var pumpkingMaxHeight = 2048;

$(function() {
	var body = $("body");
	var windowObject = $(window);
	$("#spoopyskeletons img").click(function() {
		var pumpkin = $("<div class=\"pumpkin shake-slow shake-constant\"></div>");
		body.append(pumpkin);
		
		var windowWidth = windowObject.width();
		var windowHeight = windowObject.height();
		var top = Math.random() * windowHeight;
		var left = Math.random() * windowWidth;
		
		pumpkin.css({
			top:top,
			left:left
		});
		
		pumpkin.animate({
			width:pumpkingMaxWidth,
			height:pumpkingMaxHeight,
			top:top - pumpkingMaxWidth / 2,
			left:left - pumpkingMaxHeight / 2
		}, {
			duration:pumpkinDuration,
			queue: false,
			complete:function() {
				pumpkin.remove();
			}
		});
		
		setTimeout(function() {
			pumpkin.animate({
				opacity:0
			}, {
				duration:pumpkinFadeDuration,
				queue: false
			});
		}, pumpkinDuration - pumpkinFadeDuration);
	});
	
	var preload = new Image();
	preload.src = "/images/spooks/pumpkin.png";
});
