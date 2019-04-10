/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Jun 2018     Nero
 *
 */

// 需求：当SO表单的一个字段改变，另一个字段基于此字段也做出相应的改变（在保存之前就改变）
function clientFieldChanged(type, name) {
	// name:值发生改变的字段
	nlapiLogExecution('debug', '调试', '999');
	if (name == 'memo') {
		// 获取memo值
		var value = nlapiGetFieldValue('memo');
		nlapiLogExecution('debug', '调试', value);
		// 将上面memo的值赋值给下面的memo
		nlapiSetFieldValue('custbody6', value);
	}
}
