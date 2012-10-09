this.view = this.view || {};

//[full path class body]
AlignSetting = Class.extend({

    targetDisplay: null,

    /**********************************************************
    setting for alignment
    {
        ha: "T", va: "C",                   //[horizontal align L,C,R] [vertical align T,C,B]
        hoff: 50, voff: 50                  //offset for vertial and horizontal
    }
    **********************************************************/
    setting: null,

    initialize: function (targetDisplay, setting) {
        this.targetDisplay = targetDisplay;
        this.setting = setting;
        this.setting.w = setting.w;
        this.setting.h = setting.h;
    },

    update: function () {

        //alert("UPDATE "+this.targetDisplay.parent);
        if (this.targetDisplay.parent == null) {
            var pw = $(window).width();
            var ph = $(window).height();
        } else {
            var pw = $("#" + this.targetDisplay.parent.name).width();
            var ph = $("#" + this.targetDisplay.parent.name).height();
        }

        var w = $("#" + this.targetDisplay.name).width();
        var h = $("#" + this.targetDisplay.name).height();

        var axto = 0;
        var ayto = 0;

        if (this.setting.ha != undefined) {
            if (this.setting.ha == "C") {
                axto = (pw - w) * .5;
            }
            if (this.setting.ha == "R") {
                axto = (pw - w);
            }
        }
        if (this.setting.va != undefined) {
            if (this.setting.va == "C") {
                ayto = (ph - h) * .5;
            }
            if (this.setting.va == "B") {
                ayto = (ph - h);
            }
        }

        if (this.setting.hoff != undefined) axto += this.setting.hoff;
        if (this.setting.voff != undefined) ayto += this.setting.voff;
        this.targetDisplay.setCssEdgeAlign({ left: axto, top: ayto });

    },

});

// ---------- [STATIC PROPERTIES] -----------

//assign to namespace
view.AlignSetting = AlignSetting;