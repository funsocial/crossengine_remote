this.core = this.core || {};


/**********************************************************
FOR AssetLoading and Managements
[usage]
var assetLoader = new corejs.Loader();
assetLoader.initialize(["assets/fruitH.png","assets/fruitK.png","assets/xmlDataA.xml"]);
assetLoader.itemLoaded = function (result) { 
    // itemLoaded Event
}
assetLoader.allItemLoaded = function (result) { 
    // allItemLoaded Event
}
assetLoader.load();
[如果有xml spritesheet自動轉換資料格式]
assetLoader[xml名稱] = [prefix相同檔名][0 ~ *] = {name:名稱 , x:座標 , y:座標 , w:尺寸 , h:尺寸}
**********************************************************/
Loader = Class.extend({
    /**********************************************************
    setting for loading manifests , a array of resource path
    ["assets/uiMap.png","assets/uiMap.txt","assets/dockFill.png"]
    **********************************************************/
    manifest: null,
    loadPosition: 0,
    totalItems: 0,
    assets: null,
    //function to dispatch
    itemLoaded: null,
    allItemLoaded: null,

    initialize: function (manifest) {
        this.manifest = manifest;
        this.loadPosition = 0;
        this.totalItems = manifest.length;
        this.assets = [];
    },

    load: function () {
        var self = this;
        $.ajax({
            url: this.manifest[0],
            success: function (data) {
                self.loadNext(data);
            }
        });
    },

    loadNext: function (loadedData) {

        var loadedFileName = this.manifest[this.loadPosition];

        //XML SpriteSheet or general xml datas are stored in the assets
        if (loadedFileName.indexOf(".xml") > -1) {

            var fileName = Util.getFileNamePart(loadedFileName);

            //if it is xml sprite sheet, convert xml spritesheet into dictionary array
            var xmlObj = [];
            $(loadedData).find("SubTexture").each(function () {
                xmlObj.push({ name: $(this).attr("name"), x: $(this).attr("x"), y: $(this).attr("y"), w: $(this).attr("width"), h: $(this).attr("height") });
            });

            if (xmlObj.length > 0) {
                //It's a spritesheet xml, convert it into dictionary structured clip info
                //------ format ------
                //this.assets[name] = clipData[clipPrefix][0~*];
                //ex: this.assets["mario.xml"] = ["walk"][0].name
                //回傳 mario.xml下 prefix為walk名稱下的第0張圖 (name = "walk00")
                var clipData = {};
                for (var s = 0; s < xmlObj.length; s++) {
                    var baseName = xmlObj[s].name;
                    var namePart = baseName.match(/\D+/);
                    var digit = Number(baseName.match(/\d+/));
                    //this.clipData[digit] contains xml settings of ---> name , x , y , w , h
                    if (clipData[namePart] == undefined) clipData[namePart] = [];
                    clipData[namePart][digit] = xmlObj[s];
                    DebugView.trace("namePart: " + namePart + " , " + clipData[namePart][digit].name + " len: " + clipData[namePart].length);
                }
                this.assets[fileName] = clipData;
            } else {
                this.assets[fileName] = $(loadedData);
            }
        }

        this.loadPosition++;

        if (this.loadPosition < this.totalItems) {
            var self = this;
            //load next item
            $.ajax({
                url: this.manifest[this.loadPosition],
                success: function (data) {
                    self.loadNext(data);
                }
            });
            //dispatch item loaded event
            if (this.itemLoaded != null) {
                this.itemLoaded({ "fileName": loadedFileName, "pos": this.loadPosition - 1 });
            }
        } else {
            //everything loaded
            if (this.allItemLoaded != null) {
                this.allItemLoaded({ "fileName": loadedFileName, "pos": this.loadPosition - 1 });
            }
        }

    },

});

// ---------- [STATIC PROPERTIES] -----------


//assign to namespace
core.Loader = Loader;