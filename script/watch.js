var player;
var infoPane;
var playerError;
var jwOnReady;

var playing = true;

function initPlayer(onReady, sources, showError) {
    playerError = $("#playerError");
    jwOnReady = onReady;
    
    // Prepare Video.js player
    player = videojs('video');
    player.ready(onReady);
    player.on('error', function(e) {
        var error = player.error();
        if (error.code == 4) {
            displayNotLiveError();
        }
    });
    player.on("play", function(){
        playerError.hide();
    });

    // works, but breaks with code in script.js
    // //player.controlBar.addChild('button', {}, 0) //adds to beginning of controls
    // var toggleSizeButton = player.controlBar.addChild('button');
    // var toggleSizeButtonDom = toggleSizeButton.el();
    // toggleSizeButtonDom.class = 'toggle-size-button';
    // toggleSizeButtonDom.innerHTML = 'Chat';
    // toggleSizeButtonDom.onclick = () => {
    //     toggleStream();
    // }
    player.src({
      type: 'application/x-mpegURL',
      src: getStreamUrl()
    });
    
    // Allow play button to retry stream.
    $('.vjs-play-control').on('click', function(e) {
        if ($('#video').hasClass('vjs-error')) {
            playerError.hide();
            player.load();
        }
    });
};

function displayNotLiveError() {
    displayPlayerError('No one is currently streaming.');
}
function displayPlayerError(message) {
    playerError.html(message);
    playerError.show();
    $('.vjs-error-display').hide();
    
    $('.vjs-control-bar').show();
    $('.vjs-controls-disabled').removeClass('vjs-controls-disabled');
}


var isLive = false;
var liveInfo;
function autoswitch() {
    $.ajax({
        type: "GET",
        // Use DE instead of UK to check status since UK doesn't report it.
        url: "https://de.vacker.tv/json.php",
        dataType: "json",
        success: function(data) {
            isLive = data.live.live;
            
            if (isLive) {
                $.ajax({
                    type: "GET",
                    url: "https://goalitium.kapsi.fi/dopelives_status3?callback=?",
                    dataType: "jsonp",
                    crossDomain: true,
                    success: function(data) {
                        var info = data.split("\n");
                        if (info.length == 2) {
                            var gameInfo = info[1].split(": ");
                            liveInfo = "[" + info[0] + "] " + gameInfo[1];
                            updateInfoPane();
                        }
                    }
                });
            } else {
                updateInfoPane();
            }
            
            setStream();
        }
    });
}

function updateInfoPane() {
    if (infoPane) {
        var info = (!isLive ? "NOT LIVE" : "LIVE" + (liveInfo ? " - " + liveInfo : ""));
        if (infoPane.html() != info) {
            infoPane.html(info);
        }
    }
}

function setCookie(name, value) {
    document.cookie = name + "=" + value + "; expires=" + new Date(new Date().getTime() + 356*24*60*60*1000).toUTCString();
}

function getCookie(name) {
    var name = name + "=";
    var cookies = document.cookie.split(';');
    for(var i = 0; i < cookies.length; ++i) {
        var cookie = cookies[i].replace(/^ +/, "");
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length);
        }
    }
    return "";
}

function getStreamUrl() {
    return "https://uk.vacker.tv/live/live.m3u8";
}
