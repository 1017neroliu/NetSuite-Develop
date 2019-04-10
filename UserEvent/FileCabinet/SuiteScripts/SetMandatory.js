/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Jun 2018     Nero
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
function beforeLoad() {
	//将location字段设置为必填
	//nlapiGetLineItemField('item', 'location').setMandatory(true);
	//将location字段设置为隐藏
	nlapiGetLineItemField('item', 'location').setDisplayType(hidden);
}
