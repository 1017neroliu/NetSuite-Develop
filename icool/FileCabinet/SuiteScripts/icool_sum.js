/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Aug 2018     Nero
 *
 */

/**
 * 累计已开票数量赋值操作（应用到发票信息采集表上） 
 * search所有的发票信息采集表line上的物料id，custcol_line_in_col_item
 * 获取每一种物料对应的数量，custcol_line_in_col_quantity
 * 将不同的发票信息采集表上的同一种类型物料的数量加和，就是累计已开票数量，custcol_fileld_so_line_cum_billed_qua
 */
function afterSubmit(type) {

	if (type == 'view' || type == 'edit') {
		//search所有的发票信息采集表
		var search = nlapiSearchRecord('customtransaction_invoice_data_collect');
		
		if(search != null){
			//遍历search的结果
			for (var i = 1; i <= search.length; i++) {
				//获取每一个发票信息采集表的item行的行数
				var linenum = search.getLineItemCount('item');
				for (var j = 1; j <= linenum; j++) {
					var itemId = nlapiGetLineItemValue('item', 'custcol_line_in_col_item', j);
					var quantity = nlapiGetLineItemValue('item', 'custcol_line_in_col_quantity', j);
				//这个判断条件怎们写
					if(itemId == itemId){
					sum += quantity;
					}
				}
			}
		}
		//获得销售订单id
		var so = nlapiGetFieldValue('custbody_field_in_col_so');
		//加载销售订单记录
		var soRecord = nlapiLoadRecord('salesorder', so);
		//获取销售订单item的行数
		var linenum = soRecord.getLineItemCount('item');
		//遍历so的item行
		for (var a = 1; a <= linenum; a++) {
			//获得item每行的id
			var item = soRecord.getLineItemValue('item', 'item', a);
		
			var search = nlapiSearchRecord('item', null, 
					new nlobjSearchFilter('internalid', null, 'is',item));
			var soQuantity = parseInt(soRecord.getLineItemValue('item','quantity',a));
			var soItemId = soRecord.getLineItemValue('item','custcol_line_in_col_item',a);
			var max = soRecord.getLineItemValue('item','custcol_field_so_line_delivery',a);
		}
		if(itemId == soItemId || sum <= max){
			soRecord.setLineItemValue('custcol_fileld_so_line_cum_billed_qua',sum);
			nlapiSubmitRecord('salesorder');
		}
	}
}
