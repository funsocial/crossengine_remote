<?php
    
    require_once("setting.php");
    $requestURI = $_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
    if(sameDomainPost($requestURI)==false){echo "error=cross posting";return;}

    $type = $_POST["type"];
    
    //[初始頁面自動登入檢查]----------------------------------------------
    if($type=="checkInitLogin"){
            
        if(isset($_COOKIE["autoId"])){
            //檢查是否有cookie 先前登入過
            echo "result=1&autoId=".$_COOKIE["autoId"]."&screenName=".$_COOKIE["screenName"];
        }else if(isset($_POST["fbid"])){
            //檢查是否有fbid，已登入Facebook
            $fbid = $_POST["fbid"];
            if($fbid!=""){
                $dblink = DBConnect();
                $autoId = null;
                $screenName = null;
                $query = sprintf("SELECT * FROM userdata WHERE fbid = '%s' ",
                                    mysql_real_escape_string($fbid));
                $result = mysql_query($query) or die(mysql_error());
                while($row = mysql_fetch_array($result)){
                    $autoId = $row['autoId'];
                    $screenName = $row['screenname'];
                }
                DBClose($dblink);
                setcookie("screenName", $screenName, time()+2592000);
                setcookie("autoId", $autoId, time()+2592000);
                echo "result=1&autoId=".$autoId."&screenName=".$screenName;
            }else{
                echo "result=0";
            }
        }else{
            echo "result=0";
        }
         
    }
    
    //[使用者透過表單登入]----------------------------------------------
    if($type=="basicLogin"){
        $email = $_POST["email"];
        $password = $_POST["password"];
        $dblink = DBConnect();
        $query = sprintf("SELECT * FROM userdata WHERE email = '%s' AND password = '%s' ",
                            mysql_real_escape_string($email),
                            mysql_real_escape_string($password));
        $result = mysql_query($query) or die(mysql_error());
        $recordCount = 0;
        while($row = mysql_fetch_array($result)){
            $recordCount = 1;
            setcookie("screenName", $row['screenname'], time()+2592000);
            setcookie("autoId", $row['autoId'], time()+2592000);
        }
        DBClose($dblink);
        echo "result=".$recordCount;
    }
    
    //[新增使用者]----------------------------------------------
    if($type=="register"){
            
        $email = $_POST["email"];
        $password = $_POST["password"];
        $screenName = $_POST["screenName"];
        
        $dblink = DBConnect();
        $query = sprintf("SELECT COUNT(*) as count FROM userdata WHERE email = '%s' ",
                            mysql_real_escape_string($email));
        //echo $query;
        $result = mysql_query($query) or die(mysql_error());
        while($row = mysql_fetch_array($result)){
            $recordCount = $row['count'];
        }
        //user exist already, return;
        if($recordCount>0){
            echo "result=0";
            DBClose($dblink);
            return;
        }
        
        //if user does not exist in DB, insert
        $query = sprintf("  INSERT INTO userdata(email, password, screenname) 
                            VALUES ('%s', '%s', '%s') ", 
                            mysql_real_escape_string($email),
                            mysql_real_escape_string($password),
                            mysql_real_escape_string($screenName));
        $result = mysql_query($query) or die(mysql_error());
        DBClose($dblink);
        echo "result=1";
    }
    
    //[新增FB帳號使用者]----------------------------------------------
    if($type=="fbRegister"){
            
        $email = $_POST["email"];
        $password = $_POST["password"];
        $screenName = $_POST["screenName"];
        $fbid = $_POST["fbid"];
        
        $dblink = DBConnect();
        $query = sprintf("SELECT COUNT(*) as count FROM userdata WHERE email = '%s' ",
                            mysql_real_escape_string($email));
        $recordCount = 0;
        $result = mysql_query($query) or die(mysql_error());
        while($row = mysql_fetch_array($result)){
            $recordCount = $row['count'];
        }
        
        //user exist already, return;
        if($recordCount>0){
            echo "result=0";
            DBClose($dblink);
            return;
        }
        
        //if user does not exist in DB, insert
        $query = sprintf("  INSERT INTO userdata(email, password, screenname, fbid) 
                            VALUES ('%s', '%s', '%s', '%s') ", 
                            mysql_real_escape_string($email),
                            mysql_real_escape_string($password),
                            mysql_real_escape_string($screenName),
                            mysql_real_escape_string($fbid));
        $result = mysql_query($query) or die(mysql_error());
        DBClose($dblink);
        echo "result=1";
    }
    
    //[檢查FB帳號是否存在，FB登入後使用]----------------------------------------------
    if($type=="checkFBLoginExist"){
        $fbid = $_POST["fbid"];
        $dblink = DBConnect();
        $recordCount = 0;
        $autoId = null;
        $query = sprintf("SELECT * FROM userdata WHERE fbid = '%s' ",
                            mysql_real_escape_string($fbid));
        $result = mysql_query($query) or die(mysql_error());
        while($row = mysql_fetch_array($result)){
            $recordCount = 1;
            $autoId = $row['autoId'];
        }
        echo "result=".$recordCount."&autoId=".$autoId;
        DBClose($dblink);
    }
    
    if($type=="loginSetCookie"){
        $screenName = $_POST["screenName"];
        $autoId = $_POST["autoId"];
        setcookie("screenName", $screenName, time()+2592000);
        setcookie("autoId", $autoId, time()+2592000);
    }
    
    
?>