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
			transferRec.setFieldValue('location', dataIn.fromLocation);//转出地点ID
			transferRec.setFieldValue('transferlocation', dataIn.toLocation);//转入地点ID
			if (dataIn.memo) {
				transferRec.setFieldValue('memo', dataIn.memo);//备注，不是必填
			} else {
				transferRec.setFieldValue('memo', " ");
			}

			//请求的数据是json数组，先转换成json对象，再遍历，取值（dataIn就是object类型，不需要用JSON.parse()进行转换）
			var source = dataIn.itemData;
			for (var x = 0; x < source.length; x++) {
				//获取请求的数据，并设置到明细行中
				transferRec.selectNewLineItem('inventory');
				var dataItemId = source[x].itemId;
				var dataQtyToTransfer = source[x].qtyToTransfer;
				
				nlapiLogExecution('error', 'dataItemId', dataItemId);
				nlapiLogExecution('error', 'dataQtyToTransfer', dataQtyToTransfer);
				
				transferRec.setCurrentLineItemValue('inventory', 'item', dataItemId);//货品ID
				transferRec.setCurrentLineItemValue('inventory', 'adjustqtyby',dataQtyToTransfer);//转移货品的数量
				//提交对明细行的操作的数据
				transferRec.commitLineItem('inventory');
			}
			nlapiLogExecution('error', 'source.length', source.length);
			nlapiLogExecution('error', 'dataIn', JSON.stringify(dataIn));
			//提交record？这里为什么提交不了？上面日志都可以正常打印出来
			var transferId = nlapiSubmitRecord(transferRec);
			nlapiLogExecution('error', 'transferId', transferId);
			
			var fromLocation = transferRec.getFieldValue('location');
			var toLocation = transferRec.getFieldValue('transferlocation');
			var memo = transferRec.getFieldValue('memo');
			
			nlapiLogExecution('error', 'fromLocation', fromLocation);
			
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
						"fromLocation" : fromLocation,
						"toLocation" : toLocation,
						"memo" : memo,
						"itemData" : itemobj
					}
					Jsondata.push(data);
				responer = {
						"status" : "success",
						"message" : Jsondata,
					}
				
				writeLog('新建库存转移成功' + transferId,
						 'inventory transfer is created', 
						 user, 
						 scriptId,
						 'OK', 
						 JSON.stringify(dataIn), 
						 JSON.stringify(data)
						 );
				
				return JSON.stringify(responer);
			}else{
				
				writeLog('新建库存转移失败' + transferId,
						 'inventory transfer creation failed', 
						 user,
						 scriptId, 
						 'ERROR', 
						 JSON.stringify(dataIn)
						 );
				
				return {
					"status" : "failure",
					"message" : "创建库存转移记录失败!"
				};
			}
			}
	} catch (e) {
	}
}
