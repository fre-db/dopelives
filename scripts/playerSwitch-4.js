var channel = "dopelives";
var checkInterval = 5000;
var lookupEnabled = false;
var enabledColor = "#0c3";
var disabledColor = "#f33";
var onLivestream = true;
var onTwitch = false;
var onHitbox = false;

function init(){
    if(typeof(Storage)!=="undefined" && localStorage.lookupEnabled != null) lookupEnabled = (localStorage.lookupEnabled != "true");
    var autoswitch = location.search.substring(1).split(/=/)[1];
    if (autoswitch != null) lookupEnabled = (autoswitch != "true");
    $(document).ready(function() { checkLive(); toggleEnabled(); });
}

function checkLive(){
    checkTwitch();
    checkHitbox();
}

function checkTwitch(){
    if(lookupEnabled){
        var switchDelay = 1;
        $.ajax({
               type: "GET",
               url: "https://api.twitch.tv/kraken/streams/" + channel,
               dataType: "jsonp",
               async: true,
               cache: false,
               success: function( data ){
               if (data.stream != null && onLivestream){ switchDelay = 6; setTwitch(); }
               if (data.stream == null && onTwitch){ switchDelay = 6; setLivestream(); }
               setTimeout(checkTwitch, switchDelay * checkInterval);
               },
               error: function(){
               setTimeout(checkTwitch, switchDelay * checkInterval);
               }
               })
    }
}

function checkHitbox(){
    if(lookupEnabled){
        var switchDelay = 1;
        $.ajax({
               type: "GET",
               url: "http://api.hitbox.tv/media",
               dataType: "json",
               async: true,
               cache: false,
               success: function( data ){
               var live = false;
               for ( stream in data.livestream ) {
               if ( data.livestream[stream].channel.user_name == "dopefish" ){ live = true; }
               }
               if ( live && onLivestream ){ switchDelay = 6; setHitbox(); }
               if ( !live && onHitbox ){ switchDelay = 6; setLivestream(); }
               setTimeout(checkHitbox, switchDelay * checkInterval);
               },
               error: function(error){
               console.log("ERROR");
               setTimeout(checkHitbox, switchDelay * checkInterval);
               }
               })
    }
}

function setHitbox(){
    onLivestream = false;
    onTwitch = false;
    onHitbox = true;
    document.getElementById('player').src= "hitboxPlayer.html";
}

function setTwitch(){
    onLivestream = false;
    onTwitch = true;
    onHitbox = false;
    document.getElementById('player').src= "twitchPlayer.html";
}

function setLivestream(){
    onLivestream = true;
    onTwitch = false;
    onHitbox = false;
    document.getElementById('player').src= "livestreamPlayer.html";
}

function toggleEnabled() {
    lookupEnabled = !lookupEnabled;
    if(typeof(Storage)!=="undefined") localStorage.lookupEnabled = lookupEnabled;
    try {
        if(window.opener != null && window.opener.lookupEnabled != lookupEnabled){ window.opener.toggleEnabled()};
    }
    catch (e) {}
    if(lookupEnabled){
        checkLive();
        $("#enableBtn").css('color', enabledColor);
    } else {
        $("#enableBtn").css('color', disabledColor);
    }
}

$(document).ready(init());