<?php 
    
    function DBConnect(){
        $dblink = mysql_connect("localhost","root","zaq1XSW@") OR die(mysql_error());;
        $db = mysql_select_db("funmobi",$dblink);
        mysql_query("SET NAMES utf8");
        return $dblink;
    }
    
    function DBClose($dblink){
        mysql_close($dblink);
    }
    
    function sameDomainPost($requestURI){
        $requestURI = str_replace("http://","",$requestURI);
        $requestURI = str_replace("www.","",$requestURI);
        $pos1 = strrpos($requestURI, "pipekingdom.dyndns.info/cross/");
        $pos2 = strrpos($requestURI, "localhost");
        if ($pos1 === false && $pos2 === false) {
            return false;
        }
        return true;
    }
    
    function uniqueID($uid){
        return uniqid($uid,true);
    }

    //make sure mysql timezone is set 
    //SELECT @ @global.time_zone , @ @session.time_zone
    //SET GLOBAL time_zone = 'Asia/Taipei';
    
?>
