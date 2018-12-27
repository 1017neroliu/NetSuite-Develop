/**
 * Module Description
 * 
 * Version 		Date 		Author 	Remarks 
 * 1.00 	09 Aug 2018 	Nero
 * 
 */
function fieldChanged(type, name, linenum) {
	// 当输入卷数的时候触发脚本
	if (type == 'item' && name == 'custcol_rolls') {
		// 获得卷数
		var juan = parseFloat(nlapiGetCurrentLineItemValue('item', 'custcol_rolls'));
		//获取触发事件的行号，方便后面取item的值
		var i = nlapiGetCurrentLineItemIndex('item');
		nlapiLogExecution('error', '行号', i);
		// 获取幅宽
		var fukuan = parseFloat(nlapiGetCurrentLineItemValue('item', 'custcol4'));
//		fukuan = parseFloat(fukuan.substring(0, fukuan.length - 2));
		nlapiLogExecution('error', 'fukuan', fukuan);
		//遍历item行，获取item的ID，加载货品，获取系数，使用nlapiGetCurrentLineItemValue不能够获取item的ID
			var itemId = nlapiGetLineItemValue('item', 'item',i);
			var quantity = parseFloat(nlapiGetCurrentLineItemValue('item', 'quantity'));
			var category = nlapiGetLineItemValue('item','class',i);
			
			nlapiLogExecution('error', 'quantity', quantity);
			nlapiLogExecution('error', 'itemId',itemId);
			
			var itemRec = nlapiLoadRecord('lotnumberedinventoryitem', itemId);
			var coefficient = parseFloat(itemRec.getFieldValue('custitem_volume_factor'));
			var volume = parseFloat(itemRec.getFieldValue('custitem_volume'));
			
			nlapiLogExecution('debug', 'coefficient', coefficient);
			nlapiLogExecution('debug', 'volume', volume);
			//通过search获取克重
			var search = nlapiSearchRecord('item',null,
					[ new nlobjSearchFilter('internalid', null, 'is', itemId) ],
					[ new nlobjSearchColumn('custitem1') ]);
			if (search != null) {
				// 获取克重
				var g = parseFloat(search[0].getValue('custitem1'));
				nlapiLogExecution('error', 'g', g);
		}
//	}
//}
			var NW = 0;
			var GW = 0;
			var V = 0;
			if(category == "133"){//当class为面料的时候，计算公式如下
			//计算NW（净重）
			NW = (g / 1000 )* (fukuan / 100 )* quantity;
			GW = NW + coefficient * juan;
			V = volume * juan;
			nlapiLogExecution('debug', 'NW', NW);
			//设置NW，GW，体积
			nlapiSetCurrentLineItemValue('item', 'custcol9', NW);
			nlapiSetCurrentLineItemValue('item', 'custcol7', GW);
			nlapiSetCurrentLineItemValue('item', 'custcol6', V);
			}
			if(category == "132"){//当class为窗帘的时候，计算公式如下，其他类型自己手动输入值
				NW = coefficient * juan;
				var GW = NW + juan;
				var V = 0.052 * juan;
				nlapiSetCurrentLineItemValue('item', 'custcol9', NW);
				nlapiSetCurrentLineItemValue('item', 'custcol7', GW);
				nlapiSetCurrentLineItemValue('item', 'custcol6', V);
			}
	}
	
}