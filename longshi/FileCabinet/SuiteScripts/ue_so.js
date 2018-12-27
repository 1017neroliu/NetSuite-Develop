/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 Dec 2018     Nero
 *	
 * 选择某个模板，隐藏明细行上的字段
 */

function beforeLoad(type, form, request){
	if(type == 'view' || type == 'edit'){
		var context = nlapiGetContext();
		var role = context.getRole();
		nlapiLogExecution('error', 'role', role);
		if(role == 1002){//对龙石外销（采购）角色隐藏字段
		nlapiGetLineItemField('item','rate').setDisplayType('hidden');
		nlapiGetLineItemField('item','amount').setDisplayType('hidden');
		nlapiGetLineItemField('item','tax1amt').setDisplayType('hidden');
		nlapiGetLineItemField('item','grossamt').setDisplayType('hidden');
		}
	}
}
