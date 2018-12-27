/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       09 Oct 2018     Nero
 *	
 *	需求：输入日记账明细行上account，从这个account上获取设置必填的值，这些值如果在日记账上没有填，就提示必填！
 *
 */
//为js数组添加contains方法，后面创建的数组可以直接调用这个方法，这个方法是用来判断数组中是否包含某个值
Array.prototype.contains = function (value) {
    var a = this;
    for (var i = 0; i < a.length; i++) {
        if (a[i] == value) { // 不是===
            return true;
        }
    }
    return false;
};


var typemapping = {
    5: 'class',
    4: 'department',
    3: 'location',
    6: 'entity',
    2: 'entity',
    1: 'entity'
};
var namemapping = {
    'class': '类',
    'department': '部门',
    'location': '地点',
    'entity' : '名字'
};
//先取到这些个必填的值，放到一个隐藏的字段中
function fieldChanged(type, name, linenum) {
//    console.log(arguments);
    if (type == 'line' && name == 'account') {
    	var accountId = nlapiGetCurrentLineItemValue('line', 'account');
        if (accountId) {
        	//到account记录中获取必填的字段，获取的值可能是多个，用','分隔开
            var custrecord_accounttype = nlapiLookupField('account', accountId, 'custrecord111');
            nlapiLogExecution('debug', 'custrecord_accounttype', custrecord_accounttype);
            custrecord_accounttype = custrecord_accounttype.split(',');//把custrecord_accounttype用逗号分成字符串数组
            //把值设置进自定义的一个字段中（这个字段设置为隐藏了_typecode）
            nlapiSetCurrentLineItemValue('line', 'custcol6', custrecord_accounttype.join('|'));
        } else {
        	//如果account不存在，就设置为空
            nlapiSetCurrentLineItemValue('line', 'custcol6', "");
        }
    }
}

function validateLine(type) {
    if (type == 'line') {
    	//多选必填的几个值
        var name = ['class', 'department', 'location', 'entity'];
        for (var j = 0; j < name.length; j++) {
        	//获取自定义的字段的值，temp是临时存放从account上获取的必填字段的值
            var temp = nlapiGetCurrentLineItemValue('line', 'custcol6');
            nlapiLogExecution('debug', 'custcol6', temp);
            //用'|'将选中的必填字段分隔开
            temp = temp.split('|');
            //如果temp有长度，即有值，以temp对象的长度为长度遍历，temp是字段映射的ID，1，2，3，4，5，6
            if (temp.length) {
                for (var i = 0; i < temp.length; i++) {
                	//如果name数组中的某一个值等于typemapping数组中的某一个值并且，关键！！！！！
                    if (name[j] == typemapping[temp[i]]) {
                    	//如果这个值不存在，就提示必填
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

