/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       20 Sep 2018     Nero
 *
 */
/**	对账单明细导入保存后，自动生成customer deposit，customer，sales order，字段是从SO上获取的，SO是根据前端商城
 * 	订单号找到唯一确定的SO，科目，金额，日期是从对账单明细导入记录上带过来的。
 */
function afterSubmit(type){
	//获取对账单明细导入上的字段的值
	var shopOrderId = nlapiGetFieldValue('custrecord_jinlingso');
	var billDate = nlapiGetFieldValue('custrecord_date');
	var account = nlapiGetFieldValue('custrecord_account');
	var amount = nlapiGetFieldValue('custrecord_amonut');
	nlapiLogExecution('debug', '对账单明细导入上的值', shopOrderId+'|'+billDate+'|'+account+'|'+amount);
	//新建一个customer deposit记录
	var customerDepositRec = nlapiCreateRecord('customerdeposit');
	nlapiLogExecution('debug', '测试', '新建客户存款成功');
	
	//从SO上获取customer和sales order，并设置进去（通过前端商城订单号确定唯一的SO）
	var search = nlapiSearchRecord('salesorder', null, 
			[new nlobjSearchFilter('custbody_inlingso', null, 'is', shopOrderId)], 
			[new nlobjSearchColumn('internalid'),
			 new nlobjSearchColumn('entity')]);
	nlapiLogExecution('debug', 'search', search);
	if(search!= null){
		var soId = search[0].getValue('tranid');
		nlapiLogExecution('debug', 'soId', soId);
		var customer = search[0].getText('entity');
		nlapiLogExecution('debug', 'customer', customer);
		
		customerDepositRec.setFieldValue('salesorder', soId);
		customerDepositRec.setFieldText('customer', customer);
		//设置值
		//设置金额
		customerDepositRec.setFieldValue('payment', amount);
		//设置日期
		customerDepositRec.setFieldValue('trandate', billDate);
		//设置科目
		customerDepositRec.setFieldValue('account', account);
	}
	nlapiSubmitRecord(customerDepositRec);
}
