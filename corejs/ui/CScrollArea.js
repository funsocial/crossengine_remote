//namespace
this.ui = this.ui || {};
(function () {

    /**
    * basic scroll behavior UI
    **/
    var CScrollArea = function () {
    }

    //-------------------------------------------------------------------
    //[--PUBLIC--] Properties | Functions
    //-------------------------------------------------------------------
    var p = CScrollArea.prototype = new viewjs.CDisplay();

    p.setting = null;
    p.easing = null;

    //scroll control Logic
    p.dragging = false;

    p.contentDP;
    p.areaTip;
    p.areaBar;
    p.contentX = 0;
    p.contentY = 0;

    p.clickX = 0;
    p.clickY = 0;
    p.edgeOverXY = 0;
    p.maxX = 0;
    p.maxY = 0;

    p.lastRelX;
    p.lastRelY;
    p.relX;
    p.relY;

    p.tipY = 0;
    p.tipPadding = 0;
    p.tipHeight = 0;

    /*  tipPadding    顯示目前位置 tip area 左右與邊界空白距離
    *   tipY          tipUI Y軸位置
    *   tipHeight     tipbar 高度
    */
    p.setup = function (useDiv, tipPadding, tipY, tipHeight) {

        this.useDiv(useDiv);
       
        if ($(this.div).find(".content").val() == undefined) {
            alert("CScrollArea " + this.name + " does not contain <div class=\"content\"> abort~");
            return;
        }
        if ($(this.div).find(".areaTip").val() == undefined) {
            alert("CScrollArea " + this.name + " does not contain <div class=\"areaTip\"> abort~");
            return;
        }
        if ($(this.div).find(".areaBar").val() == undefined) {
            alert("CScrollArea " + this.name + " does not contain <div class=\"areaBar\"> abort~");
            return;
        }

        this.contentDP = new viewjs.CDisplay();
        this.contentDP.useDiv($(this.div).find(".content"));
        this.addChild(this.contentDP);
        this.contentDP.setSelectable(false);

        this.areaBar = new viewjs.CDisplay();
        this.areaBar.useDiv($(this.div).find(".areaBar"));
        this.addChild(this.areaBar);

        this.areaTip = new viewjs.CDisplay();
        this.areaTip.useDiv($(this.div).find(".areaTip"));
        this.areaTip.setSize(100, tipHeight);
        this.addChild(this.areaTip);

        this.tipPadding = tipPadding;
        this.tipY = tipY;
        this.tipHeight = tipHeight;

        this.areaTip.movey(tipY);
        this.areaBar.movey(tipY);
        this.areaTip.movex(tipPadding);
        this.areaBar.movex(tipPadding);
    }

    //更新UI尺寸，所有內含機制更新
    p.setUISize = function (w, h) {
        this.setSize(w, h);
        this.areaBar.setSize(w - (this.tipPadding * 2), this.tipHeight);
        this.updateMaxXY();
    }

    p.updateMaxXY = function () {
        //更新左右拖曳最大作標
        this.maxX = this.width - this.contentDP.width - this.edgeOverXY;
        //更新顯示bar長度
        var percent = this.width / this.contentDP.width;
        this.areaTip.setSize(percent * this.width, this.areaTip.height);
        this.updateAreaBar();
        DebugView.trace(this.maxX + " | " + this.contentDP.x);
        if (this.contentDP.x < this.maxX) this.contentDP.movex(this.maxX);
    }

    p.updateAreaBar = function () {
        var movedX = this.contentDP.x - this.edgeOverXY;
        var percent = movedX / (this.maxX - this.edgeOverXY);
        if (percent > 1)  percent = 1;
        var areaMoveRange = this.width - this.areaTip.width - (this.tipPadding * 2);
        this.areaTip.movex(this.tipPadding + Math.round(areaMoveRange * percent));
    }

    p.setControlLogic = function () {

        var self = this;
        this.updateMaxXY();

        //按鈕按下機制 拖曳
        //--------------------------------------------------------------------------
        $(this.div).on("mousedown", function (e) {

            var offset = $(e.currentTarget).offset();
            self.clickX = e.pageX - offset.left;
            self.clickY = e.pageY - offset.top;
            self.contentX = self.contentDP.x;
            self.clickY = self.contentDP.y;

            e.preventDefault();

            var moveCall = function (e) {
                var parentOffset = $(self.div).offset();
                self.lastRelX = self.relX;
                self.lastRelY = self.relY;
                self.relX = e.pageX - parentOffset.left - self.clickX + self.contentX;
                self.relY = e.pageY - parentOffset.top - self.clickY;
                if (self.relX > self.edgeOverXY) self.relX = self.edgeOverXY;
                if (self.relX < self.maxX) self.relX = self.maxX;
                self.contentDP.movex(self.relX);
                self.updateAreaBar();
                //DebugView.trace("moveCall");
            }

            var upCall = function (e) {
                $("body").off("mousemove", moveCall);
                $("body").off("mouseup", upCall);
            }

            $("body").on("mousemove", moveCall);
            $("body").on("mouseup", upCall);
  
        });

    }
    
    ui.CScrollArea = CScrollArea;

}());
