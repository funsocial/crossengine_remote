this.core = this.core || {};
/**********************************************************
**********************************************************/
TouchArea = Class.extend({

    allItemLoaded: null,
    setting: null,
    target: null, //target view.Display物件
    domDiv: null,
    targetName: null,

    //[SCREEN ONLY] --------------------------------------
    //for document reference mouse outside function
    mouseup_outsideFunction: null,
    //for document to check mousemove event
    mousemoveFunction: null,
    mouseAtX: 0,
    mouseAtY: 0,
    dragDown: false,
    oldX: null,
    oldY: null,
    atX: null,
    atY: null,

    //[TOUCH+SCREEN]點下後持續判定座標interval ------------
    checkIntervalVal: null,
    checkIntervalTime: 30,
    lastSwipeTime: 0,

    //[TOUCH ONLY] ---------------------------------------
    touchsAtXY: null, //點下touch座標reference，持續更新
    touchsOldXY: null,


    //single mouse related, no touch screen

    isTouchDevice: ("ontouchstart" in window),

    setup: function (setting) {

        this.setting = setting;
        this.target = setting.target;
        this.targetName = setting.target.name;
        this.domDiv = document.getElementById(this.setting.div);

        if (!this.isTouchDevice) {
            this.normalSetUp();
        } else {
            this.touchSetUp();
        }

    },

    //[無觸控裝置]setup
    normalSetUp: function () {
        var self = this;
        var targetDiv = this.target.div;
        $(targetDiv).on("mouseenter", function (e) {
            if (self.setting.mouseenter) {
                self.setting.mouseenter("mouseenter", e, self); //傳遞 mouseenter 事件
            }
        });

        $(targetDiv).on("mouseleave", function (e) {
            if (self.setting.mouseleave) {
                self.setting.mouseleave("mouseleave", e, self); //傳遞 mouseleave 事件
            }
        });

        $(targetDiv).on("click", function (e) {
            if (self.setting.click) {
                self.setting.click("click", e, self); //傳遞 click 事件
            }
        });

        //document 及 div mouseup --> clear 相關 interval , events
        this.mouseup_outsideFunction = function (e) {
            if (self.setting.mouseup_outside) self.setting.mouseup_outside("mouseup_outside", e, self); //傳遞事件
            self.mouseUpClearLogic();
        }

        $(targetDiv).on("mouseup", function (e) {
            if (self.setting.mouseup) self.setting.mousedown("mouseup", e, self); //傳遞事件
            self.mouseUpClearLogic();
        });

        //點下後 document 滑鼠移動時事件, 拖曳, 滑動 etc
        this.mousemoveFunction = function (e) {
            var localPt = self.target.getLocalXY(e.pageX, e.pageY);
            if (self.setting.mousedrag) self.setting.mousedrag("mousedrag", e, self); //傳遞事件
            self.atX = localPt.x;
            self.atY = localPt.y;
        }

        //mousedown於物件，相關監聽事件及interval fire
        $(targetDiv).on("mousedown", function (e) {

            var localPt = self.target.getLocalXY(e.pageX, e.pageY);

            self.oldX = self.atX = localPt.x;
            self.oldY = self.atY = localPt.y;

            if (self.setting.mousedown) self.setting.mousedown("mousedown", e, self); //傳遞事件
            $(document).on("mouseup", self.mouseup_outsideFunction);

            //記錄滑鼠做標不斷更新，對應滑動觸碰相關事件
            self.checkIntervalVal = setInterval(function () {
                self.screenIntervalUpdate();
            }, self.checkIntervalTime);

            self.dragDown = true;

            $(document).on("mousemove", self.mousemoveFunction);

        });

        $(targetDiv).on("mousemove", function (e) {
            if (self.setting.mousemove) self.setting.mousemove("mousemove", e, self); //傳遞事件
        });
    },
    //[無觸控裝置] mouseup清除document事件
    mouseUpClearLogic: function () {
        $(document).off("mousemove", this.mousemoveFunction);
        $(document).off("mouseup", this.mouseup_outsideFunction);
        clearInterval(this.checkIntervalVal);
    },
    //[無觸控裝置] mousedown 更新相關資訊
    screenIntervalUpdate: function () {
        if (this.setting.swipe) {
            var diffX = Math.abs(this.atX - this.oldX);
            var diffY = Math.abs(this.atY - this.oldY);
            //DebugView.trace("update (" + this.atX + "," + this.atY + ") diff " + diffX + " , " + diffY);
            if (diffX > 40 || diffY > 40) {
                var swipeTime = new Date().getTime();
                if (swipeTime - this.lastSwipeTime > 100) {
                    this.lastSwipeTime = swipeTime;
                    this.setting.swipe("swipe", { diffX: diffX, diffY: diffY }, self); //傳遞事件
                }
            }
        }
        this.oldX = this.atX;
        this.oldY = this.atY;
    },

    //[觸控裝置]setup
    touchSetUp: function () {
        var self = this;
        var targetDiv = this.target.div;
        $(targetDiv).on("touchstart", function (epass) {
            var e = epass.originalEvent;
            if (self.setting.touchstart) {
                self.setting.touchstart("touchstart", e, self); //傳遞 touchstart 事件
            }
            //記錄滑鼠做標不斷更新
            clearInterval(self.checkIntervalVal);
            self.checkIntervalVal = setInterval(function () {
                self.touchIntervalUpdate();
            }, self.checkIntervalTime);
            self.touchsAtXY = e.touches;
            self.touchsOldXY = TouchArea.cloneTouchList(self.touchsAtXY);
        });
        $(targetDiv).on("touchmove", function (epass) {
            //http://developer.apple.com/library/safari/#documentation/UserExperience/Reference/TouchEventClassReference/TouchEvent/TouchEvent.html#//apple_ref/javascript/cl/TouchEvent
            var e = epass.originalEvent;
            if (self.setting.touchmove) {
                self.setting.touchmove("touchmove", e, self); //傳遞 touchmove 事件
            }
            //get rotation or scale
            //e.rotation, e.scale
            e.preventDefault();
            
        });
        $(targetDiv).on("touchend", function (epass) {
            var e = epass.originalEvent;
            if(e.touches.length==0) clearInterval(self.checkIntervalVal);
            if (self.setting.touchend) {
                self.setting.touchend("touchend", e, self); //傳遞 touchend 事件
            }
        });
    },

    touchIntervalUpdate: function () {

        var len = this.touchsAtXY.length;
        
        if (this.setting.touch_interval) {
            this.setting.touch_interval("touch_interval", null, this);
        }

        if (this.setting.swipe) {
            for (var s = 0; s < len; s++) {
                var touch = this.touchsAtXY[s];
                if (this.touchsOldXY[touch.identifier]) {
                    var oldOne = this.touchsOldXY[touch.identifier];
                    var diffX = Math.abs(touch.pageX - oldOne.pageX);
                    var diffY = Math.abs(touch.pageY - oldOne.pageY);
                    if (diffX > 35 || diffY > 35) {
                        var swipeTime = new Date().getTime();
                        if (swipeTime - this.lastSwipeTime > 200) {
                            this.lastSwipeTime = swipeTime;
                            this.setting.swipe("swipe", null, this); //傳遞事件
                            break;
                        }
                    }
                }
            }
        }

        this.touchsOldXY = TouchArea.cloneTouchList(this.touchsAtXY);

    },

    getLocalXYs: function () {
        if (this.touchsAtXY == null) return null;
        var len = this.touchsAtXY.length;
        var localXYs = [];
        for (var s = 0; s < len; s++) {
            var touch = this.touchsAtXY[s];
            localXYs.push(this.target.getLocalXY(touch.pageX, touch.pageY));
        }
        return localXYs;
    },

    //清除所有div事件
    reset: function () {
        this.mouseUpClearLogic();
        var targetDiv = this.target.div;
        $(targetDiv).off("mouseenter mouseleave click mouseup mousemove mousedown");
    },

});

// ---------- [STATIC PROPERTIES] -----------
//[global] 設定
//touchend 事件如果 document在 ontouchmove禁止拖曳螢幕情況下有可能不發生
//問題為 e.preventDefault()，新增touchArea時確認當移動時不被doucment preventDefault事件刪除
TouchArea.disableDocumentDrag = function () {
    document.addEventListener('touchstart', function (e) {
        if (e.target == document.documentElement) {
            e.preventDefault();
        };
    });
}

TouchArea.cloneTouchList = function (source) {
    var copyList = {};
    var len = source.length;
    for (var s = 0; s < len; s++) {
        var touch = source[s];
        var clone = {
            identifier: touch.identifier,
            pageX: touch.pageX,
            pageY: touch.pageY
        };
        copyList[touch.identifier] = clone;
    }
    return copyList;
}

//assign to namespace
core.TouchArea = TouchArea;