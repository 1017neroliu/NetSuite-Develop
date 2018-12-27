/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 Sep 2018     Nero
 *
 */

function setClass(type, name, linenum){
	if(name == 'item'){
		nlapiLogExecution('debug', 'soClass', '1');
		var soClass = nlapiGetFieldValue('class');
		nlapiLogExecution('debug', 'soClass', soClass);
		nlapiSetCurrentLineItemValue('item', 'class', soClass);
	}
}
