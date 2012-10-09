//namespace
this.mvcjs = this.mvcjs || {};
(function () {

    /**
    * 所有AIProxy, AICommand, AIMediator的base Class
    * 涵蓋所有統一擁有的mvc pattern事件運用function
    **/
    var Notification = function (commandName, value, type, extra) {
        this.commandName = commandName;
        if (value !=null) this.value = value;
        if (type !=null) this.type = type;
        if (extra != null) this.extra = extra;
    }

    //-------------------------------------------------------------------
    //[--PUBLIC--] Properties | Functions
    //-------------------------------------------------------------------
    var p = Notification.prototype;
    p.commandName = "";
    p.value = null;
    p.type = null;
    p.extra = null;

    p.dump = function () {
        return "commandName: " + this.commandName + " , value: " + this.value + " , type: " + this.type + " , extra : " + this.extra;
    }

    mvcjs.Notification = Notification;

}());