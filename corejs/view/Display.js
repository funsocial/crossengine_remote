this.view = this.view || {};
//[full path class body]
Display = core.Dispatcher.extend({

    //[public properties]

    //對應 Div 的 ID 名稱
    name: "",
    //div 物件
    div: null,
    //div 物件由document.getElementById(取得)
    domDiv: null,

    x: 0,
    y: 0,
    z: 0,
    width: 0,
    height: 0,
    deg: 0,
    sx: 1,
    sy: 1,
    alpha: 1,
    parent: null,
    children: null,
    alignSetting: null,

    //[constructor, called automatically when build]
    init: function () {
    },

    //建立display，使用div為顯示物件
    //divName 參數為 String div ID "someObject" 或 jquery 指向 物件 $("#someObject")
    useDiv: function (divName, absolutePos) {
        if (this.div == null) {
            if (typeof (divName) == "string") {
                //如果建立reference為string指向 div ID
                this.div = $("#" + divName);
                this.name = divName;
            } else {
                //如果建立reference為jquery物件
                this.div = divName;
                this.name = this.div.attr("id");
            }
            if (absolutePos == true || absolutePos == undefined) {
                this.div.css({ "display": "block", "position": "absolute"});
            }
            if ( (!document.getElementById(divName)) && (!divName)) {
                alert("div can not be found divName: " + divName);
            }
            this.domDiv = document.getElementById(this.name);
        }
    },
    createDiv: function () {
        if (this.div == null) {
            this.div = $("<div>");
            this.div.css({ "display": "block", "position": "absolute", "left": "0px", "top": "0px" });
        }
    },
    setSelectable: function (flag) {
        if (flag == false) {
            $(this.div).css({
                "-webkit-user-select": "none",
                "user-select": "none",
                "-moz-user-select": "-moz-none",
                "-khtml-user-select": "none",
                "-o-user-select": "none",
                "-ms-user-select": "none",
                "cursor": "default"
            });
        } else {
            $(this.div).css({
                "-webkit-user-select": "",
                "user-select": "",
                "-moz-user-select": "",
                "-khtml-user-select": "",
                "-o-user-select": "",
                "-ms-user-select": ""
            });
        }
    },
    setMask: function () {
        $(this.div).css({ "overflow": "hidden"});
    },

    //設定上下左右 align 的座標，對應css top, left, right, bottom 在 absolute 位置下對應parent下的座標
    //範例 {top:"0px", left:"0px"} -> 對左上         {bottom: "0px"} -> 對下方
    setCssEdgeAlign: function (alignObj) {
        if (alignObj.top) $(this.div).css({ "top": alignObj.top });
        if (alignObj.left) $(this.div).css({ "left": alignObj.left });
        if (alignObj.right) $(this.div).css({ "right": alignObj.right });
        if (alignObj.bottom) $(this.div).css({ "bottom": alignObj.bottom });
    },

    //設定根據alignSetting下移動物件上下左右
    setAlign: function (obj) {
        this.alignSetting = new view.AlignSetting();
        this.alignSetting.initialize(this, obj);
    },

    // child and depth control
    //####################################################################################
    //將 target html object 至入為 child 並設定相對 z 軸, 如果此物件z為100則 child z 軸值 為 100+baseZ
    addChild: function (newOne, baseZ) {
        if (newOne == null) return null;
        //see if this div is already the child in html(already added by calling addChild command?)
        if (newOne.parent != null) {
            var parentId = document.getElementById(newOne.name).parentNode.id;
            if (parentId == this.name) {
                DebugView.trace(newOne.name + " is already child of " + this.name);
                return;
            }
            if (newOne.parent == this) {
                DebugView.trace(newOne.name + " is already child of " + this.name);
                return;
            } else {
                newOne.parent.removeChild(newOne);
            }
        }
        //append html tag
        $(this.div).append(newOne.div);
        this.setupChild(newOne, baseZ);
    },
    removeChild: function (removeOne, destory) {
        var childPos = this.children.indexOf(removeOne);
        DebugView.trace(this.name + " remove child " + removeOne.name + " index: " + childPos);
        if (childPos > -1) this.children.splice(childPos, 1);
        if (destory||destory==undefined) $("#" + removeOne.name).remove();
    },
    //設定已為 child的 div tag。 設定z座標、parent
    setupChild: function (newOne, baseZ, absolutePos) {
        if (this.children == null) this.children = [];
        this.children.push(newOne);
        newOne.parent = this;
        if (baseZ == undefined) baseZ = this.children.length;
        newOne.setz(baseZ);
        DebugView.trace("setupChild() " + this.name + " Z:" + this.z + "   " + newOne.name + "    baseZ:" + baseZ);
    },
    swapChildren: function (childA, childB) {
        var aPos = this.children.indexOf(childA);
        var bPos = this.children.indexOf(childB);
        if (aPos > -1 && bPos > -1) {
            this.children[aPos] = childB;
            this.children[bPos] = childA;
        }
        this.resetDepth();
    },
    //####################################################################################


    //顯示update
    //####################################################################################
    //每次Render時更新遊戲中物件
    playUpdate: function (timeDiff) {
        if (this.children == null) return;
        var len = this.children.length;
        for (var s = 0; s < len; s++) {
            if (this.children[s].playUpdate) {
                this.children[s].playUpdate(timeDiff);
            }
        }
    },

    hide: function () {
        if (this.div == null) return;
        $(this.div).hide();
    },
    show: function () {
        if (this.div == null) return;
        $(this.div).show();
    },
    move: function (xto, yto) {
        this.x = xto;
        this.y = yto;
        this.render();
    },
    movex: function (xto) {
        this.x = xto;
        this.render();
    },
    movey: function (yto) {
        this.y = yto;
        this.render();
    },
    rotate: function (degree) {
        this.deg = degree;
        this.render();
    },
    setAlpha: function (alphaTo) {
        this.alpha = alphaTo;
        this.render();
    },
    scale: function (scalex, scaley) {
        this.sx = scalex;
        this.sy = scaley;
        this.render();
    },
    scalex: function (scalex) {
        this.sx = scalex;
        this.render();
    },
    scaley: function (scaley) {
        this.sy = scaley;
        this.render();
    },
    setz: function (zto) {
        if (this.parent) {
            this.z = this.parent.z + zto;
        } else {
            this.z = zto;
        }
        //DebugView.trace(this.name + " setz: " + zto + " parent " + this.parent.name + " parentZ: " + this.parent.z);
        $(this.div).css({ "zIndex": this.z });
    },
    render: function () {
        var trans = "translate3d(" + this.x + "px," + this.y + "px, " + this.z + "px) ";
        //IE9 does not support 3d tranlate, use 2d instead
        if (Util.isIE()) {
            trans = "translate(" + this.x + "px," + this.y + "px) ";
        }
        trans += "rotate(" + this.deg + "deg) ";
        trans += "scaleX(" + this.sx + ") scaleY(" + this.sy + ") ";
        $(this.div).css({
            "-webkit-transform": trans,
            "-moz-transform": trans,
            "-o-transform": trans,
            "msTransform": trans,
            "transform": trans,
            "-moz-opacity": this.alpha,
            "-webkit-opacity": this.alpha,
            "-ms-opacity": this.alpha,
            "opacity": this.alpha
        });
        //"-webkit-transform-origin" : "0% 0%",
    },
    //####################################################################################


    //尺寸update
    //####################################################################################
    /* 設定尺寸 width 及 height 可為 int 或 百分比數字 ex: 100% */
    setSize: function (width, height) {
        this.width = width;
        this.height = height;
        this.div.css({ "width": this.width, "height": this.height});
    },
    setSizeMinMax: function (minWidth, minHeight, maxWidth, maxHeight) {
        this.div.css({ "min-width": minWidth, "min-height": minHeight, "max-width": maxWidth, "max-height": maxHeight });
    },
    //每次尺寸更新時更新所有對齊參數
    alignUpdate: function () {
        if (this.children != null) {
            var len = this.children.length;
            for (var s = 0; s < len; s++) {
                if (this.children[s].alignSetting != null) {
                    this.children[s].alignSetting.update();
                }
            }
        }
        if (this.alignSetting != null) this.alignSetting.update();
    },
    //####################################################################################


    //local position on webkit
    //####################################################################################
    //取得mouseEvent(e.pageX, e.pageY) 情況下對應local 或 global座標
    getPointInfo: function (e) {
        //support webkit methods, chrome, safari, not IE 9 
        if (window.webkitConvertPointFromPageToNode) {
            var localPt = window.webkitConvertPointFromPageToNode(this.domDiv, new WebKitPoint(e.pageX, e.pageY));
            return { pageX: Math.round(e.pageX), pageY: Math.round(e.pageY), localX: Math.round(localPt.x), localY: Math.round(localPt.y) }
        } else {
            //using matrix to caculate relative location , IE fix
            var localPt = TransformTool.getInstance().offsetXY(pageX, pageY, this.domDiv);
            return { pageX: Math.round(e.pageX), pageY: Math.round(e.pageY), localX: Math.round(localPt.x), localY: Math.round(localPt.y) }
        }
    },
    getLocalXY: function(pageX, pageY){
        //support webkit methods, chrome, safari, not IE 9 
        if (window.webkitConvertPointFromPageToNode) {
            var localPt = window.webkitConvertPointFromPageToNode(this.domDiv, new WebKitPoint(pageX, pageY));
            return {x: Math.round(localPt.x), y: Math.round(localPt.y) }
        } else {
            //using matrix to caculate relative location , IE fix
            var localPt = TransformTool.getInstance().offsetXY(pageX, pageY, this.domDiv);
            return {x: Math.round(localPt.x), y: Math.round(localPt.y) }
        }
    },
    //####################################################################################

    //TWEEN
    //####################################################################################
    tweenHide: function (seconds, properties) {
        var self = this;
        properties.onComplete = function () {
            self.hide();
        }
        this.tween(seconds, properties);
    },
    tween: function (seconds, properties) {
        var self = this;
        properties.roundProps = ["x", "y"];
        properties.onUpdate = function () {
            self.render();
        }
        TweenMax.to(this, seconds, properties);
    },
    //####################################################################################
});

// ---------- [STATIC PROPERTIES] -----------

//assign to namespace
view.Display = Display;