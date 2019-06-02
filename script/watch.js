
var hdCookie = "hd";

var player;
var infoPane;
var hdButton;

var playing = true;
var hd;

function initPlayer(onReady) {
	var hdCookieSetting = getCookie(hdCookie);
	hd = (hdCookieSetting ? hdCookieSetting == "on" : true);

    $("#twitch").hide();
    $("#youtube").hide();

	// Prepare JW player
	player = jwplayer("flash");
	player.setup({
		file: "rtmp://de.vacker.tv/autoplay/autoplay",
		width: "100%",
		height: "100%",
		stretching: "uniform"
	})
	.on("ready", function() {
		// Handle the stream info
		var controlBar = $(".jw-controlbar-right-group");
		infoPane = $(".jw-controlbar-center-group");
		updateInfoPane();
		
		// Handle the HD button
		$(".jw-icon-hd").remove();
		controlBar.prepend('<div class="jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-hd' + (currentChannel == "autoplay" ? " jw-hidden" : "") + '">\
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
			$(".jw-title-primary").html('Could not load the player. Please make sure you have <a href="https://get.adobe.com/flashplayer/" target="_blank">Flash player</a> installed.');
			$("#flash").click(function() {
				window.location.href = "https://get.adobe.com/flashplayer/";
			}).css("cursor", "pointer");
		}
	});
};
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
var autoplayInfo;
var liveInfo;
var servers = ["de", "nl", "us"];
var targetServer = 0;
function autoswitch() {
    $.getJSON("http://goalitium.kapsi.fi/dopelives_status3?callback=?", function (data) {
        data = "a Game: Apex Legends https://www.youtube.com/watch?v=dYONccu0PZ8"
        var streamURL = "";
        var service = "";
        var urlIndex = -1;
        if ((urlIndex = data.indexOf("twitch.tv")) > 0) {
            var startURL = Math.max(0,
                data.lastIndexOf(" ", urlIndex) + 1,
                data.lastIndexOf("\n", urlIndex) + 1,
                data.lastIndexOf("(", urlIndex) + 1
            );
            var endURL = Math.min(data.length,
                data.indexOf(" ", urlIndex) == -1 ? data.length : data.indexOf(" ", urlIndex),
                data.indexOf("\n", urlIndex) == -1 ? data.length : data.indexOf("\n", urlIndex),
                data.indexOf(")", urlIndex) == -1 ? data.length : data.indexOf(")", urlIndex)
            );

            streamURL = data.substring(startURL, endURL);
            service = "twitch";
        } else if ((urlIndex = data.indexOf("youtube.com")) > 0 || (urlIndex = data.indexOf("youtu.be")) > 0) {
            var startURL = Math.max(0,
                data.lastIndexOf(" ", urlIndex) + 1,
                data.lastIndexOf("\n", urlIndex) + 1,
                data.lastIndexOf("(", urlIndex) + 1
            );
            var endURL = Math.min(data.length,
                data.indexOf(" ", urlIndex) == -1 ? data.length : data.indexOf(" ", urlIndex),
                data.indexOf("\n", urlIndex) == -1 ? data.length : data.indexOf("\n", urlIndex),
                data.indexOf(")", urlIndex) == -1 ? data.length : data.indexOf(")", urlIndex)
            );

            streamURL = data.substring(startURL, endURL);
            service = "youtube";
        }

        var info = data.split("\n");

        if (streamURL.length > 0 && validURL(streamURL)) {
            if(service == "twitch" && !$("#twitch").is(":visible")) {
                $("#twitch").show();
                $("#youtube").hide();
                $("#youtube").attr("src", "");
                $("#flash").hide();
                
                var urlParts = streamURL.split("/");
                var channelName = urlParts[urlParts.length-1] == "" ? urlParts[urlParts.length-2] : urlParts[urlParts.length-1];

                $("#twitch").attr("src","https://player.twitch.tv/?channel=" + channelName);
            }
            else if(service == "youtube" && !$("#youtube").is(":visible")) {
                $("#twitch").hide();
                $("#twitch").attr("src","");
                $("#youtube").show();
                $("#flash").hide();

                var urlParts = streamURL.split("?v=");
                var channelId = urlParts[urlParts.length - 1];

                $("#youtube").attr("src", "https://www.youtube.com/embed/" + channelId + "?autoplay=1");
            }
        }
        else {
            
            $("#twitch").hide();
            $("#twitch").attr("src","");
            $("#youtube").hide();
            $("#youtube").attr("src", "");
            $("#flash").show();

            var currentServer = servers[targetServer];
            $.ajax({
                type: "GET",
                url: "http://" + currentServer + ".vacker.tv/json.php",
                dataType: "json",
                success: function (data) {
                    targetServer = 0;

                    var channel;
                    var server;
                    var width;
                    var height;

                    if (data.live.live) {
                        channel = (hd ? "live" : "live_low");
                        server = (currentServer == "de" ? (data.live.viewers > 35 ? "nl" : "de") : currentServer);
                        if (hdButton && hdButton.hasClass("jw-hidden")) {
                            hdButton.removeClass("jw-hidden");
                        }

                        if (info.length == 2) {
                            var gameInfo = info[1].split(": ");
                            liveInfo = "[" + info[0] + "] " + gameInfo[1];
                            updateInfoPane();
                        }

                    } else {
                        channel = "autoplay";
                        server = "de";
                        if (hdButton && !hdButton.hasClass("jw-hidden")) {
                            hdButton.addClass("jw-hidden");
                        }

                        $.getJSON("http://vacker.tv/apname?callback=?", function (data) {
                            autoplayInfo = data;
                            updateInfoPane();
                        });
                    }

                    if (channel != currentChannel) {
                        setStream(server, channel);
                    }
                },
                error: function () {
                    targetServer = (targetServer + 1) % servers.length;
                }
            });
        }
    });
}
function setStream(server, channel) {
	currentChannel = channel;
	
	var sources =  [{ 
		file: "rtmp://" + server + ".vacker.tv/" + channel + "/" + channel
	}];
	
	for (var i = 0; i < servers.length; ++i) {
		if (servers[i] != server) {
			sources.push({
				file: "rtmp://" + servers[i] + ".vacker.tv/" + channel + "/" + channel
			});
		}
	}
	
	player.load([{
		sources: sources
	}]);
	
	if (playing) {
		player.play();
	}
	
	updateInfoPane();
}

function updateInfoPane() {
	if (infoPane) {
		var info = (currentChannel == "autoplay" ? "NOT LIVE" + (autoplayInfo ? " - Autoplay: " + autoplayInfo : "") : "LIVE" + (liveInfo ? " - " + liveInfo : ""));
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

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}
