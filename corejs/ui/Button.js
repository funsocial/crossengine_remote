this.ui = this.ui || {};

//[full path class body]
Button = view.Display.extend({

    touchArea: null,
    hoverCss: null,
    clickCss: null,
    //when document mouseup unbind,point to this class reference
    btnMouseUp: null,
    isMouseDown: false,

    setting: null,
    clickCallBack: null,

    //使用圖形為按鈕 設定object參數
    //{     imgPath: "btn.png", width: 120, height: 50, 
    //      hoverX: 0, hoverY: -50, clickX: 0, clickY: -100,
    //}
    asImageButton: function (setting) {
        this.setting = setting;
        if (this.touchArea != null) {
            this.touchArea.reset();
            this.touchArea = null;
        }
        touchArea = new core.TouchArea();
        touchArea.setup({
            target: this,
            mouseenter: this.imageButtonCallBack,
            mouseleave: this.imageButtonCallBack,
            mousedown: this.imageButtonCallBack,
            mouseup: this.imageButtonCallBack,
            mouseup_outside: this.imageButtonCallBack,
            click: this.imageButtonCallBack
        });

        $(this.div).css('background', 'url("' + setting.imgPath + '") no-repeat');
        this.setSize(setting.width, setting.height);
        this.setBaseBtnStyle();
    },

    imageButtonCallBack: function (type, e, touchArea) {
        var self = touchArea.target;
        switch (type) {
            case "mouseleave":
                if (!self.isMouseDown) {
                    if (self.setting.hoverTween) {
                        TweenMax.to(self.domDiv, self.setting.hoverTween, {
                            css: { backgroundPosition: "0px 0px" },
                            ease: Power1.easeIn
                        });
                    } else {
                        $(self.div).css("background-position", "0px 0px");
                    }
                }
                break;
            case "mouseenter":
                if (self.setting.hoverTween) {
                    TweenMax.to(self.domDiv, self.setting.hoverTween, {
                        css: { backgroundPosition: self.setting.hoverX + "px " + self.setting.hoverY + "px" },
                        ease: Power1.easeOut
                    });
                } else {
                    $(self.div).css("background-position", self.setting.hoverX + "px " + self.setting.hoverY + "px");
                }
                break;
            case "mousedown":
                self.isMouseDown = true;
                if (self.setting.hoverTween) TweenMax.killTweensOf(self.domDiv);
                $(self.div).css("background-position", self.setting.clickX + "px " + self.setting.clickY + "px");
                break;
            case "click":
                if (self.clickCallBack) self.clickCallBack(type, e, touchArea);
                break;
            case "mouseup_outside":
            case "mouseup":
                self.isMouseDown = false;
                $(self.div).css("background-position", "0px 0px");
                break;
        }
    },

    //設定為改變CSS格式按鈕
    //{     imgPath: "btn.png", width: 120, height: 50, 
    //      normalCss:, hoverCss:0, clickCss:-50
    //}
    asCssButton: function (setting) {
        this.setting = setting;
        if (this.touchArea != null) {
            this.touchArea.reset();
            this.touchArea = null;
        }
        touchArea = new core.TouchArea();
        touchArea.setup({
            target: this,
            mouseenter: this.cssButtonCallBack,
            mouseleave: this.cssButtonCallBack,
            mousedown: this.cssButtonCallBack,
            mouseup: this.cssButtonCallBack,
            mouseup_outside: this.cssButtonCallBack,
            click: this.cssButtonCallBack
        });

        $(this.div).addClass(setting.normalCss);
        this.setSize(setting.width, setting.height);
        this.setBaseBtnStyle();
    },

    cssButtonCallBack: function (type, e, touchArea) {
        var self = touchArea.target;
        switch (type) {
            case "mouseleave":
                if (!self.isMouseDown) {
                    $(self.div).removeClass(self.setting.hoverCss);
                    $(self.div).removeClass(self.setting.downCss);
                }
                break;
            case "mouseenter":
                $(self.div).addClass(self.setting.hoverCss);
                break;
            case "mousedown":
                $(self.div).addClass(self.setting.downCss);
                self.isMouseDown = true;
                break;
            case "click":
                if (self.clickCallBack) self.clickCallBack(type, e, touchArea);
                break;
            case "mouseup_outside":
            case "mouseup":
                $(self.div).removeClass(self.setting.hoverCss);
                $(self.div).removeClass(self.setting.downCss);
                self.isMouseDown = false;
                break;
        }
    },

    setBaseBtnStyle: function () {
        this.setSelectable(false);
        $(this.div).css({ "cursor": "pointer" });
    },

    onClick: function (callBack) {
        $(this.div).on("mousedown", function () {
            callBack();
        });
    }
});

// ---------- [STATIC PROPERTIES] -----------

//assign to namespace
ui.Button = Button;