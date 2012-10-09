//namespace
this.mvcjs = this.mvcjs || {};
(function () {

    /**
    * Facade涵蓋所有component下的command,mediator及view的物件管理
    **/
    var MvcFacade = function (name) {
        this.name = name;
        if (MvcFacade.facadeMap[name] != null) {
            alert("[" + name + "] facade Already exist, Abort~");
            return;
        }
        this.mediatorMap = [];
        this.commandMap = [];
        this.proxyMap = [];
        MvcFacade.registerFacade(name, this);
    }

    // [--PRIVATE--]

    //-------------------------------------------------------------------
    //[--PUBLIC--] Properties | Functions
    //-------------------------------------------------------------------
    var p = MvcFacade.prototype;
    p.name = "";
    p.mediatorMap;
    p.commandMap;
    p.proxyMap;

    /**
	* 傳送Notification給有登記觸發的Command 或 Mediator
	* @param commandName	事件名稱
	* @param value			事件傳遞參數物件
	* @param type			事件種類
    * @param extra			附加參數
	* @param facadeNamess    陣列含蓋接收的facade，是否只傳遞固定的facade中所有command或mediator 
	* 						如果為null則設定為目前呼叫facade
	*/
    p.sendNotify = function (commandName, value, type, extra, facadeNames) {

        var note = new mvcjs.Notification(commandName, value, type, extra);
        //============================================
        //傳遞置每個觸發facade物件
        //============================================
        var targetFacades = [this.name];
        if (facadeNames != null) targetFacades = facadeNames;

        for (var key in MvcFacade.facadeMap) {
            var loopFacade = MvcFacade.facadeMap[key];
            for (var toNamekey in targetFacades) {

                //取得所有傳遞至 facade 名稱
                //-----------------------------------------
                if (targetFacades[toNamekey] == loopFacade.name) {

                    //傳遞至每個mediator 
                    //-----------------------------------------
                    for (var loopMedKey in loopFacade.mediatorMap) {
                        var loopMediator = loopFacade.mediatorMap[loopMedKey];
                        var cmdList = loopMediator.registerNotification();
                        for (var cmdKey in cmdList) {
                            if (cmdList[cmdKey] == commandName) {
                                loopMediator.handleNotification(note);
                            }
                        }
                    }

                    //傳遞至每個command
                    //-----------------------------------------
                    for (var cmdClassName in loopFacade.commandMap) {
                        var useData = loopFacade.commandMap[cmdClassName];
                        if (useData[commandName]) {
                            //新建command instance fire
                            var cmdInstance = eval("new " + cmdClassName + "();");
                            cmdInstance.facadeParent = loopFacade;
                            cmdInstance.execute(note);
                        }
                    }
                }
            }
        }
    }

    p.addMediator = function (newOne) {
        //檢查該 Mediator 是否已存在
        if (this.mediatorMap[newOne.getClassName()] == null) {
            this.mediatorMap[newOne.getClassName()] = newOne;
            newOne.facadeParent = this;
        } else {
            alert("mediator already exist in facade "+this.name);
        }
    }
    p.getMediator = function (fullClassName) {
        return this.mediatorMap[fullClassName];
    }
    p.removeMediator = function (fullClassName) {
        this.mediatorMap[fullClassName] = null;
    }

    p.addProxy = function (newOne) {
        //檢查該 proxy 是否已存在
        if (this.proxyMap[newOne.getClassName()] == null) {
            this.proxyMap[newOne.getClassName()] = newOne;
            newOne.facadeParent = this;
        } else {
            alert("proxy already exist in facade " + this.name);
        }
    }
    p.getProxy = function (fullClassName) {
        return this.proxyMap[fullClassName];
    }
    p.removeProxy = function (fullClassName) {
        this.proxyMap[fullClassName] = null;
    }


    /**
    *   增加command至facade 資料格式
    *   this.commandMap[ Command Class Name ] = ["commandA", "commandB"];
    */
    p.addCommand = function (commandName, commandClassName) {
        //檢查該 command 是否已存在
        if (this.commandMap[commandClassName] == null) {
            this.commandMap[commandClassName] = [];
        }
        useData = this.commandMap[commandClassName];
        if(useData[commandName] == null){
            useData[commandName] = commandName;
        }
    }

    //移除某個對應事件下的command
    p.removeCommand = function (commandName, commandClassName) {
        //檢查該 command 是否已存在
        var useInstance = null;
        if (this.commandMap[commandClassName] != null) {
            this.commandMap[commandClassName][commandName] = null;
        }
    }


    //-------------------------------------------------------------------
    // static 新增或取得所有facade instance logic
    //-------------------------------------------------------------------
    MvcFacade.facadeMap = [];
    MvcFacade.registerFacade = function(name, instance){
        MvcFacade.facadeMap[name] = instance;
    }
    MvcFacade.removeFacade = function (facade) {
        MvcFacade.facadeMap[facade.name] = null;
        facade = null;
    }
    MvcFacade.getFacade = function (name) {
        return MvcFacade.facadeMap[name];
    }

    mvcjs.MvcFacade = MvcFacade;

}());
