this.view = this.view || {};

//使用於遊戲或滿版應用程式最外層，寬高的設定為可視尺寸 ( window.innerWidth, window.innerHeight)
Stage = view.Display.extend({

    alignTool: null,
    alignUpdated: null,
    scaleFitFlag: false,

    initialize: function (useDiv, minWidth, minHeight, maxWidth, maxHeight) {
        this.useDiv(useDiv);
        var self = this;  //reference class for js event
        $(window).resize(function () { self.alignStage(); });
        this.setSizeMinMax(minWidth, minHeight, maxWidth, maxHeight);
    },

    alignStage: function () {
        //this.stageSizeUpdate();
        if (this.children != null) {
            var len = this.children.length;
            for (var s = 0; s < len; s++) {
                if (this.children[s].alignSetting != null) {
                    this.children[s].alignSetting.update();
                }
            }
        }
        if (this.alignSetting != null) this.alignSetting.update();
        if (this.scaleFitFlag) this.scaleToFit();
    },

});


//assign to namespace
view.Stage = Stage;