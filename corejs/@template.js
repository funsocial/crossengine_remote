
this.view = this.view || {};

//[full path class body]
Stage = view.Display.extend({

});

// ---------- [STATIC PROPERTIES] -----------

//assign to namespace
view.Display = Display;





//BASE CLASS
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//[namespace]
this.viewjs = this.viewjs || {};

//[full path class body]
BaseClass = Class.extend({

    //[public properties]
    name: "[BaseClass]",

    //[constructor, called automatically when build]
    init: function (name) {
        this.name += name;
    },

    callIt: function () {
        BaseClass.counter++;
        alert("calling function from BaseClass name: " + this.name);
    }

});

BaseClass.counter = 0;
BaseClass.staticCall = function () {
    BaseClass.counter++;
}

viewjs.BaseClass = BaseClass;
//-------------------------------------------------------------------
//-------------------------------------------------------------------



//[child class extend]
viewjs.SubClass = viewjs.BaseClass.extend({
    //[public properties]
    name: "[SubClass]",
    //[constructor, called automatically when build]
    init: function (name) {
        this.name += name;
    },
    callIt: function () {
        this._super();
        BaseClass.counter++;
        alert("calling function from SubClass name: " + this.name);
    }
});

//[child class extend]
viewjs.MinClass = viewjs.SubClass.extend({
    //[public properties]
    name: "[MinClass]",
    //[constructor, called automatically when build]
    init: function (name) {
        this.name += name;
    },
    callIt: function () {
        this._super();
        BaseClass.counter++;
        alert("calling function from MinClass name: " + this.name);
    }
});

//var ba = new viewjs.BaseClass(" ba");
//ba.callIt();

//var sa = new viewjs.SubClass(" sa");
//sa.callIt();

var ma = new viewjs.MinClass(" ma");
ma.callIt();

viewjs.BaseClass.staticCall();

alert("static value from BaseClass counter: " + viewjs.BaseClass.counter);