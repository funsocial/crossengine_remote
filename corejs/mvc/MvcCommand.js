//namespace
this.mvcjs = this.mvcjs || {};
(function () {

    var MvcCommand = function () {
    }

    // [--PRIVATE--]

    //-------------------------------------------------------------------
    //[--PUBLIC--] Properties | Functions
    //-------------------------------------------------------------------
    var p = MvcCommand.prototype = new mvcjs.MvcBase();
    p.listenCommands = [];

    //used for command chain
    //p.previousCmd = null;
    //p.nextCmd = null;

    p.getMvcType = function () {
        return "command";
    }

    p.execute = function (note) {
    }


    mvcjs.MvcCommand = MvcCommand;   

}());
