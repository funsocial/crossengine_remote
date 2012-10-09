this.ui = this.ui || {};

//[full path class body]
Scroll = view.Display.extend({

    //custom view.Display used in this control
    trackDisplay: null,
    dragButton: null,

    btnW: null,
    btnH: null,
    btnClickX: null, //滑鼠點下按鈕座標 offset拖曳用
    btnClickY: null,
    moveFunction: null,

    trackClickX: null,
    trackClickY: null,
    trackerMouseY: null,
    trackerMouseX: null,
    scrollTrackInterval: 0,
    maxScrollY: null,

    setting: null,
    easing: null,
    
    setup: function(divName, setting){

        this.useDiv(divName);
        this.setSize(setting.width, setting.height);
        this.setting = setting;

        //related div must exist
        if ($(this.div).find(".scrollTrack").val() == undefined) {
            alert("Scroll " + this.name + " does not contain <div class=\"scrollTrack\"> abort~");
            return;
        }
        if ($(this.div).find(".scrollButton").val() == undefined) {
            alert("Scroll " + this.name + " does not contain <div class=\"scrollButton\"> abort~");
            return;
        }

        //create the track & button Display
        var trackDiv = $(this.div).find(".scrollTrack");
        $(trackDiv).attr("id", divName + "Track");
        this.trackDisplay = new view.Display();
        this.trackDisplay.useDiv(trackDiv);
        $(trackDiv).addClass(setting.trackCss);
        this.trackDisplay.setSelectable(false);
        this.trackDisplay.setSize(setting.width, setting.height);
        trace("track? " + trackDiv);

        var buttonDiv = $(this.div).find(".scrollButton");
        $(buttonDiv).attr("id", divName + "Button");
        this.dragButton = new ui.Button();
        this.dragButton.useDiv(buttonDiv);
        $(buttonDiv).addClass(setting.buttonCss);



    },

    setup2222: function (divName, setting) {

        this.useDiv(divName);
        this.setSize(setting.w, setting.h);
        this.setting = setting;

        //related div must exist
        if ($(this.div).find(".scrollTrack").val() == undefined) {
            alert("Scroll " + this.name + " does not contain <div class=\"scrollTrack\"> abort~");
            return;
        }
        if ($(this.div).find(".scrollButton").val() == undefined) {
            alert("Scroll " + this.name + " does not contain <div class=\"scrollButton\"> abort~");
            return;
        }

        //create the track CDisplay, also set its ID
        var trackDiv = $(this.div).find(".scrollTrack");
        $(trackDiv).attr("id", divName + "Track");
        this.trackDisplay = new view.Display();
        this.trackDisplay.useDiv(trackDiv);
        //add style class from project, set the track size
        $(trackDiv).addClass(setting.trackCss);
        this.trackDisplay.setSelectable(false);
        this.trackDisplay.setSize(setting.w, setting.h);

        var buttonDiv = $(this.div).find(".scrollButton");
        $(buttonDiv).attr("id", divName + "Button");
        this.dragButton = new ui.Button();
        this.dragButton.useDiv(buttonDiv);
        $(buttonDiv).addClass(setting.buttonCss);
        if (setting.buttonHoverCss != undefined || setting.buttonClickCss != undefined) {
            this.dragButton.asCssButton(setting.buttonHoverCss, setting.buttonClickCss);
        }
        this.dragButton.setSize(setting.w, 100);
        if (setting.easing) this.easing = setting.easing;

        this.setControlLogic(buttonDiv, trackDiv);

        if (setting.trackClick) {
            this.setTrackClickDirect(trackDiv);
        }

    },

    setControlLogic: function (buttonDiv, trackDiv) {
        var self = this;
        //按鈕按下機制 拖曳
        //--------------------------------------------------------------------------
        $(buttonDiv).bind("mousedown", function (e) {
            DebugView.trace("mousedown div");
            var btnOffset = $(e.currentTarget).offset();
            self.btnClickX = e.pageX - btnOffset.left;
            self.btnClickY = e.pageY - btnOffset.top;
            self.moveFunction = function (e) {
                var parentOffset = $(self.div).offset();
                var relX = e.pageX - parentOffset.left;
                var relY = e.pageY - parentOffset.top - self.btnClickY;
                if (relY < 0) relY = 0;
                DebugView.trace("self " + relY+" : "+self.maxScrollY);
                if (relY > self.maxScrollY) relY = self.maxScrollY;
                DebugView.trace(e.pageX + " , " + e.pageY + " rel: " + relX + " , " + relY + " max? " + self.maxScrollY);
                self.dragButton.move(0, relY);
            }
            self.upFunction = function (e) {
                $(document).unbind("mousemove", self.moveFunction);
                $(document).unbind("mouseup", self.upFunction);
            }
            $(document).bind("mousemove", self.moveFunction);
            $(document).bind("mouseup", self.upFunction);
        });
    },

    //設定drag按鈕固定大小
    fixButtonSize: function (btnw, btnh) {
        this.dragButton.setSize(btnw, btnh);
        this.btnW = btnw;
        this.btnH = btnh;
        this.maxScrollY = Util.cssCaculate(this.height, btnh, "-");
    },

    //設定點選後方track更新位置
    setTrackClickDirect: function (trackDiv) {
        //背後軌道點選機制
        //--------------------------------------------------------------------------
        var self = this;

        $(trackDiv).bind("mousedown", function (e) {

            var parentOffset = $(self.div).offset();
            self.trackClickX = e.pageX - parentOffset.left;
            self.trackClickY = e.pageY - parentOffset.top;

            self.scrollTrackInterval = setInterval(function () {
                var moveGap = self.dragButton.height * .25;
                var yto;
                if (self.dragButton.y < self.trackClickY) {
                    //gown down
                    yto = self.dragButton.y + moveGap;
                    if ((yto + self.dragButton.height - moveGap) > self.trackClickY) return;
                } else {
                    //going up
                    yto = self.dragButton.y - moveGap;
                    if (yto < (self.trackClickY - moveGap)) return;
                }
                if (yto < 0) yto = 0;
                if (yto > self.maxScrollY) yto = self.maxScrollY;
                self.dragButton.movey(yto);
            }, 100);

            self.trackMouseUpCall = function () {
                $(document).unbind("mouseup", self.trackMouseUpCall);
                clearInterval(self.scrollTrackInterval);
            }

            $(document).bind("mouseup", self.trackMouseUpCall);

        });
    },
});

// ---------- [STATIC PROPERTIES] -----------

//assign to namespace
ui.Scroll = Scroll;