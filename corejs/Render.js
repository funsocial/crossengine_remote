//-------------------------------------------------------------------
//global render framecall back
//-------------------------------------------------------------------
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback, element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


//-------------------------------------------------------------------
//GLOBAL STATIC Render 
//-------------------------------------------------------------------
function Render() { };
Render.fps = 30; // 30 frame per second (100/30)
Render.callBack = null;
Render.startTime = null;
Render.lastUpdate = null;
Render.currentUpdate = null;
Render.callBacks = [];
Render.callBacksTotal = 0;
Render.running = false;
Render.fpsWatchDiv = null;
Render.addCallBack = function (callBack) {
    if (Render.callBacks.indexOf(callBack) == -1) {
        Render.callBacks.push(callBack);
        Render.callBacksTotal = Render.callBacks.length;
    }
}
Render.removeCallBack = function (callBack) {
    var index = Render.callBacks.indexOf(callBack);
    if (index > -1) {
        Render.callBacks.splice(index, 1);
        Render.callBacksTotal = Render.callBacks.length;
    }
}
Render.start = function () {
    if (Render.running == false) {
        Render.running = true;
        Render.startTime = new Date().getTime();
        Render.lastUpdate = Render.startTime;
        requestAnimFrame(Render.runStep);
    }
}
Render.runStep = function () {
    Render.currentUpdate = new Date().getTime();
    var timeDiff = Render.currentUpdate - Render.lastUpdate;
    //make sure it is running on Right FPS, different browser varies
    if (timeDiff >= Render.fps) {
        if (Render.fpsWatchDiv != null) Render.fpsWatchDiv.update(Render.lastUpdate, Render.currentUpdate);
        Render.lastUpdate = Render.currentUpdate;
        for (var s = 0; s < Render.callBacksTotal; s++) {
            Render.callBacks[s](timeDiff);
        }
    }
    requestAnimFrame(Render.runStep);
}

Render.addFPSWatch = function (parent, x, y) {
    if (Render.fpsWatchDiv == null) {
        Render.fpsWatchDiv = new FPSWatch(parent, x, y);
    }
}
//-------------------------------------------------------------------
//-------------------------------------------------------------------



//-------------------------------------------------------------------
//GLOBAL STATIC FLOAT ABSOLUTE POSITION DEBUG DIV 
//-------------------------------------------------------------------
function DebugView() { };
DebugView.baseZ = 100000;
DebugView.zCount = 0;
DebugView.divIds = [];
DebugView.setUp = function (parent, x, y, w, h, selectable) {
    return DebugView.addDiv(parent, "default", x, y, w, h, selectable);
};

DebugView.addDiv = function (parent, id, x, y, w, h, selectable) {
    var div = document.createElement('div');
    parent.appendChild(div);
    div.setAttribute("id", id);
    DebugView.divIds.push(id);
    $(div).css({
        "background": "#DDDDDD", "position": "absolute", "left": x, "top": y, "width": w + "px", "height": h + "px",
        "overflow": "auto", "font-size": "13px", "color": "#333", "padding": "5px", "z-index": DebugView.baseZ + DebugView.divIds.length,
    });
    if (selectable == false) {
        $(div).css({ "-webkit-user-select": "none", "user-select": "none", "-moz-user-select": "-moz-none", "-ms-user-select": "none" });
    }
    //return offset value for next item to be added easily
    //offset plus padding 10 pixel
    var offsetObj = { l: (x), b: (y + h + 10), r: (x + w), t: (y) };
    return offsetObj;
}
DebugView.addClearBtn = function (parent, x, y) {
    var clearBtn = document.createElement("BUTTON");
    clearBtn.appendChild(document.createTextNode("CLEAR"));
    $(clearBtn).css({
        "position": "absolute", "left": x, "top": y, "z-index:": DebugView.baseZ + 1000, "width": "100px", "height": "40px",
        "color": "#FFF", "background-color": "#333" ,"-webkit-appearance": "none"
    });
    $(clearBtn).on("click", function () {
        for (var s = 0; s < DebugView.divIds.length; s++) {
            var divId = DebugView.divIds[s];
            document.getElementById(divId).innerHTML = "";
        }
    });
    parent.appendChild(clearBtn);
}

DebugView.trace = function (msg, divId) {
    if (divId == null) divId = "default";
    if (document.getElementById(divId)) {
        var oldMsgs = document.getElementById(divId).innerHTML;
        document.getElementById(divId).innerHTML = msg + "<br>" + oldMsgs;
    }
}
DebugView.tracePin = function (msg, divId) {
    if (divId == null) divId = "default";
    if (document.getElementById(divId)) {
        document.getElementById(divId).innerHTML = msg;
    }
}
//quick access function
window.trace = function (msg, divId) {
    DebugView.trace(msg, divId);
}
window.tracePin = function (msg, divId) {
    DebugView.tracePin(msg, divId);
}


//-------------------------------------------------------------------
//-------------------------------------------------------------------


//-------------------------------------------------------------------
//GLOBAL FPS display
//-------------------------------------------------------------------
function FPSWatch(parent, x, y) {
    this.fpsDiv = $("<div>");
    this.fpsDiv.css({
        "display": "block", "position": "absolute", "z-index": "10003", "color": "#dddddd",
        "background-color": "#333333", "width": "62px", "height": "16px", "padding": "3px",
        "font-size": "13px", "font-Family": "Arial", "left": x + "px", "top": y + "px"
    });
    $(parent).append(this.fpsDiv);
    this.update = function (lastUpdate, current) {
        var fpsNum = Math.round(1000 / (current - lastUpdate) * 10) / 10;
        if (fpsNum > 0 && fpsNum < 100) {
            this.fpsDiv.html("FPS: " + fpsNum);
        }
    }

}