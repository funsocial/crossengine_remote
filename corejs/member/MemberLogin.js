function MemberLogin() {
};
MemberLogin.postUrl = "../ss/MemberLogin.php";
MemberLogin.APP_ID = "393427900724946";

MemberLogin.onNotLogin = null;
MemberLogin.onLogin = null;
MemberLogin.onBasicLoginFail = null;
MemberLogin.onRegisterExist = null;
MemberLogin.onRegisterDone = null;
MemberLogin.onFBRegisterNew = null;

MemberLogin.fbid = "";
MemberLogin.screenName = "";
MemberLogin.email = null;
MemberLogin.autoId = null;

//[初始頁面檢查是否登入]----------------------------------------------
MemberLogin.initFBAndCheckLogin = function() {
    window.fbAsyncInit = function() {
        FB.init({
            appId : MemberLogin.APP_ID,
            status : true,
            cookie : true,
            xfbml : true
        });
        FB.getLoginStatus(function(response) {
            if (response.authResponse) {
                FB.api('/me', function(response) {
                    DebugView.trace("name: " + response.name);
                    DebugView.trace("id: " + response.id);
                    MemberLogin.fbid = response.id;
                    MemberLogin.screenName = response.name;
                    MemberLogin.checkInitLogin();
                });
            } else {
                DebugView.trace("FB not logined ");
                MemberLogin.checkInitLogin();
            }
        }, true);
    };
}
//[初始頁面檢查是否登入]----------------------------------------------
MemberLogin.checkInitLogin = function() {
    $.ajax({
        type : "POST",
        url : MemberLogin.postUrl,
        data : {
            "type" : "checkInitLogin",
            "fbid" : MemberLogin.fbid
        },
        success : function(result) {
            DebugView.trace("checkInitLogin result : " + result);
            var result = Util.getQueryFrom(result, "result");
            if (result == 1) {
                DebugView.trace("UserLoginDone!");
            } else {

            }
        }
    });
}
//[使用者透過FB帳號登入]----------------------------------------------
MemberLogin.loginWithFB = function() {
    FB.login(function(response) {
        if (response.authResponse) {
            MemberLogin.fbid = response.authResponse.userID;
            FB.api('/me', function(response) {
                MemberLogin.screenName = response.name;
                MemberLogin.email = response.email;
                //check to see if user is login for the first time
                $.ajax({
                    type : "POST",
                    url : MemberLogin.postUrl,
                    data : {
                        "type" : "checkFBLoginExist",
                        "fbid" : MemberLogin.fbid
                    },
                    success : function(result) {
                        var recordCount = Util.getQueryFrom(result, "result");
                        MemberLogin.autoId = Util.getQueryFrom(result, "autoId");
                        if (recordCount == 0) {
                            DebugView.trace("loginWithFB: register new user!");
                            if (MemberLogin.onFBRegisterNew != null) {
                                MemberLogin.onFBRegisterNew(MemberLogin.screenName, MemberLogin.email);
                            }
                        } else {
                            DebugView.trace("login done by using FB Account, setting cookies");
                            $.ajax({
                                type : "POST",
                                url : MemberLogin.postUrl,
                                data : {
                                    "type" : "loginSetCookie",
                                    "screenName" : MemberLogin.screenName,
                                    "autoId" : MemberLogin.autoId
                                },
                                success : function(result) {
                                    DebugView.trace("UserLoginDone!");
                                }
                            });
                        }
                    }
                });
            });
        } else {
            DebugView.trace('User cancelled login or did not fully authorize.');
        }
    }, {
        scope : 'email,user_likes'
    });
}

//[使用者登入，登入後自動設定cookie]----------------------------------------------
MemberLogin.basicLogin = function(email, password) {
    $.ajax({
        type : "POST",
        url : MemberLogin.postUrl,
        data : {
            "type" : "basicLogin",
            "email" : email,
            "password" : password
        },
        success : function(result) {
            DebugView.trace("basicLogin response: "+result);
            var recordCount = Util.getQueryFrom(result, "result");
            if (recordCount == 0) {
                if (MemberLogin.onBasicLoginFail != null)
                    MemberLogin.onBasicLoginFail();
            } else {
                DebugView.trace("basicLogin sucess ");
            }
        }
    });
}
//[新使用者註冊]----------------------------------------------
MemberLogin.register = function(email, password, screenName) {
    $.ajax({
        type : "POST",
        url : MemberLogin.postUrl,
        data : {
            "type" : "register",
            "email" : email,
            "password" : password,
            "screenName" : screenName
        },
        success : function(result) {
            var resultId = Util.getQueryFrom(result, "result");
            if (resultId == 0) {
                if (MemberLogin.onRegisterExist != null)
                    MemberLogin.onRegisterExist();
            } else if (resultId == 1) {
                if (MemberLogin.onRegisterDone != null)
                    MemberLogin.onRegisterDone();
            }
        }
    });
}
//[新使用者透過FB登入後註冊]----------------------------------------------
MemberLogin.fbRegister = function(email, password) {
    $.ajax({
        type : "POST",
        url : MemberLogin.postUrl,
        data : {
            "type" : "fbRegister",
            "email" : email,
            "password" : password,
            "screenName" : MemberLogin.screenName,
            "fbid" : MemberLogin.fbid
        },
        success : function(result) {
            DebugView.trace("fbRegister !! res " + result);
            var resultId = Util.getQueryFrom(result, "result");
            if(resultId==0){
                DebugView.trace("email already used");
            }else{
                DebugView.trace("Login Done!");
            }
        }
    });
}

