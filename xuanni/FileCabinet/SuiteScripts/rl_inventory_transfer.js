/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Nov 2018     Nero
 *	采购退货
 */
//丽晶调用库存转移接口。
function createInventoryTransfer(dataIn) {
	//获取context
	var context = nlapiGetContext();
	//获取当前用户名，用于后面写入日志record
	var user = context.getName();
	//获取当前操作的脚本的id
	var scriptId = context.getScriptId();

	try {
		if (dataIn) {
			var data;
			var responer;
			var Jsondata = [];
			//创建库存转移
			var transferRec = nlapiCreateRecord('inventorytransfer');
			//获取请求的数据，并设置body上的字段值
			//获取location的code，转成location的id
			nlapiLogExecution('error', 'dataIn.fromLocationCode', dataIn.fromLocationCode);
			nlapiLogExecution('error', 'dataIn.toLocationCode', dataIn.toLocationCode);
//			var fLsearch = nlapiSearchRecord(null, 279, 
//					new nlobjSearchFilter('custrecord_locationid', null, 'is',dataIn.fromLocationCode));
//			var fromLocation2 = fLsearch[0].getId();
//			var tLsearch = nlapiSearchRecord(null, 279, 
//					new nlobjSearchFilter('custrecord_locationid', null, 'is',dataIn.toLocationCode));
//			var toLocation2 = tLsearch[0].getId();
			
			var fLsearch = nlapiSearchRecord('location', null,
					[new nlobjSearchFilter('custrecord_locationid', null, 'is',dataIn.fromLocationCode)]);
			if (fLsearch != null) {
				var fromLocation2 = fLsearch[0].getId();
				nlapiLogExecution('error', 'fromLocation2', fromLocation2);
			}
			var tLsearch = nlapiSearchRecord('location', null,
					[new nlobjSearchFilter('custrecord_locationid', null, 'is',dataIn.toLocationCode)]);
			if (tLsearch != null) {
				var toLocation2 = tLsearch[0].getId();
				nlapiLogExecution('error', 'toLocation2', toLocation2);
			}
//			for (var i = 0; i < fLresults.length; i++) {
//				var cols = fLresults[i].getAllColumns();
//				var locationCode = fLresults[i].getValue(cols[5]);
//				
//				if(locationCode == dataIn.fromLocationCode){
//					var fromLocation2 = fLresults[i].getId();
//				}
//				if(locationCode == dataIn.toLocationCode){
//					var toLocation2 = fLresults[i].getId();
//				}
//			}
//			var tLsearch = nlapiSearchRecord(null, 279);
//			tLsearch.addFilter(new nlobjSearchFilter('custrecord_locationid', null, 'is',dataIn.toLocationCode));
//			var tLresults = tLsearch.runSearch();
//			if (tLsearch != null) {
//				var toLocation2 = tLsearch[0].getId();
//			}
			transferRec.setFieldValue('custbody_lijing_recordid', dataIn.orderId);//丽晶单据ID
			transferRec.setFieldValue('location', fromLocation2);//起始地点ID
			transferRec.setFieldValue('transferlocation', toLocation2);//截止地点ID
			//备注
			if (dataIn.memo) {
				transferRec.setFieldValue('memo', dataIn.memo);//备注，不是必填
			} else {
				transferRec.setFieldValue('memo', " ");
			}

			//请求的数据是json字符串数组，先转换成json对象数组，再遍历，取值（dataIn就是object类型，不需要用JSON.parse()进行转换）
			var source = dataIn.itemData;
			for (var x = 0; x < source.length; x++) {
				//获取请求的数据，并设置到明细行中
				transferRec.selectNewLineItem('inventory');
				var dataItemCode = source[x].itemCode;
				var dataQtyToTransfer = source[x].qtyToTransfer;
				nlapiLogExecution('error', 'dataItemCode',dataItemCode);
				var search = nlapiSearchRecord('item', null,
						[new nlobjSearchFilter('itemid', null, 'is',dataItemCode)]);
				nlapiLogExecution('error', 'search', search);
				if (search != null) {
					var itemId2 = search[0].getId();
					nlapiLogExecution('error', 'itemId2', itemId2);
				}
				
//				nlapiLogExecution('error', 'dataItemCode', dataItemCode);
//				nlapiLogExecution('error', 'dataQtyToTransfer', dataQtyToTransfer);
				
				transferRec.setCurrentLineItemValue('inventory', 'item', itemId2);//货品ID
				transferRec.setCurrentLineItemValue('inventory', 'adjustqtyby',dataQtyToTransfer);//转移货品的数量
				//提交对明细行的操作的数据
				transferRec.commitLineItem('inventory');
			}
//			nlapiLogExecution('error', 'source.length', source.length);
//			nlapiLogExecution('error', 'dataIn', JSON.stringify(dataIn));
			//提交record？这里为什么提交不了？上面日志都可以正常打印出来
			var transferId = nlapiSubmitRecord(transferRec);
//			nlapiLogExecution('error', 'transferId', transferId);
			
			var fromLocation = transferRec.getFieldValue('location');
			var toLocation = transferRec.getFieldValue('transferlocation');
			var memo = transferRec.getFieldValue('memo');
			
//			nlapiLogExecution('error', 'fromLocation', fromLocation);
			
			//获取明细行上的货品的id和数量
			var num = transferRec.getLineItemCount('inventory');
			var itemobj = [];
			for (var i = 1; i <= num; i++) {
				var itemId = transferRec.getLineItemValue('inventory', 'item', i);
				var qtyToTransfer = transferRec.getLineItemValue('inventory', 'adjustqtyby', i);
				itemobj.push({
					"itemId" : itemId,
					"qtyToTransfer" : qtyToTransfer
				});
			}
			
			if(transferId){
				data = {
						"fromlocationCode" : fromLocation,
						"toLocationCode" : toLocation,
						"memo" : memo,
						"itemData" : itemobj
					}
					Jsondata.push(data);
				responer = {
						"status" : "success",
						"message" : Jsondata
					}
				
				writeLog('新建库存转移' + transferId,
						 'inventory transfer is created', 
						 user, 
						 scriptId,
						 'OK', 
						 JSON.stringify(dataIn), 
						 JSON.stringify(data)
						 );
				
				return JSON.stringify(responer);
			}
		}
	} catch (e) {
		
		writeLog('新建库存转移',
				 e.message, 
				 user,
				 scriptId, 
				 'ERROR', 
				 JSON.stringify(dataIn)
				 );
		
		return {
			"status" : "failure",
			"message" : "采购退货失败!",
			"reason" : e.message
		};
	}
}
