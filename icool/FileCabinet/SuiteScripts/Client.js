/**
 * Module Description
 * 
 * Version    Date      Author   Remarks 
 * 1.00    03 Aug 2018  Nero
 * 
 */
// 根据子列表手动输入的值计算总值
function fieldChanged(type, name, linenum) {

	if (name == 'custcol_line_in_col_quantity' || name == 'custcol_line_in_col_rate') {
		// 获得销售订单id
		var so = nlapiGetFieldValue('custbody_field_in_col_so');
		// 加载销售订单记录
		var soRecord = nlapiLoadRecord('salesorder', so);
		var totalVol2 = 0;
		var Price2 = 0;

		// 获得字段改变行的line的id
		var line = nlapiGetCurrentLineItemValue('line','custcol_line_in_col_item');
	
		var search = nlapiSearchRecord('item', null, 
				[new nlobjSearchFilter('internalid', null, 'is', line)], 
				[new nlobjSearchColumn('custitem_field_item_long'),
				new nlobjSearchColumn('custitem_field_item_wide'),
				new nlobjSearchColumn('custitem_field_item_high')]);
		if (search != null) {
			var long = search[0].getValue('custitem_field_item_long');
			var width = search[0].getValue('custitem_field_item_wide');
			var height = search[0].getValue('custitem_field_item_high');
		}
		var num = soRecord.getLineItemCount('item');
		for (var i = 1; i < num; i++) {
			var quantity = parseInt(soRecord.getLineItemValue('item','quantity', i));
		}

		// 获得当前行的值（当前行，触发字段改变的这个当前行）
		var quan = nlapiGetCurrentLineItemValue('line','custcol_line_in_col_quantity');
		var price = parseInt(nlapiGetCurrentLineItemValue('line','custcol_line_in_col_rate'));
		if (quan <= quantity) {
			// 计算总体积
			var totalVol1 = long * width * height * quan;
			
			// 每行的总价格
			var Price1 = price * quan;
			// 设置当前行的值
			nlapiSetCurrentLineItemValue('line','custcol_line_in_col_grossamt', Price1);
			nlapiSetCurrentLineItemValue('line','custcol_field_line_in_col_vol', totalVol1);
			// 获取没有改变的体积和价格
			var num = nlapiGetLineItemCount('line');
			for (var j = 1; j <= num; j++) {
				var lineId = nlapiGetLineItemValue('line','custcol_line_in_col_item', j);
				if (lineId != line) {
					Price2 = parseInt(nlapiGetLineItemValue('line','custcol_line_in_col_grossamt', j));
					totalVol2 = parseInt(nlapiGetLineItemValue('line','custcol_field_line_in_col_vol', j));
				}
			}
			var Price = Price1 + Price2;
			var totalVol = totalVol1 + totalVol2;
			
			nlapiLogExecution('debug', '改变金额', Price1);
			nlapiLogExecution('debug', '不改变金额', Price2);
			nlapiLogExecution('debug', '总金额', Price);
			nlapiLogExecution('debug', '改变体积', totalVol1);
			nlapiLogExecution('debug', '不改变体积', totalVol2);
			nlapiLogExecution('debug', '总体积', totalVol);
			// 设置总体积和总金额
			nlapiSetFieldValue('custbody_field_in_col_volume', totalVol);
			nlapiSetFieldValue('custbody_field_in_col_amt', Price);
		}
		if (quan > quantity) {
			alert("您输入的值有误，请重新输入！");
		}
	}
}