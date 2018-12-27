/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       29 Oct 2018     Nero
 *
 */
//Array.prototype.contains = function (value) {
//    var a = this;
//    for (var i = 0; i < a.length; i++) {
//        if (a[i] == value) { // 不是===
//            return true;
//        }
//    }
//    return false;
//};

//保存inventory item的时候cp号已存在的不能保存
function saveRecord(){
	var zqsb = null;
	//获取cp号
	var cpNumber = nlapiGetFieldValue('custitem_aa');
	nlapiLogExecution('error', 'cpNumber', cpNumber);
	//做一个search，cp号是以“cp2”开头的inventoryitem的记录
	var column = new nlobjSearchColumn('custitem_aa');
	var filter = new nlobjSearchFilter('custitem_aa', null, 'startswith','cp2');
	var search = nlapiSearchRecord('inventoryitem', null, filter, column);
	nlapiLogExecution('error', 'search长度', search.length);
	
	if (search != null) {
		//遍历获取所有的以cp2开头的record
		for (var i = 0; i < search.length; i++) {
			var cpnum = search[i].getValue('custitem_aa');
//			另外一种做法
//			var array = [];
//			array.push(cpnum);
//			var con = array.contains(cpNumber);
			
			nlapiLogExecution('error', 'cpnum', cpnum);
			//如果本次保存的cp号已存在
			if (cpNumber == cpnum) {
				zqsb = false;//定义一个变量为false
			}else {
				zqsb = true;//如果不存在，定义为true
			}
		}
		if(zqsb == false){//如果已再次就返回false，提示，并不给保存
			alert(cpNumber+'已存在，请更换其他cp号！');	
			return false;
		}
		if(zqsb == true){
			return true;
		}
	}
}
