/**
 * 无指令的门店配送
 * 丽晶出库时，调用云合提供的转账订单和货品实施情况接口；丽晶入库时调用云合提供的货品收据接口。
 * （transfer order/item fulfillment/item receipt）
 * @param dataIn
 * @returns
 */
function createTOAndFulfillment(dataIn) {
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
			try {
				var transferOrderId;
				//创建转账订单（transfer order）
				var transferOrderRec = nlapiCreateRecord('transferorder');
				//获取location的code，转成location的id
				var fLsearch = nlapiSearchRecord('location', null,
						[new nlobjSearchFilter('custrecord_locationid', null, 'is',dataIn.fromLocationCode)]);
				if (fLsearch != null) {
					var fromLocation2 = fLsearch[0].getId();
				}
				var tLsearch = nlapiSearchRecord('location', null,
						[new nlobjSearchFilter('custrecord_locationid', null, 'is',dataIn.toLocationCode)]);
				if (tLsearch != null) {
					var toLocation2 = tLsearch[0].getId();
				}
				//获取请求的数据，并设置body上的字段值
				transferOrderRec.setFieldValue('custbody_lijing_recordid', dataIn.orderId);//丽晶单据ID
				transferOrderRec.setFieldValue('location', fromLocation2);//转出库存地点ID
				transferOrderRec.setFieldValue('transferlocation',toLocation2);//转入库存地点ID
				transferOrderRec.setFieldValue('custbody18',dataIn.transferType);//转移类型ID
				transferOrderRec.setFieldValue('orderstatus', 'B');//状态设置为PENDING RECEIPT（已通过审批）
				if (dataIn.memo) {
					transferOrderRec.setFieldValue('memo', dataIn.memo);//备注，不是必填
				} else {
					transferOrderRec.setFieldValue('memo', " ");
				}
				//请求的数据是json数组，先转换成json对象，再遍历，取值（dataIn就是object类型，不需要用JSON.parse()进行转换）
				var source = dataIn.itemData;
				for (var x = 0; x < source.length; x++) {
					var dataItemCode = source[x].itemCode;
					var dataQuantity = source[x].quantity;
					var dataDescription = source[x].description;
					if (!dataDescription) {
						dataDescription = " ";
					}
					var search = nlapiSearchRecord('item', null,
							[new nlobjSearchFilter('itemid', null, 'is',dataItemCode)]);
					if (search != null) {
						var itemId2 = search[0].getId();
					}
					nlapiLogExecution('error', 'dataItemCode', dataItemCode);
					nlapiLogExecution('error', 'dataQuantity', dataQuantity);
					nlapiLogExecution('error', 'dataDescription', dataDescription);
					//获取请求的数据，并设置到明细行中
					transferOrderRec.selectNewLineItem('item');
					transferOrderRec.setCurrentLineItemValue('item', 'item', itemId2);//货品ID
					transferOrderRec.setCurrentLineItemValue('item','quantity', dataQuantity);//货品数量
					transferOrderRec.setCurrentLineItemValue('item','description', dataDescription);//货品描述，可选
					//提交对明细行的操作的数据
					transferOrderRec.commitLineItem('item');
				}
				nlapiLogExecution('error', 'source.length', source.length);
				transferOrderId = nlapiSubmitRecord(transferOrderRec);
				nlapiLogExecution('error', 'transferOrderId', transferOrderId);
				var fromLocation = transferOrderRec.getFieldValue('location');
				var toLocation = transferOrderRec.getFieldValue('transferlocation');
				var transferType = transferOrderRec.getFieldValue('custbody18');
				var memo = transferOrderRec.getFieldValue('memo');
				//获取明细行上的货品的id和数量
				var num = transferOrderRec.getLineItemCount('item');
				var itemobj = [];
				for (var i = 1; i <= num; i++) {
					var itemId = transferOrderRec.getLineItemValue('item','item', i);
					var quantity = transferOrderRec.getLineItemValue('item','quantity', i);
					var description = transferOrderRec.getLineItemValue('item','description', i);

					itemobj.push({
						"itemId" : itemId,
						"quantity" : quantity,
						"description" : description
					});

				}
				if (transferOrderId) {

					writeLog('新建转账订单' + transferOrderId,
							'transfer order is created', 
							user, scriptId,
							'OK',
							JSON.stringify(dataIn),
							JSON.stringify(data));
				}
			} catch (e) {
				
				writeLog('新建转账订单',
						 'transfer order creation failed',
						 user,
						 scriptId,
						 'ERROR',
						 JSON.stringify(dataIn));
				
				return {
					"status" : "failure",
					"message" : '创建转账订单失败！',
					"reason" : e.message
				};
			}
			//============================================================================
			//创建货品实施情况
			try {
			var itemfulfillmentId;
			var itemfulfillmentRec = nlapiTransformRecord('transferorder',
					transferOrderId, 'itemfulfillment');
			//这里缺少明细行（商品没货的话，值是无法自动带过来的）
			itemfulfillmentRec.setFieldValue('memo', '测试无指令接口');
			itemfulfillmentId = nlapiSubmitRecord(itemfulfillmentRec);
			nlapiLogExecution('error', 'itemfulfillmentId', itemfulfillmentId);

			if (itemfulfillmentId) {

				writeLog('新建货品实施情况' + itemfulfillmentId,
						'item fufillment is created',
						user, scriptId,
						'OK',
						JSON.stringify(dataIn),
						JSON.stringify(data));
			}
			
			} catch (e) {
				
			}
			writeLog('创建记录失败',
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
		//============================================================================
		if (transferOrderId && itemfulfillmentId) {

			data = {
				"fromLocation" : fromLocation,
				"toLocation" : toLocation,
				"transferType" : transferType,
				"memo" : memo,
				"itemData" : itemobj,
				"transferOrderId" : transferOrderId
			}

			Jsondata.push(data);

			responer = {
				"status" : "success",
				"message" : Jsondata
			}

			return JSON.stringify(responer);

		} 
	} catch (e) {
		
		writeLog('创建记录失败',
				'record creation failed',
				user,
				scriptId,
				'ERROR',
				JSON.stringify(dataIn));

		return {
			"status" : "failure",
			"message" : "创建出库单失败！",
			"reason" : e.message
		};
	}
}
