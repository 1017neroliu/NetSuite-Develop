/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       23 Nov 2018     Nero
 *	
 */
//无指令门店配送--创建item receipt
function createItemReceipt(dataIn) {
	//获取context
	var context = nlapiGetContext();
	//获取当前用户名，用于后面写入日志record	
	var user = context.getName();
	//获取当前操作的脚本的id
	var scriptId = context.getScriptId();
	var data;
	var responer;
	var Jsondata = [];
		try {
			if (dataIn) {
				//创建货品收据（item receipt）
				var receiptRec = nlapiTransformRecord('transferorder',dataIn.transferOrderId, 'itemreceipt');
//				receiptRec.setFieldValue('memo', '测试无指令接口');

				var receiptId = nlapiSubmitRecord(receiptRec);
				nlapiLogExecution('error', 'receiptId', receiptId);

				var createdFrom = receiptRec.getFieldValue('createdfrom');
				var num = receiptRec.getLineItemCount('item');
				var itemobj = [];
				for (var i = 1; i <= num; i++) {
					var item = receiptRec.getLineItemValue('item', 'itemname',i);
					var quantity = receiptRec.getLineItemValue('item',
							'quantity', i);
					itemobj.push({
						"item" : item,
						"quantity" : quantity
					});
				}

				if (receiptId) {
					data = {
						"itemData" : itemobj
					}
					Jsondata.push(data);
					responer = {
						"status" : "success",
						"message" : Jsondata
					}
					
					writeLog('新建货品收据单' + receiptId, 
							'item receipt is created',
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
			writeLog('创建记录失败', 
					 e.message, 
					 user,
					 scriptId, 
					 'ERROR', 
					 JSON.stringify(dataIn)
					 );
			
			return {
				"status" : "failure",
				"message" : "创建入库单失败！",
				"reason" : e.message
			};
		}
}
