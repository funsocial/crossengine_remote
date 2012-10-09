function FormValidate() {
};
FormValidate.validate = function(datas) {

    var ruleRegex = /^(.+)\[(.+)\]$/, 
    numericRegex = /^[0-9]+$/, 
    integerRegex = /^\-?[0-9]+$/, 
    decimalRegex = /^\-?[0-9]*\.?[0-9]+$/, 
    emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/,
    passRegex = /^[a-zA-Z0-9!@#$*%]{8,20}$/;
    
    var len = datas.length;

    var errorList = [];

    for (var s = 0; s < len; s++) {
        //alert(datas[s].value)
        var checkVal = FormValidate.trim(datas[s].value);
        var checkType = datas[s].type;
        var hasError = false;
        if (checkType.indexOf("empty") > -1) {
            if (checkVal == "") {
                errorList.push(datas[s].error);
            }
        }
        if (checkType.indexOf("password") > -1) {
            if (!passRegex.test(checkVal)) {
                errorList.push(datas[s].error);
            }
        }
        if (checkType.indexOf("email") > -1) {
            if (!emailRegex.test(checkVal)) {
                errorList.push(datas[s].error);
            }
        }
        if (checkType.indexOf("same") > -1) {
            if(datas[s].sameOn != checkVal){
                errorList.push(datas[s].error);
            }
        }
    }
    
    var output = "";

    if (errorList.length > 0) {
        for (var s = 0; s < errorList.length; s++) {
            output += errorList[s]+"\n";
        }

    }

    return output;

}

FormValidate.trim = function(val) {
    return val.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
