/**
 * 有指令的门店配送
 * 丽晶调用云合提供的3个接口，分别是转账订单，货品实施情况和货品收据接口。
 * 货品收据--item receipt
 * （transfer order/item fulfillment/item receipt）
 * @param dataIn
 * @returns
 */
function createItemReceipt(dataIn) {
	//获取context
	var context = nlapiGetContext();
	//获取当前用户名，用于后面写入日志record	
	var user = context.getName();
	//获取当前操作的脚本的id
	var scriptId = context.getScriptId();
		if (dataIn) {
			var data;
			var responer;
			//创建货品收据（item receipt）
			var receiptRec;
			try {
				receiptRec = nlapiTransformRecord('transferorder',
						dataIn.transferOrderId, 'itemreceipt');
				receiptRec.setFieldValue('memo', '测试接口');
				//当item receipt保存后，return authorisation的状态会自动变成pending refund状态
				var receiptId = nlapiSubmitRecord(receiptRec);
				nlapiLogExecution('error', 'receiptId', receiptId);
				if (receiptId) {
					
					responer = {
							"status" : "success",
							"message" : "创建货品收据成功！"
						}
						return JSON.stringify(responer);

					writeLog('创建货品收据单' + receiptId, 
							'item receipt is created',
							user, 
							scriptId, 
							'OK', 
							JSON.stringify(dataIn), 
							JSON.stringify(data));

				}
			} catch (e) {

				writeLog('新建货品收据单', 
						'item receipt creation failed', 
						user,
						scriptId, 
						'ERROR', 
						JSON.stringify(dataIn));

				return {
					"status" : "failure",
					"message" : "创建货品收据单失败!",
					"reason" : e.message
				};
			}
		}
}
