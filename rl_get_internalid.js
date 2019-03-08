/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       03 Jan 2019     Nero
 *	弃用！和丽晶协商，要么丽晶的code和NS的id保持一致，以哪个为基准？
 *	目前商量的两种方案：
 *	1.丽晶将NS系统中的这些没有code的字段的id作为他们的字段的code，然后传code，需要手动维护
 *	2.如果不想手动维护，那么只有调接口，获取internalID，然后丽晶那边做映射，总之，如果不想手动维护，就要调这个接口
 *	
 *	不用！1.11will与丽晶周旭东商议，客户和location传code，location新增字段存储丽晶code，转移类型，订单类型，
 *	付款方式是list，不能新增字段存储丽晶code，丽晶方手动维护，把NS的id维护到丽晶系统中。
 */
//获取客户，付款方式，location，转移类型，订单类型的ID接口，解决丽晶没有办法解决传递id的问题，以及解决后期增加数据的维护问题
function getId(datain) {
	var responer;
	//获取context
	var context = nlapiGetContext();
	//获取当前用户名，用于后面写入日志record	
	var user = context.getName();
	//获取当前操作的脚本的id
	var scriptId = context.getScriptId();
	//请求的类型是什么就调用相应的方法
	//客户（店铺）
	if (datain.type=='customer')
			responer = getCustomerId();
	//付款方式
	  	else if (datain.type=='paymentMethod')
	  		responer = getPaymentMethodId();
	//location 
	    else if (datain.type=='location')
	    	responer = getLocationId();
	//转移类型
	    else if (datain.type=='transferType')
	    	responer = getTransferTypeId();
	//订单类型
	    else if (datain.type=='orderType')
	    	responer = getOrderTypeId();
	
		return JSON.stringify(responer);
}

//获取客户id
function getCustomerId() {
	var customerSearch = nlapiSearchRecord(null, 278);
	if(customerSearch != null){
	var jsondata = [];
	for (var i = 0; i < customerSearch.length; i++) {
		var customerId = customerSearch[i].getId();
		var customerName = customerSearch[i].getValue('altname');
		nlapiLogExecution('error', 'customerId', customerId);
		var customer = {
				"customerId": customerId,
		        "customerName": customerName
		};
		jsondata.push(customer);
		}
		var responer = {
			"response" : jsondata
		}
		return responer;
	}
}

//获取付款方式id
function getPaymentMethodId(){

	var paymentMethodSearch = nlapiSearchRecord(null, 280);
	if(paymentMethodSearch != null){
	var jsondata = [];
	for (var i = 0; i < paymentMethodSearch.length; i++) {
		var paymentMethodId = paymentMethodSearch[i].getId();
		var paymentMethodName = paymentMethodSearch[i].getValue('name');
		var paymentMethod = {
				"paymentMethodId": paymentMethodId,
		        "paymentMethodName": paymentMethodName
		};
		jsondata.push(paymentMethod);
		}
		var responer = {
			"response" : jsondata
		}
		return responer;
	}

}

//获取location的id
function getLocationId(){

	var locationSearch = nlapiSearchRecord(null, 279);
	if(locationSearch != null){
	var jsondata = [];
	for (var i = 0; i < locationSearch.length; i++) {
		var locationId = locationSearch[i].getId();
		var locationName = locationSearch[i].getValue('name');
		var location = {
				"locationId": locationId,
		        "locationName": locationName
		};
		jsondata.push(location);	
		}
		var responer = {
			"response" : jsondata
		}
		return responer;
	}
}

//获取转移类型id
function getTransferTypeId(){

	var transferTypeSearch = nlapiSearchRecord(null, 281);
	if(transferTypeSearch != null){
	var jsondata = [];
	for (var i = 0; i < transferTypeSearch.length; i++) {
		var transferTypeId = transferTypeSearch[i].getId();
		var transferTypeName = transferTypeSearch[i].getValue('name');
		var transferType = {
				"transferTypeId": transferTypeId,
		        "transferTypeName": transferTypeName
		};
		jsondata.push(transferType);	
		}
		var responer = {
			"response" : jsondata
		}
		return responer;
	}

}

//获取订单类型id
function getOrderTypeId(){
	
	var orderTypeSearch = nlapiSearchRecord(null, 277);
	if(orderTypeSearch != null){
	var jsondata = [];
	for (var i = 0; i < orderTypeSearch.length; i++) {
		var orderTypeId = orderTypeSearch[i].getId();
		var orderTypeName = orderTypeSearch[i].getValue('name');
		var orderType = {
				"orderTypeId": orderTypeId,
		        "orderTypeName": orderTypeName
		};
		jsondata.push(orderType);	
		}
		var responer = {
			"response" : jsondata
		}
		return responer;
	}
}
