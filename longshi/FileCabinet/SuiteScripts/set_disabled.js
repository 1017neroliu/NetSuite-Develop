/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       09 Aug 2018     Nero
 *
 */

function beforeLoad(type, form, request){
	if(type == 'view' || type == 'edit'){
		nlapiLogExecution('debug', '测试', '123');
		nlapiGetLineItemField('item','custcol7').setDisplayType('disabled');
		nlapiGetLineItemField('item','custcol9').setDisplayType('disabled');
		nlapiGetLineItemField('item','custcol6').setDisplayType('disabled');
	}
}
