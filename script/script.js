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
var expandButtonCollapsedClass = 'vjs-expand-collapsed';

var resizing;
var prevWidth;
var expandedToggle = false;

var mainRgb = "61, 167, 60";

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
                chat.css("background-color", "rgba(" + mainRgb + ", " + opacity + ")");
                
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
                expandButton.removeClass(expandButtonCollapsedClass);
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
        var controlBar = $(".vjs-control-bar");
        
        // Handle the expand/shrink button
        controlBar.children(".vjs-fullscreen-control").before('<button class="vjs-popout vjs-control vjs-button" type="button" title="Popout"><span class="vjs-icon-placeholder fa fa-external-link"></span><span class="vjs-control-text" aria-live="polite">Popout</span></button>');
        $(".fa-external-link").click(function() {
            player.pause();
            window.open('watch.php','popout','width=1280,height=720,location=0,menubar=0,scrollbars=0,status=0,toolbar=0,resizable=1');
        });
        
        // Handle the expand/shrink button
        controlBar.append('<button class="vjs-expand vjs-control vjs-button" type="button" title="Toggle chat"><span class="vjs-icon-placeholder fa fa-expand"></span><span class="vjs-control-text" aria-live="polite">Toggle chat</span></button>');
        expandButton = $(".vjs-expand");
        if (chatSize == 0) {
            expandButton.addClass(expandButtonCollapsedClass);
        }
        expandButton.click(function() {
            if (expandButton.hasClass(expandButtonCollapsedClass)) {
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
    if (expandButton) expandButton.addClass(expandButtonCollapsedClass);
    
    prevWidth = 0;
    header.animate({ height: 0, opacity: 0 });
    chat.animate({ width: 0, backgroundColor: "rgba(" + mainRgb + ", 0)" });
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
    if (expandButton) expandButton.removeClass(expandButtonCollapsedClass);
    prevWidth = originalChatWidth;
    
    header.removeClass("hidden");
    chat.removeClass("hidden");
    
    header.animate({ height: 100, opacity: 1 });
    chat.animate({ width: originalChatWidth, backgroundColor: "rgba(" + mainRgb + ", 1)" });
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

function toggleStream() {
    if(expandedToggle) {
        shrinkStream()
        expandedToggle = false
    } else {
        expandStream()
        expandedToggle = true
    }
}

function resizeWindow(manual) {
    if (manual != true && resizing) {
        return;
    }

    fullContentHeights.height(windowFrame.height() - header.outerHeight());
}
