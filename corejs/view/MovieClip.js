this.view = this.view || {};

//[full path class body]
MovieClip = view.Display.extend({

    imgSrc: "",
    clipData: null,
    //css background對齊坐標
    imageOffset: "0px 0px", //TODO:
    //webkit rotate 旋轉對應點
    transformOrigin: "50% 50%", //TODO:

    /**********************************************************
    更新圖形 x, y 座標 顯示位置
    **********************************************************/
    imgUpdate: function (dataEntry) {
        var cssVal = "transparent url(" + this.imgSrc + ") no-repeat ";
        cssVal += "-" + dataEntry.x + "px -" + dataEntry.y + "px";
        $(this.div).css({ "background": cssVal });
    },

    //設定單張圖片image
    asSingleImg: function (imgSrc, width, height) {
        if (this.div == null) this.createDiv();
        this.setSize(width, height);
        this.imgSrc = imgSrc;
        var cssVal = "transparent url(" + this.imgSrc + ") no-repeat ";
        cssVal += "0px 0px";
        $(this.div).css({ "background": cssVal });
    },

    //設定不斷重複的材質image
    asTileImg: function (imgSrc, width, height) {
        this.setSize(width, height);
        if (this.div == null) this.createDiv();
        this.imgSrc = imgSrc;
        var cssVal = "transparent url(" + this.imgSrc + ") ";
        cssVal += "0px 0px";
        $(this.div).css({ "background": cssVal });
    },

    //目前影格
    currentFrame: 0,
    //計算影格更新每次render的時間總和
    timeAdded: 0,
    //目前play模式
    playMode: "",
    //yoyo Mode撥放方向
    yoyoDir: "",
    fps: 1,
    //fps在執行下每次更新時間 ex: 30/1000 每秒30次
    fpsEach: 0,
    label: "",
    labelTotalFrame: 0,
    imgAltas: null,
    playing: false,
    onceStop: false,

    /**********************************************************
    設定撥放影格資訊 
    imgScr          圖片來源 ex: assets/img.png
    imgData         texture atlas 資訊
    label           預設顯示prefix image
    currentFrame    預設該image下第幾張圖停留，無則為0
    w, h            圖片大小
    **********************************************************/
    asClip: function (imgSrc, imgAltas, label, currentFrame, w, h) {
        if (this.div == null) this.createDiv();
        if (currentFrame == undefined) currentFrame = 0;
        this.currentFrame = currentFrame;
        this.label = label;
        this.imgSrc = imgSrc;
        this.imgAltas = imgAltas;
        this.labelTotalFrame = this.imgAltas[this.label].length;
        this.setSize(w, h);
        this.setFPS(12);
        this.frameUpdate();
        var cssVal = "transparent url(" + this.imgSrc + ") no-repeat";
        $(this.div).css({ "background": cssVal });

        //setting initial display
        var altasData = this.imgAltas[this.label][this.currentFrame];
        var cssVal = "-" + altasData.x + "px -" + altasData.y + "px";
        $(this.div).css({ "background-position": cssVal });

    },

    setFPS: function(fps){
        this.fps = fps;
        this.fpsEach = 1000 / fps;
    },

    frameUpdate: function () {
        if (this.labelTotalFrame == 1) return;
        var altasData = this.imgAltas[this.label][this.currentFrame];
        var cssVal = "-" + altasData.x + "px -" + altasData.y + "px";
        $(this.div).css({ "background-position": cssVal });
    },

    //開始播放目前動畫或改變播放label
    play: function (newLabel, newFrame) {
        this.playing = true;
        this.playMode = "loop";
        if (newLabel == undefined) {
            this.timeAdded = 0;
        } else {
            this.label = newLabel;
            this.labelTotalFrame = this.imgAltas[this.label].length;
            this.currentFrame = 0;
            if (newFrame != undefined) this.currentFrame = newFrame;
            if (this.currentFrame > this.labelTotalFrame) this.currentFrame = 0;
            this.frameUpdate();
        }
    },

    stopAt: function (toFrame) {
        this.playing = false;
        if (toFrame != undefined) {
            if (toFrame > this.labelTotalFrame) toFrame = this.labelTotalFrame;
            this.currentFrame = toFrame;
            this.frameUpdate();
        }
    },

    playYoYo: function (newLabel, newFrame) {
        this.play(newLabel, newFrame);
        this.playMode = "yoyo";
        this.yoyoDir = "R";
    },

    //播放一次後停止並傳遞完成事件
    playOnceStop: function (newLabel, newFrame) {
        this.onceStop = true;
        this.play(newLabel, newFrame);
    },

    //Render引擎每次更新時呼叫stage下所有MovieClip的 playUpdate function，更新movieClip對應視覺
    //####################################################################################
    playUpdate: function (timeDiff) {
        if (!this.playing) return;
        //if ( (this.labelTotalFrame == 1) && (this.onceStop==false) ) return;
        this.timeAdded += timeDiff;
        //reach fps minisecond, advance to next frame
        if (this.timeAdded > this.fpsEach) {
            this.timeAdded = this.timeAdded % this.fpsEach;
            if (!this.onceStop) {
                if (this.playMode == "loop") {
                    this.loopPlayLogic();
                }
                if (this.playMode == "yoyo") {
                    this.yoyoPlayLogic();
                }
            } else {
                this.oncePlayLogic();
            }
        }
    },
    //general loop play, play from 0 ~ end and repeat from start
    loopPlayLogic: function () {
        var frameTo = this.currentFrame;
        frameTo++;
        frameTo = frameTo % this.labelTotalFrame;
        this.frameUpdate();
        this.currentFrame = frameTo;
    },
    oncePlayLogic: function () {
        this.currentFrame++;
        if (this.currentFrame < this.labelTotalFrame) {
            this.frameUpdate();
        } else {
            this.dispatchEvent(MovieClip.ONCE_PLAYED, {target:this});
            this.playing = false;
        }
    },
    yoyoPlayLogic: function () {
        var frameTo = this.currentFrame;
        if (this.yoyoDir == "R") {
            frameTo++;
            if (frameTo == this.labelTotalFrame) {
                frameTo--;
                this.yoyoDir = "L";
            }
        }
        if (this.yoyoDir == "L") {
            frameTo--;
            if (frameTo <= 0) {
                frameTo = 0;
                this.yoyoDir = "R";
            }
        }
        this.frameUpdate();
        this.currentFrame = frameTo;
    },
    //####################################################################################
});

// ---------- [STATIC PROPERTIES] -----------
MovieClip.ONCE_PLAYED = "ONCE_PLAYED";

//assign to namespace
view.MovieClip = MovieClip;