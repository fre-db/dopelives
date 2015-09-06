var easterEggTimeout;

var windowFrame;
var header;
var headerLayout;
var fullContentHeights;

var chat;
var chatClient;
var chatHelper;
var chatHandle;
var fadeElements;
var originalChatWidth = 500;

var expandButton;

var resizing;
var prevWidth;

$(function() {
	windowFrame = $(window);
	header = $("#header");
	chat = $("#chat");
	chatClient = chat.children("iframe");
	fadeElements = chatClient.add(header);
	
	chatSize = getCookie(chatSizeCookie);
	if (!chatSize) {
		chatSize = originalChatWidth;
	}
	prevWidth = chatSize;
	
	// Make chat resizable
	$("#chat").resizable({
		handles: "w",
		resize: function(event, ui) {
			var width = ui.size.width;
			
			if (width < 150) {
				var opacity = Math.max(0, width - 50) / 100;
				fadeElements.css("opacity", opacity);
				header.css("height", Math.max(0, width) / 1.5);
				chat.css("background-color", "rgba(61, 167, 60, " + opacity + ")");
				
				resizeWindow(true);
				
			} else if (prevWidth < 150) {
				fadeElements.css("opacity", "");
				header.css("height", "");
				chat.css("background-color", "");
				chatClient.fadeIn();
				
				resizeWindow(true);
			}
			
			chatHandle.css("right", width + "px");
			
			prevWidth = width;
		},
		start: function(event, ui) {
			resizing = true;
			if (prevWidth < 150) {
				expandButton.removeClass("jw-off");
				header.removeClass("hidden");
				chat.removeClass("hidden");
			}
		},
		stop: function(event, ui) {
			resizing = false;
			
			$("iframe, object").css("pointer-events", "");
			
			if (ui.size.width < 150) {
				expandStream();
			} else {
				setCookie(chatSizeCookie, ui.size.width);
			}
		}
	});
	
	// Fix resize handle
	chatHandle = chat.children(".ui-resizable-handle");
	chatHandle.css("right", chatSize + "px");
	chatHandle.addClass("fullContentHeight");
	chatHandle.mousedown(function() {
		// Prevent iframes and Flash from messing with the resizing
		$("iframe, object").css("pointer-events", "none");
	});
	
	initPlayer(function() {
		var controlBar = $(".jw-controlbar-right-group");
		
		// Handle the JW Player size
		var jwAspect = $(".jw-aspect");
		jwAspect.css("paddingTop", "");
		fullContentHeights = fullContentHeights.add(jwAspect);
		
		// Handle the expand/shrink button
		controlBar.children(".jw-icon-fullscreen").before('<div class="jw-icon jw-icon-inline jw-button-color jw-reset fa fa-external-link"></div>');
		$(".fa-external-link").click(function() {
			player.pause();
			window.open('/watch.html','popout','width=1280,height=720,location=0,menubar=0,scrollbars=0,status=0,toolbar=0,resizable=1');
		});
		
		// Handle the expand/shrink button
		controlBar.append('<div class="jw-icon jw-icon-inline jw-button-color jw-reset fa fa-expand"></div>');
		expandButton = $(".fa-expand");
		if (chatSize == 0) {
			expandButton.addClass("jw-off");
		}
		expandButton.click(function() {
			if (expandButton.hasClass("jw-off")) {
				shrinkStream();
			} else {
				expandStream();
			}
		});
		
		resizeWindow();
	});
	
	// Fix layout upon resizing
	fullContentHeights = $(".fullContentHeight");
	windowFrame.resize(resizeWindow);
	resizeWindow();
	
	// Fix Easter egg
	$("#logo").mouseenter(function() {
		easterEggTimeout = setTimeout(function() {
			$("#logo").css("background-image", "url(/images/vayl.png)");
		}, 5000);
	})
	.mouseleave(function() {
		if (easterEggTimeout) {
			clearTimeout(easterEggTimeout);
			easterEggTimeout = null;
		}
	});
});
function expandStream() {
	if (expandButton) expandButton.addClass("jw-off");
	
	prevWidth = 0;
	header.animate({ height: 0, opacity: 0 });
	chat.animate({ width: 0, backgroundColor: "rgba(61, 167, 60, 0)" });
	chatHandle.animate({ right: 0 });
	chatClient.animate({ opacity: 0 }, {
		progress: function() {
			resizeWindow();
		},
		complete: function() {
			header.addClass("hidden");
			chat.addClass("hidden");
			resizeWindow();
		}
	});
	
	setCookie(chatSizeCookie, 0);
}
function shrinkStream() {
	if (expandButton) expandButton.removeClass("jw-off");
	prevWidth = originalChatWidth;
	
	header.removeClass("hidden");
	chat.removeClass("hidden");
	
	header.animate({ height: 100, opacity: 1 });
	chat.animate({ width: originalChatWidth, backgroundColor: "rgba(61, 167, 60, 1)" });
	chatHandle.animate({ right: originalChatWidth });
	chatClient.animate({ opacity: 1 }, {
		progress: function() {
			resizeWindow();
		},
		complete: function() {
			resizeWindow();
		}
	});
	
	setCookie(chatSizeCookie, originalChatWidth);
}

function resizeWindow(manual) {
	if (manual != true && resizing) {
		return;
	}
	
	fullContentHeights.height(windowFrame.height() - header.outerHeight());
}
