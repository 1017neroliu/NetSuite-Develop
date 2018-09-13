/**
 * Module Description
 * 
 * Version Date Author Remarks 1.00 09 Aug 2018 Nero
 * 
 */

function fieldChanged(type, name, linenum) {
	// 当输入卷数的时候触发脚本
	if (type == 'item' && name == 'custcol_rolls') {
		// 获得卷数
		var juan = nlapiGetCurrentLineItemValue('item', 'custcol_rolls');
		var linenum = nlapiGetLineItemCount('item');
		for (var i = 1; i <= linenum; i++) {
			var itemId = nlapiGetLineItemValue('item', 'item', i);
			// 获取幅宽
			var fukuan = nlapiGetLineItemValue('item', 'custcol4', i);
			fukuan = parseInt(fukuan.substring(0, fukuan.length - 2));

			var search = nlapiSearchRecord(
					'item',
					null,
					[ new nlobjSearchFilter('internalid', null, 'is', itemId) ],
					[ new nlobjSearchColumn('custitem1') ]);
			if (search != null) {
				// 获取克重
				var g = search[0].getValue('custitem1');
			}
			console.log(g)
			var NW = g / 1000 * fukuan * juan;
			nlapiSetCurrentLineItemValue('item', 'custcol9', NW);
			nlapiSetCurrentLineItemValue('item', 'custcol7', NW + 0.8);
			nlapiSetCurrentLineItemValue('item', 'custcol6', 0.05 * juan);

		}
	}
}
