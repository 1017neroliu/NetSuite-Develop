/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       10 Sep 2018     Nero
 *
 */

function setLocation(type, name, linenum){
	if(name == 'item'){
		var location = nlapiGetFieldValue('location');
		nlapiSetCurrentLineItemValue('item', 'location', location);
	}
}
