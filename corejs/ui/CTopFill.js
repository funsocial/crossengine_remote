//namespace
this.ui = this.ui || {};
(function () {

    /**
    * top fill , usually used with loader to display a black area filled for loading progress
    **/
    var CTopFill = function () {
    }

    //-------------------------------------------------------------------
    //[--PUBLIC--] Properties | Functions
    //-------------------------------------------------------------------
    var p = CTopFill.prototype = new viewjs.CDisplay();

    p.setup = function (div, color, transparency) {
        this.useDiv(div);
        this.fillBackground(color, "100%", "100%");
        this.setAlpha(transparency);
    }
       
    ui.CTopFill = CTopFill;

}());
