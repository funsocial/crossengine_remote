//namespace
this.ui = this.ui || {};
(function () {

    /**
    * basic scroll behavior UI
    **/
    var CScroll = function () {
    }

    //-------------------------------------------------------------------
    //[--PUBLIC--] Properties | Functions
    //-------------------------------------------------------------------
    var p = CScroll.prototype = new viewjs.CDisplay();

    p.trackDisplay; // from CDisplay
    p.dragButton; // from CButton
    p.btnW;
    p.btnH;
    p.btnClickX;
    p.btnClickY;

    p.trackClickX;
    p.trackClickY;
    p.trackerMouseY;
    p.trackerMouseX;
    p.maxScrollY;

    p.setting = null;
    p.easing = null;

    //scroll control Logic
    p.dragging = false;

    p.buildSetup = function () {

    }

    p.cssDivSetup = function (divName, setting) {

        this.useDiv(divName);
        this.setSize(setting.w, setting.h);
        this.setting = setting;
        //this.fillBackground("#FF0000", setting.w, setting.h);

        if ($(this.div).find(".scrollTrack").val() == undefined) {
            alert("CScroll " + this.name + " does not contain <div class=\"scrollTrack\"> abort~");
            return;
        }
        if ($(this.div).find(".scrollButton").val() == undefined) {
            alert("CScroll " + this.name + " does not contain <div class=\"scrollButton\"> abort~");
            return;
        }

        //create the track CDisplay, also set its ID
        var trackDiv = $(this.div).find(".scrollTrack");
        $(trackDiv).attr("id", divName + "Track");
        this.trackDisplay = new viewjs.CDisplay();
        this.trackDisplay.useDiv(trackDiv);
        //add style class from project, set the track size
        $(trackDiv).addClass(setting.trackCss);
        this.trackDisplay.setSelectable(false);
        this.trackDisplay.setSize(setting.w, setting.h);

        var buttonDiv = $(this.div).find(".scrollButton");
        $(buttonDiv).attr("id", divName + "Button");
        this.dragButton = new ui.CButton();
        this.dragButton.useDiv(buttonDiv);
        this.dragButton.setSelectable(false);
        $(buttonDiv).addClass(setting.buttonCss);
        if (setting.buttonHoverCss != undefined || setting.buttonClickCss != undefined) {
            this.dragButton.asCssButton(setting.buttonHoverCss, setting.buttonClickCss);
        }

        this.btnW = $(buttonDiv).width();
        this.btnH = $(buttonDiv).height();

        if (setting.easing) this.easing = setting.easing;
        this.setControlLogic(buttonDiv, trackDiv);

    }

    p.setControlLogic = function (buttonDiv, trackDiv) {

        var self = this;
        //按鈕按下機制 拖曳
        //--------------------------------------------------------------------------
        $(buttonDiv).on("mousedown", function (e) {

            if (self.easing != null) TweenMax.killTweensOf(self.dragButton);

            //get relative button click position
            var btnOffset = $(e.currentTarget).offset();
            self.btnClickX = e.pageX - btnOffset.left;
            self.btnClickY = e.pageY - btnOffset.top;

            var moveCall = function (e) {
                var parentOffset = $(self.div).offset();
                var relX = e.pageX - parentOffset.left;
                var relY = e.pageY - parentOffset.top - self.btnClickY;
                if (relY < 0) relY = 0;
                if (relY > self.maxScrollY) relY = self.maxScrollY;
                //DebugView.trace(e.pageX + " , " + e.pageY + " rel: " + relX + " , " + relY + " max? " + self.maxScrollY);
                self.dragButton.move(0, relY);
            }

            $("body").on("mousemove", moveCall);

            $("body").on("mouseup", function () {
                //clear the mouse event once scroll finish control 
                DebugView.trace("SELF? " + self.setting);
                //alert(self);
                //if (self.setting.buttonHoverCss != undefined || self.setting.buttonClickCss != undefined) {
                    //self.dragButton.setNormalCss();
                //}
                $("body").off("mouseup", this);
                $("body").off("mousemove", moveCall);
            });
        });

        if (this.easing != null) {
            this.trackTweenLogic(trackDiv);
        } else {
            this.trackClickLogic(trackDiv);
        }
        
    }

    p.trackTweenLogic = function (trackDiv) {
        //背後軌道點選機制 持續更新做標
        //--------------------------------------------------------------------------
        var self = this;
        $(trackDiv).on("mousedown", function (e) {
            var parentOffset = $(self.div).offset();
            var yto = e.pageY - parentOffset.top - (self.dragButton.height * .5);
            if (yto < 0) yto = 0;
            if (yto > self.maxScrollY) yto = self.maxScrollY;
            TweenMax.killTweensOf(self.dragButton);
            self.dragButton.tween(self.easing.time, { y: yto });
        });
    }

    p.trackClickLogic = function (trackDiv) {
        //背後軌道點選機制 持續更新做標
        //--------------------------------------------------------------------------
        var self = this;
        var scrollTrackInt = 0;
        $(trackDiv).on("mousedown", function (e) {

            var parentOffset = $(self.div).offset();
            self.trackerMouseY = e.pageY - parentOffset.top;
            self.trackerMouseX = e.pageX - parentOffset.left;
            self.trackClickX = self.trackerMouseX;
            self.trackClickY = self.trackerMouseY;

            var trackMoveCall = function (e) {
                var parentOffset = $(self.div).offset();
                self.trackerMouseY = e.pageY - parentOffset.top;
                self.trackerMouseX = e.pageX - parentOffset.left;
            }

            $("body").on("mousemove", trackMoveCall);

            scrollTrackInt = setInterval(function () {
                var moveGap = self.dragButton.height * .25;
                var yto;
                if (self.dragButton.y < self.trackClickY) {
                    //gown down
                    yto = self.dragButton.y + moveGap;
                    //DebugView.trace("return call [up] " + yto + " , " + self.trackClickY);
                    if ((yto + self.dragButton.height - moveGap) > self.trackClickY) return;
                } else {
                    //going up
                    yto = self.dragButton.y - moveGap;
                    //DebugView.trace("return call [down] " + yto+" , "+self.trackClickY);
                    if (yto < (self.trackClickY - moveGap)) return;
                }
                if (yto < 0) yto = 0;
                if (yto > self.maxScrollY) yto = self.maxScrollY;
                self.dragButton.movey(yto);
            }, 100);
            $("body").on("mouseup", function () {
                //clear the mouse event once finish click on track
                $("body").off("mouseup", this);
                $("body").off("mousemove", trackMoveCall);
                clearInterval(scrollTrackInt);
            });
        });
    }

    p.fixButtonSize = function (btnw, btnh) {
        this.dragButton.setSize(btnw, btnh);
        this.btnW = btnw;
        this.btnH = btnh;
        this.maxScrollY = Util.cssCaculate(this.height, btnh, "-");
    }

    ui.CScroll = CScroll;

}());
