this.ui = this.ui || {};

//[full path class body]
LoadingCover = view.Display.extend({

    //width, height, backGround, alpha, zIndex
    setup: function (width, height, backGround, alpha, zIndex) {
        this.setSize(width, height);
        this.setAlpha(alpha);
        $(this.div).css({ "background-color": backGround, "zIndex": zIndex });

    },

});

// ---------- [STATIC PROPERTIES] -----------

//assign to namespace
ui.LoadingCover = LoadingCover;