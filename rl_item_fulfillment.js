/**
 * 有指令的门店配送
 * 丽晶调用云合提供的3个接口，分别是转账订单，货品实施情况和货品收据接口。
 * 货品实施情况--item fulfillment
 * （transfer order/item fulfillment/item receipt）
 * @param dataIn
 * @returns
 */
function createItemFulfillment(dataIn) {
	//获取context
	var context = nlapiGetContext();
	//获取当前用户名，用于后面写入日志record	
	var user = context.getName();
	//获取当前操作的脚本的id
	var scriptId = context.getScriptId();
		if (dataIn) {
			var data;
			var responer;
			var Jsondata = [];
			//============================================================================
			//创建货品实施情况
			try {
				var itemfulfillmentId;
				var itemfulfillmentRec = nlapiTransformRecord('transferorder',
						dataIn.transferOrderId, 'itemfulfillment');
				//这里缺少明细行（商品没货的话，值是无法自动带过来的）
				itemfulfillmentRec.setFieldValue('memo', '测试接口');
				itemfulfillmentId = nlapiSubmitRecord(itemfulfillmentRec);
				nlapiLogExecution('error', 'itemfulfillmentId',itemfulfillmentId);
				if (itemfulfillmentId) {
					
					responer = {
							"status" : "success",
							"message" : "创建货品实施情况成功！"
						}
						return JSON.stringify(responer);

					writeLog('创建货品实施情况'+itemfulfillmentId, 
							'item fufillment is created', 
							user,
							scriptId, 
							'OK', 
							JSON.stringify(dataIn), 
							JSON.stringify(data));

				}
			} catch (e) {

				writeLog('创建货品实施情况', 
						'item fufillment creation failed', 
						user,
						scriptId, 
						'ERROR', 
						JSON.stringify(dataIn));

				return {
					"status" : "failure",
					"message" : '创建货品实施情况异常，请检查货品实施是否有误，所选货品是否充足！',
					"reason" : e.message
				};
			}
		}
}
