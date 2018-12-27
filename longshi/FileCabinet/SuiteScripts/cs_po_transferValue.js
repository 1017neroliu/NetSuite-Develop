/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       12 Dec 2018     Nero
 *
 */

function fieldChanged(type, name, linenum){
	try {
		if (name == 'item' || name == 'custcol_customer') {
			//获取货品名和客户名
			var item = nlapiGetCurrentLineItemValue('item', 'item');
			var customer = nlapiGetCurrentLineItemValue('item',
					'custcol_customer');
			//从商品编码获取对应的客户商品名称
			var search = nlapiSearchRecord('customrecord211', null, [
					new nlobjSearchFilter('custrecord_system_item', null, 'is',
							item),
					new nlobjSearchFilter('custrecord_cname', null, 'is',
							customer) ], [ new nlobjSearchColumn(
					'custrecord_customer_item') ]);
			if (search != null) {
				var customerName = search[0]
						.getValue('custrecord_customer_item');
				nlapiSetCurrentLineItemValue('item', 'custcol_customer_name',
						customerName);
			}
		}
	} catch (e) {
	}
}
