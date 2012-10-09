//namespace
this.mvcjs = this.mvcjs || {};
(function () {

    var MvcProxy = function () {
    }

    // [--PRIVATE--]

    //-------------------------------------------------------------------
    //[--PUBLIC--] Properties | Functions
    //-------------------------------------------------------------------
    var p = MvcProxy.prototype = new mvcjs.MvcBase();

    p.getMvcType = function () {
        return "proxy";
    }

    mvcjs.MvcProxy = MvcProxy;

}());
