/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       15 Sep 2018     Nero
 *
 */
function saveRecord(){
	var customerId = nlapiGetFieldValue('entity');
	var customerRec = nlapiLoadRecord('customer', customerId);
	var total = nlapiGetFieldValue('total');
	var exchange_rate = nlapiGetFieldValue('custbody_est_exchange_rate');
	var total_amount = total*exchange_rate;
	var audit_amount = customerRec.getFieldValue('custentity_customer_audit_amount');
	var creditlimit = customerRec.getFieldValue('creditlimit');
	var limit = creditlimit - audit_amount;
	if(total_amount > limit){
		alert('超过信用额度！');
		return false;
	}else{
		return true;
	}
    
}
