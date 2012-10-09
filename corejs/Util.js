//stupid IE no Array indexof function
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) { return i; }
        }
        return -1;
    }
}

function Util() { };
Util.isIE = function () {
    return (navigator.appName.indexOf("Microsoft") > -1);
}

Util.cssCaculate = function (valueA, valueB, type) {
    if (isNaN(valueA)) {
        valueA = valueA.replace("px", "").replace("%", "");
        valueA = Number(valueA);
    }
    if (isNaN(valueB)) {
        valueB = valueB.replace("px", "").replace("%", "");
        valueB = Number(valueB);
    }
    if (type == "-") return valueA - valueB;
    if (type == "+") return valueA + valueB;
    if (type == "*") return valueA * valueB;
    if (type == "/") return valueA / valueB;
}


Util.getFileNamePart = function (url) {
    var filename = url.substring(url.lastIndexOf('/') + 1);
    //filename = filename.substr(0, filename.lastIndexOf(".")); 
    return filename;
}

Util.getQueryValue = function (name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null) {
        return "";
    } else {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}


// get string value from source with query format
// ex: queryValue("key=value&key2=value2","key2") return value2
Util.getQueryFrom = function(source, key) {
    var sourceArr = source.split("&");
    for(pairKey in sourceArr) {
        var pairs = sourceArr[pairKey];
        //trace("pairs? "+pairs);
        var pairsArr = pairs.split("=");
        if(pairsArr[0] == key) {
            return pairsArr[1];
        }
    }
    return "";
}

