﻿
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
    
    var hdCookieSetting = getCookie(hdCookie);
    hd = (hdCookieSetting ? hdCookieSetting == "on" : true);

    // Prepare JW player
    player = jwplayer("flash");
    player.setup({
        file: getStreamUrl(defaultServer, (enableAutoplay ? "autoplay" : "live")),
        sources: sources,
        image: (showError ? "images/nostreams.png" : null),
        width: "100%",
        height: "100%",
        stretching: "uniform",
        liveTimeout: 0
    })
    .on("ready", function() {
        // Handle the stream info
        var controlBar = $(".jw-controlbar-right-group");
        infoPane = $(".jw-controlbar-center-group, .jw-text-live");
        infoPane.show();
        updateInfoPane();
        
        // Handle the HD button
        if (enableHdToggle) {
            $(".jw-icon-hd").remove();
            controlBar.prepend('<div class="jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-hd' + (!isLive ? " jw-hidden" : "") + '">\
                <div id="hd-led" class="fa fa-circle"></div>\
            </div>');
            hdButton = $(".jw-icon-hd");
            if (!hd) {
                hdButton.addClass("jw-off");
            }
            hdButton.mouseenter(function() {
                hdButton.addClass("jw-open");
            });
            hdButton.mouseleave(function() {
                hdButton.removeClass("jw-open");
            });
            hdButton.click(function() {
                if (hdButton.hasClass("jw-off")) {
                    enableHd();
                } else {
                    disableHd();
                }
            });
        }
        
        if (onReady) {
            onReady();
        }
    
        // Start the player
        autoswitch();
        autoswitchInterval = setInterval(function() {
            autoswitch();
        }, 5000);
    })
    .on("play", function() {
        playerError.hide();
        playing = true;
    })
    .on("pause", function() {
        playing = false;
    })
    .on("complete", function() {
        autoswitch();
    })
    .on("setupError", function(error) {
        if (error.message == "Error loading player: No playable sources found") {
            displayPlayerError();
        }
    })
    .on("error", function(error) {
        if (error.message == "Flash plugin failed to load") {
            displayPlayerError();
        } else if (error.code = 232011) {
            initPlayer(jwOnReady, sources, true);
        }
    });
};

function displayPlayerError() {
    playerError.html('Could not start stream.' + (!hls ? ' Either ensure <a href="https://get.adobe.com/flashplayer/" target="_blank">Flash</a> is enabled or <a href="?hls">go to our HTML5 stream</a>.' : ''));
    playerError.show();
    // Need a timeout because JW Player will try to set the error message after the error callback.
    setTimeout(function() {
        $(".jw-title-primary").html('');
    }, 1);
}

function enableHd() {
    hdButton.removeClass("jw-off");
    hd = true;
    autoswitch();
    setCookie(hdCookie, "on");
}
function disableHd() {
    hdButton.addClass("jw-off");
    hd = false;
    autoswitch();
    setCookie(hdCookie, "off");
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
    if (hls) {
        // Can't just load new sources in newer JW Player versions because they went full cash-grab mode
        initPlayer(jwOnReady, sources);
    } else {
        player.load([{
            sources: sources
        }]);
        if (playing) {
            player.play();
        }
    }
    
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
    if (hls) {
        return "https://" + server + ".vacker.tv/" + (server != "uk" ? "hls/" : "") + channel + "/" + (server == "uk" ? "live" : "index") + ".m3u8";
    } else {
        return "rtmp://" + server + ".vacker.tv/" + channel + "/" + channel;
    }
}
