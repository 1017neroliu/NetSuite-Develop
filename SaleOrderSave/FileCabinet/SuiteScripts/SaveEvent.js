/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       21 Jun 2018     Nero
 *
 */

/**
 * 思路： 
 * 获取子列表每一行的行号 
 * 获取每一行的QUANTITY字段对应的值 
 * 以键值对的形式存入map集合 
 * 将QUANTITY对应字段的值赋值给新增字段的值
 * 
 */

// 保存后新增字段改变
function userEventBeforeSubmit(type) {
	// 创建销售订单的时候执行
	if (type == 'create' || type == 'edit') {
		// 获取子列表行的数量
		var lineNum = nlapiGetLineItemCount('item');
		// 遍历数组将子列表的每一行的QUANTITY字段对应的值放入数组中
		for (var i = 1; i <= lineNum; i++) {
			// 获取某一行的QUANTITY字段对应的值
			var quantity = nlapiGetLineItemValue('item', 'quantity', i);
			// 将QUANTITY的字段值赋值给新增字段的值
			nlapiSetLineItemValue('item', 'custcol201806141521', i, quantity);
		}
	}
}
