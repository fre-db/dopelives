
var chatSizeCookie = "chatsize";
var hdCookie = "hd";

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
