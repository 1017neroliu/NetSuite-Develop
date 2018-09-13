/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       31 Aug 2018     Nero
 *
 */

function afterSubmit(type){
	//
  var soId = nlapiGetFieldValue('createdfrom');
  var search = nlapiSearchRecord('salesorder', null, 
			new nlobjSearchFilter('internalid', null, 'is',soId));
  if(search != null){
  var soRec = nlapiLoadRecord('salesorder', soId);
  var num = soRec.getLineItemCount('item');
  var Tsasc = 0;
  for (var i = 1; i <= num; i++) {
	var item = soRec.getLineItemValue('item', 'item', i);
	
	var fulfilled = parseFloat(soRec.getLineItemValue('item', 'quantityfulfilled', i));
	var quantity = parseFloat(soRec.getLineItemValue('item', 'quantity', i));
	var gross = parseFloat(soRec.getLineItemValue('item', 'grossamt', i));
	
	var sasc = (fulfilled/quantity)*gross;
	Tsasc += sasc;
}
//  var rate = parseFloat(soRec.getFieldValue('exchangerate'));
//  var as = Tsasc*rate;
//  soRec.setFieldValue('custbody_so_amount_shipped_currency', Tsasc);
  soRec.setFieldValue('custbody_so_amount_shipped', Tsasc);
  nlapiSubmitRecord(soRec);
  }
}
