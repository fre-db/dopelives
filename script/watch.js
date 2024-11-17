
var hdCookie = "hd";
var enableHdToggle = false;
var enableAutoplay = false;
var enableLowQuality = false;

var player;
var infoPane;
var hdButton;
var playerError;
var jwOnReady;

var playing = true;
var hd;

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
      src: getStreamUrl(defaultServer, (enableAutoplay ? "autoplay" : "live"))
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


var currentChannel = "";
var isLive = false;
var autoplayInfo;
var liveInfo;
var defaultServer = "uk";
var servers = ["uk", "de", "nl", "us"];
var targetServer = 0;
function autoswitch() {
    var currentServer = servers[targetServer];
    $.ajax({
        type: "GET",
        url: "https://" + (currentServer != "uk" ? currentServer : "de") + ".vacker.tv/json.php",
        dataType: "json",
        success: function(data) {
            targetServer = 0;
            
            var channel;
            var server;
            var width;
            var height;
            
            isLive = data.live.live;
            if (isLive || !enableAutoplay) {
                channel = (hd || !enableLowQuality ? "live" : "live_low");
                server = currentServer;
                if (hdButton && hdButton.hasClass("jw-hidden")) {
                    hdButton.removeClass("jw-hidden");
                }
                
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
                
            } else {
                channel = "autoplay";
                server = defaultServer;
                if (hdButton && !hdButton.hasClass("jw-hidden")) {
                    hdButton.addClass("jw-hidden");
                }
                
                $.ajax({
                    type: "GET",
                    url: "https://vacker.tv/apname?callback=?",
                    dataType: "jsonp",
                    crossDomain: true,
                    success: function(data) {
                        autoplayInfo = data;
                        updateInfoPane();
                    }
                });
            }
            
            if (channel != currentChannel) {
                setStream(server, channel);
            }
        },
        error: function() {
            targetServer = (targetServer + 1) % servers.length;
        }
    });
}
function setStream(server, channel) {
    currentChannel = channel;
    
    var sources =  [{ 
        file: getStreamUrl(server, channel)
    }];
    
    for (var i = 0; i < servers.length; ++i) {
        if (servers[i] != server) {
            sources.push({
                file: getStreamUrl(servers[i], channel)
            });
        }
    }
    
    setStreamSources(sources);
}
function setStreamUrl(url) {
    var sources =  [{
        file: url
    }];

    setStreamSources(sources);
}
function setStreamSources(sources) {
    // Can't just load new sources in newer JW Player versions because they went full cash-grab mode
    initPlayer(jwOnReady, sources);
    
    updateInfoPane();
}

function updateInfoPane() {
    if (infoPane) {
        var info = (currentChannel == "autoplay" || !isLive ? "NOT LIVE" + (autoplayInfo && enableAutoplay ? " - Autoplay: " + autoplayInfo : "") : "LIVE" + (liveInfo ? " - " + liveInfo : ""));
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

function getStreamUrl(server, channel) {
    return "https://" + server + ".vacker.tv/" + (server != "uk" ? "hls/" : "") + channel + "/" + (server == "uk" ? "live" : "index") + ".m3u8";
}
