//namespace
this.mvcjs = this.mvcjs || {};
(function () {

    /**
    * 所有AIProxy, AICommand, AIMediator的base Class
    * 涵蓋所有統一擁有的mvc pattern事件運用function
    **/
    var MvcBase = function () {
    }

    // [--PRIVATE--]

    //-------------------------------------------------------------------
    //[--PUBLIC--] Properties | Functions
    //-------------------------------------------------------------------
    var p = MvcBase.prototype;
    p.facadeParent = null;

    //javascript 不支援方法取得完整class路徑
    //使用自行建立function 設定 class 路徑 ex: return "namespace.SomeClass";
    p.getClassName = function () {
        return "";
    }

    //取得該衍伸物件總類, command , proxy 或 Mediator
    p.getMvcType = function () {
    }

    /**
	* 傳送Notification給有登記觸發的Command 或 Mediator
	* @param commandName	事件名稱
	* @param value			事件傳遞參數物件
	* @param type			事件種類
    * @param extra			附加參數
	* @param facadeNames	陣列含蓋接收的facade，是否只傳遞固定的facade中所有command或mediator 
	* 						如果為null則設定為目前呼叫facade
	*/
    p.sendNotify = function (commandName, value, type, extra, facadeNames) {
        this.facadeParent.sendNotify(commandName, value, type, extra, facadeNames);
    }

    p.addMediator = function(mediator){
        this.facadeParent.addMediator(mediator);
		return mediator;
	}
		
	p.getMediator = function(name){
	    return this.facadeParent.getMediator(name);
	}
		
	p.addCommand = function(nameStr,command){
		//facadeParent.addCommand(nameStr,command);
	}
		
	p.addProxy = function(proxy){
	    this.facadeParent.addProxy(proxy);
	}
		
	p.getProxy = function(name){
	    return this.facadeParent.getProxy(name);
	}

	p.getFacade = function () {
	    return this.facadeParent;
	}

	p.removeSelf = function () {
        //remove from facade
	    switch (this.getMvcType()) {
	        case "proxy":
	            this.facadeParent.removeProxy(this.getClassName());
	            break;
	        case "mediator":
	            this.facadeParent.removeMediator(this.getClassName());
	            break;
	    }
	    eval(this.getClassName() + ".instance = null");
	}

    mvcjs.MvcBase = MvcBase;

}());
