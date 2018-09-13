/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Sep 2018     Nero
 *
 */

function afterSubmit(type){
	
	var soId = nlapiGetFieldValue('salesorder');
	var soRec = nlapiLoadRecord('salesorder', soId);
	var non_tt = 0;
	var search = nlapiSearchRecord('customerdeposit', null, 
			[new nlobjSearchFilter('salesorder', null, 'is', soId)],
			[new nlobjSearchColumn('custbody_deposit_undeposit_amount')]);
	nlapiLogExecution('debug', 'search长度', search.length);
	if(search != null){
		for (var i = 0; i < search.length; i++) {
			var undeposit_amount = search[i].getValue('custbody_deposit_undeposit_amount');
			nlapiLogExecution('debug', 'undeposit_amount', undeposit_amount);
			non_tt += parseFloat(undeposit_amount);
		}
	}
	nlapiLogExecution('debug', 'non_tt', non_tt);
	soRec.setFieldValue('custbody_so_amount_remaining_non_tt', non_tt);
	nlapiSubmitRecord(soRec);
}
