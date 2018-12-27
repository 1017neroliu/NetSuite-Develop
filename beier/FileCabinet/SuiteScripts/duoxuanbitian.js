//为js数组添加contains方法，后面创建的数组可以直接调用这个方法，这个方法是用来判断数组中是否包含某个值
Array.prototype.contains = function (value) {
    var a = this;
    for (var i = 0; i < a.length; i++) {
        if (a[i] == value) { // 而不是===
            return true;
        }
    }
    return false;
};

//Department 	Chinese (Simplified): 部门
//English (International): Department 	1
//Class 	Chinese (Simplified): 类别
//English (International): Class 	2
//Location 	Chinese (Simplified): 仓库
//English (International): Location 	3

var typemapping = {
    2: 'class',
    1: 'department',
    3: 'location',
    4: 'customer',
    5: 'vendor',
    6: 'employee'
};
var namemapping = {
    'class': '类',
    'department': '部门',
    'location': '地点',
    'customer': '客户',
    'vendor' : '名字',
    'employee' : '名字'
};

function fieldChanged(type, name, linenum) {
    console.log(arguments);
    if (type == 'line') {
        if (name == 'account') {
            if (nlapiGetCurrentLineItemValue('line', 'account')) {
                var custrecord_accounttype = nlapiLookupField('account', nlapiGetCurrentLineItemValue('line', 'account'), 'custrecord_segmentmandatory');
                custrecord_accounttype = custrecord_accounttype.split(',');

                nlapiSetCurrentLineItemValue('line', 'custcol_typecode', custrecord_accounttype.join('|'));
            } else {
                nlapiSetCurrentLineItemValue('line', 'custcol_typecode', "");
            }

        }

    }
}

function validateLine(type) {
    if (type == 'line') {

        var name = ['class', 'department', 'location', 'customer','vendor','employee'];
        for (var j = 0; j < name.length; j++) {
            var custcol_typecode = nlapiGetCurrentLineItemValue('line', 'custcol_typecode');
            custcol_typecode = custcol_typecode.split('|');
            if (custcol_typecode.length) {
                for (var i = 0; i < custcol_typecode.length; i++) {
                    if (name[j] == typemapping[custcol_typecode[i]]) {
                        if (!nlapiGetCurrentLineItemValue('line', name[j])) {
                            alert(namemapping[name[j]] + ' 必填！');
                            return false;
                        }
                    }
                }
            }
        }
    }

    return true;
}
