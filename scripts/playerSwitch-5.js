var channel = "dopelives";
var checkInterval = 5000;
var lookupEnabled = false;
var enabledColor = "#0c3";
var disabledColor = "#f33";
var onAutoplay = true;
var onTwitch = false;
var onHitbox = false;
var onVacker = false;

function init(){
    if(typeof(Storage)!=="undefined" && localStorage.lookupEnabled != null) lookupEnabled = (localStorage.lookupEnabled != "true");
    var autoswitch = location.search.substring(1).split(/=/)[1];
    if (autoswitch != null) lookupEnabled = (autoswitch != "true");
    $(document).ready(function() { checkLive(); toggleEnabled(); });
}

function checkLive(){
  checkHitbox();
	checkVacker();
}

function checkHitbox(){
    if(lookupEnabled){
        var switchDelay = 1;
        $.ajax({
               type: "GET",
               url: "http://vacker.tv/json.php",
               dataType: "json",
               async: true,
               cache: false,
               success: function( data ){
               var live = false;
               
               if ( data.restream.live == true ){ live = true; }
               
               if ( live && onAutoplay ){ switchDelay = 6; setHitbox(); }
               if ( !live && onHitbox ){ switchDelay = 6; setAutoplay(); }
               setTimeout(checkHitbox, switchDelay * checkInterval);
               },
               error: function(error){
               console.log("ERROR");
               setTimeout(checkHitbox, switchDelay * checkInterval);
               }
               })
    }
}

function checkVacker(){
    if(lookupEnabled){
        var switchDelay = 1;
        $.ajax({
               type: "GET",
               url: "http://vacker.tv/json.php",
               dataType: "json",
               async: true,
               cache: false,
               success: function( data ){
               var live = false;
               
               if ( data.live.live == true ){ live = true; }
               
               if ( live && onAutoplay ){ switchDelay = 6; setVacker(); }
               if ( !live && onVacker ){ switchDelay = 6; setAutoplay(); }
               setTimeout(checkVacker, switchDelay * checkInterval);
               },
               error: function(error){
               console.log("ERROR");
               setTimeout(checkVacker, switchDelay * checkInterval);
               }
               })
    }
}

function setHitbox(){
    onAutoplay = false;
    onTwitch = false;
    onHitbox = true;
	onVacker = false;
    document.getElementById('player').src= "hitboxPlayer.html";
}

function setTwitch(){
    onAutoplay = false;
    onTwitch = true;
    onHitbox = false;
	onVacker = false;
    document.getElementById('player').src= "twitchPlayer.html";
}

function setAutoplay(){
    onAutoplay = true;
    onTwitch = false;
    onHitbox = false;
	onVacker = false;
    document.getElementById('player').src= "autoplayPlayer.html";
}

function setVacker(){
    onAutoplay = false;
    onTwitch = false;
    onHitbox = false;
	onVacker = true;
    document.getElementById('player').src= "vackerPlayer.html";
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