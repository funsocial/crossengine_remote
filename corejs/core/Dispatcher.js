this.core = this.core || {};

//[full path class body]
Dispatcher = Class.extend({

    //[public properties]

    listeners: null,

    //[constructor, called automatically when build]
    init: function () {
    },

    addListener: function (commandName, callBack) {
        if (this.listeners == null) this.listeners = new Array();
        this.listeners[this.listeners.length] = { f: callBack, n: commandName };
    },

    removeListener: function (callBack) {
        if (this.listeners == null) return;
        var len = this.listeners.length;
        for (var i = 0; i < len; i++) {
            if (this.listeners[i].f === callBack) {
                delete (this.listeners[i]);
            }
        }
    },

    dispatchEvent: function (commandName, eventObj) {
        if (this.listeners == null) return;
        var len = this.listeners.length;
        for (var i = 0; i < len; i++) {
            if (typeof this.listeners[i].f === 'function') {
                if (this.listeners[i].n == commandName) {
                    this.listeners[i].f(eventObj);
                }
            }
        }
    }


});

// ---------- [STATIC PROPERTIES] -----------

//assign to namespace
core.Dispatcher = Dispatcher;