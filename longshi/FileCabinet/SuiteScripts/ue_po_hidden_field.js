/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 Dec 2018     Nero
 * 
 */

function beforeLoad(type, form, request){
	if(type == 'view' || type == 'edit'){
		var context = nlapiGetContext();
		var role = context.getRole();
		nlapiLogExecution('error', 'role', role);
		if(role == 1001 || role == 1007){//对销售内销，外销角色隐藏PO上的字段
		nlapiGetLineItemField('item','rate').setDisplayType('hidden');
		nlapiGetLineItemField('item','amount').setDisplayType('hidden');
		nlapiGetLineItemField('item','tax1amt').setDisplayType('hidden');
		nlapiGetLineItemField('item','grossamt').setDisplayType('hidden');
		}
	}
}
