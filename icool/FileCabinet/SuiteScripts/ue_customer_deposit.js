/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Sep 2018     Nero
 *
 */
function beforeSubmit(type){
	if(type == 'create'){
		var payment = nlapiGetFieldValue('payment');
		nlapiSetFieldValue('custbody_deposit_undeposit_amount', payment);
	}
}

//create deposit不apply的时候保存触发的脚本，设置非前TT预付款余额的值
function afterSubmit(type){
	//未apply取非前TT
	var soId = nlapiGetFieldValue('salesorder');
	nlapiLogExecution('debug', 'soId', soId);
	var soRec = nlapiLoadRecord('salesorder', soId);
	var non_tt = 0;
	var search = nlapiSearchRecord('customerdeposit', null, 
			[new nlobjSearchFilter('salesorder', null, 'is', soId)],
			[new nlobjSearchColumn('custbody_deposit_undeposit_amount')]);
	if(search != null){
		var customer_type = nlapiGetFieldValue('custbody_deposit_type');
		//===========这个条件后面可能还会更改，标记一下==========非前TT
		if(customer_type == '2'){
		for (var i = 0; i < search.length; i++) {
			/**这一步获取值的时候获取不到，因为这个值是点击保存按钮后才会生成这个值，所以edit的时候再次保存才会取到这个值
			 * 解决方案：写一个beforesubmit，先把payment的值传给未应用金额，在保存之前就赋值
			 */
			var undeposit_amount = search[i].getValue('custbody_deposit_undeposit_amount');
			nlapiLogExecution('debug', 'undeposit_amount', undeposit_amount);
			non_tt += parseFloat(undeposit_amount);
		}
		soRec.setFieldValue('custbody_so_amount_remaining_non_tt', non_tt);
		}
	}else {
		soRec.setFieldValue('custbody_so_amount_remaining_non_tt', non_tt);
	}
	nlapiSubmitRecord(soRec);
}
