/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Oct 2018     Nero
 *
 */
function beforeSubmit(type){
	var num = nlapiGetLineItemCount('item');
	for (var i = 1; i <= num; i++) {
		var itemId = nlapiGetLineItemValue('item', 'item', i);
		var itemRec = nlapiLoadRecord('inventoryitem', itemId);
		var upccode = itemRec.getFieldValue('upccode');
		nlapiLogExecution('debug', 'upccode', upccode);
		nlapiSetLineItemValue('item', 'description', i, 'UPC CODE:'+upccode+'.');
	}
}

function beforeLoad(type,form){
	if(type == 'view' || type == 'edit'){
		nlapiGetField('custbody_checked').setDisplayType('disabled');
	}
}