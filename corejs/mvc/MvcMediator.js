//namespace
this.mvcjs = this.mvcjs || {};
(function () {

    var MvcMediator = function () {
    }

    // [--PRIVATE--]

    //-------------------------------------------------------------------
    //[--PUBLIC--] Properties | Functions
    //-------------------------------------------------------------------
    var p = MvcMediator.prototype = new mvcjs.MvcBase();

    p.getMvcType = function () {
        return "mediator";
    }

    p.registerNotification = function () {
        return null;
    }

    p.handleNotification = function (note) {
    }

    mvcjs.MvcMediator = MvcMediator;

}());
