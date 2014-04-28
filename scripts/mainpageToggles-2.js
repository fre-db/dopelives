var playerWidth = 640;
var playerHeight = 550;
var isLarge = false;
var isWide = true;

var odVisible = false;
var chatVisible = false;

function init(){
    if(typeof(Storage)!=="undefined" && localStorage.chatVisible != null) chatVisible = (localStorage.chatVisible != "true");
    if(typeof(Storage)!=="undefined" && localStorage.isWide != null) isWide = (localStorage.isWide != "true");
    $(document).ready(function() {
                      toggleChat();
                      toggleRatio();
                      });
}

function focusIRC(){
    $("#chat")[0].contentWindow.focus();
}

function openPopup(){
    var popoutURL = "pop.html";
    document.getElementById("playerOptions").style.display = "none";
    var currentPlayerElement = document.getElementById("streamDiv").innerHTML;
    var popup = window.open(popoutURL, 'popoutplayer', 'status=0,toolbar=0,location=0,menubar=0,width='+playerWidth+',height='+playerHeight+'');
    popup.moveTo(32,128);
    document.getElementById("streamDiv").innerHTML = '<div id="player" style="border: 3px dashed grey; width: '+playerWidth+'px; height: '+playerHeight+'px;"><div style="margin-left: auto; margin-right: auto; margin-top: 132px; height: 64px; width: 192px; color: grey;">Your stream was here.</div></div>';
    popup.onbeforeunload = function(){
        document.getElementById("streamDiv").innerHTML = currentPlayerElement;
        document.getElementById("playerOptions").style.display = "block";
        return null;
    }
}

function openOnDemand(){
    if(!odVisible){
        $("#odMenu").css("display", "block");
        $("#odMenu").animate({ width: "30%"}, 250 );
        $("#odMenu").css("padding-left", "10px");
        odVisible = true;
    } else {
        $("#odMenu").css("padding-left", "0px");
        $("#odMenu").animate({
                             width: "0%",
                             display: "none"
                             }, 250 );
        odVisible = false;
    }
}

function toggleChat(){
    if(chatVisible){
        $("#chat").css("visibility", "hidden");
        chatVisible = false;
    } else {
        $("#chat").css("visibility", "visible");
        chatVisible = true;
    }
    if(typeof(Storage)!=="undefined") localStorage.chatVisible = chatVisible;
}

var size = {
wide360: {width: 838, height: 550},
wide720: {width: 1280, height: 720},
reg360: {width: 640, height: 550},
reg720: {width: 960, height: 720}
}

function resizeTo(newSize){
    playerWidth = newSize.width;
    playerHeight = newSize.height;
    $("#player").animate({ width: playerWidth}, 250 );
    $("#chat").animate({ width: 1240-playerWidth}, 250 );
}

function toggleSize(){
    if(isLarge){
        if(isWide){
            resizeTo(size.wide360);
        } else {
            resizeTo(size.reg360);
        }
        document.getElementById("sizeBtn").innerHTML = "Large";
        isLarge = false;
    } else {
        if(isWide){
            resizeTo(size.wide720);
        } else {
            resizeTo(size.reg720);
        }
        document.getElementById("sizeBtn").innerHTML = "Small";
        isLarge = true;
    }
    
}

function toggleRatio(){
    if(isLarge){
        if(isWide){
            resizeTo(size.reg720);
            document.getElementById("ratioBtn").innerHTML = "16:9";
            isWide = false;
        } else {
            resizeTo(size.wide720);
            document.getElementById("ratioBtn").innerHTML = "4:3";
            isWide = true;
        }
    } else {
        if(isWide){
            resizeTo(size.reg360);
            document.getElementById("ratioBtn").innerHTML = "16:9";
            isWide = false;
        } else {
            resizeTo(size.wide360);
            document.getElementById("ratioBtn").innerHTML = "4:3";
            isWide = true;
        }
    }
    if(typeof(Storage)!=="undefined") localStorage.isWide = isWide;
}
$(document).ready(init());