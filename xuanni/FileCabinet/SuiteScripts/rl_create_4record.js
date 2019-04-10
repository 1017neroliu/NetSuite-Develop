/**
 * 有源单退货（active list returns）
 * 云合提供接口，同时生成退货授权，货品收据，贷项通知单和客户退款；NS中单价为未税单价。
 * @param dataIn
 * @returns
 */
//提供接口，同时生成退货授权，货品收据，贷项通知单和客户退款；NS中单价为未税单价。
function create4Record(dataIn) {
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
				//创建退货授权记录（return authorization）
				var returnId;
				var returnRec = nlapiCreateRecord('returnauthorization');
				//获取请求的数据，并设置body上的字段值
//				var Csearch = nlapiSearchRecord('customer', null,
//						[new nlobjSearchFilter('entityid', null, 'is',dataIn.customerCode)]);
//				
//				if (Csearch != null) {
//					var customerId2 = Csearch[0].getId();
//				}
				//从客户主数据上获取绑定的location
				var customerRec = nlapiLoadRecord('customer', dataIn.customerCode);
				var location2 = customerRec.getFieldValue('custentity_locationid');
				
				returnRec.setFieldValue('custbody_lijing_recordid', dataIn.orderId);//丽晶单据ID
				returnRec.setFieldValue('entity', dataIn.customerCode);//客户ID
				returnRec.setFieldValue('location', location2);//地点ID
				returnRec.setFieldValue('custbody10', dataIn.orderType);//订单类型ID
	//			returnRec.setFieldValue('custbody_top_up_number',dataIn.topUpNumber);//充值单单号
	//			returnRec.setFieldValue('custbody24', dataIn.vipId);//vip ID
				returnRec.setFieldValue('orderstatus', 'B');//状态设置为PENDING FULFILLMENT（已通过审批）
				if (dataIn.memo) {
					returnRec.setFieldValue('memo', dataIn.memo);//备注，不是必填
				} else {
					returnRec.setFieldValue('memo', " ");
				}
				//加载客户record获取免税代码
				var customerRec = nlapiLoadRecord('customer', dataIn.customerCode);
				var taxCode2 = customerRec.getFieldValue('taxitem');
				//请求的数据是json数组，先转换成json对象，再遍历，取值（dataIn就是object类型，不需要用JSON.parse()进行转换）
				var source = dataIn.itemData;
				for (var x = 0; x < source.length; x++) {
					//获取请求的数据，并设置到明细行中
					returnRec.selectNewLineItem('item');
					var dataItemCode = source[x].itemCode;
	//				var dataTaxcode = source[x].taxcode;
					var dataAmount = source[x].amount;
					nlapiLogExecution('error', 'dataItemCode', dataItemCode);
	//				nlapiLogExecution('error', 'dataTaxcode', dataTaxcode);
					var search = nlapiSearchRecord('item', null,
							[new nlobjSearchFilter('itemid', null, 'is',dataItemCode)]);
					
					if (search != null) {
						var itemId2 = search[0].getId();
					}
					returnRec.setCurrentLineItemValue('item', 'item', itemId2);// 货品ID
					returnRec.setCurrentLineItemValue('item', 'taxcode',taxCode2);//货品taxcode
					returnRec.setCurrentLineItemValue('item', 'quantity',dataAmount);//货品数量
					//提交对明细行的操作的数据
					returnRec.commitLineItem('item');
				}
				nlapiLogExecution('error', 'source.length', source.length);
				returnId = nlapiSubmitRecord(returnRec);
				nlapiLogExecution('error', 'returnId', returnId);
				var customerId = returnRec.getFieldValue('entity');
				var location = returnRec.getFieldValue('location');
				var orderType = returnRec.getFieldValue('custbody10');
	//			var topUpNumber = returnRec.getFieldValue('custbody_top_up_number');
	//			var vipId = returnRec.getFieldValue('custbody24');
				var memo = returnRec.getFieldValue('memo');
				//获取明细行上的货品的id和数量
				var num1 = returnRec.getLineItemCount('item');
				var itemobj = [];
				for (var i = 1; i <= num1; i++) {
					var itemId = returnRec.getLineItemValue('item', 'item', i);
	//				var taxCode = returnRec.getLineItemValue('item', 'taxcode', i);
					var amount = returnRec.getLineItemValue('item', 'amount', i);
					itemobj.push({
						"itemId" : itemId,
	//					"taxCode" : taxCode,
						"amount" : amount
					});
				}
				if (returnId) {

					writeLog('新建退货授权成功' + returnId,
							'return authorisation is created', 
							user, 
							scriptId,
							'OK', 
							JSON.stringify(dataIn), 
							JSON.stringify(data));

				}
			} catch (e) {
				
				writeLog('新建退货授权失败',
						e.message, 
						user,
						scriptId, 
						'ERROR', 
						JSON.stringify(dataIn));
				
				return {
					"status" : "failure",
					"message" : "创建退货授权单失败!",
					"reason" : e.message
				};
			}
			//当item receipt保存后，return authorisation的状态会自动变成pending refund状态
			//===========================================================================
			//创建货品收据（item receipt）
			try {
				var receiptId;
				var receiptRec = nlapiTransformRecord('returnauthorization',
						returnId, 'itemreceipt');
				receiptId = nlapiSubmitRecord(receiptRec);
				if (receiptId) {

					writeLog('新建货品收据单成功' + receiptId,
							'item receipt is created', 
							user, 
							scriptId, 
							'OK',
							JSON.stringify(dataIn), 
							JSON.stringify(data));

				}
			} catch (e) {
				
				writeLog('新建货品收据单失败',
						e.message, 
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
			//============================================================================
			//创建贷项通知单
			try {
				var creditmemoId;
				var creditmemoRec = nlapiTransformRecord('returnauthorization',
						returnId, 'creditmemo');
				creditmemoId = nlapiSubmitRecord(creditmemoRec);
				if (creditmemoId) {

					writeLog('新建贷项通知单成功' + creditmemoId,
							'credit memo is created', 
							user, 
							scriptId, 
							'OK',
							JSON.stringify(dataIn), 
							JSON.stringify(data));

				}
			} catch (e) {
				
				writeLog('新建贷项通知单失败',
						e.message, 
						user, 
						scriptId,
						'ERROR', 
						JSON.stringify(dataIn));
				
				return {
					"status" : "failure",
					"message" : "创建贷项通知单失败!",
					"reason" : e.message
				};
			}
			//============================================================================
			//创建客户退款
//			try {
//				var refundRec;
//				refundRec = nlapiCreateRecord('customerrefund', {recordmode : 'dynamic'});
//				refundRec.setFieldValue('custbody_lijing_recordid',dataIn.orderId);//丽晶单据ID
//				refundRec.setFieldValue('customer',dataIn.customerCode);//客户ID
//				refundRec.setFieldValue('paymentmethod', dataIn.paymentMethod);//付款方式ID
//				var paymentMethod = refundRec.getFieldValue('paymentmethod');
//				var line = refundRec.getLineItemCount('apply');
//				nlapiLogExecution('error', 'line', line);
//				for (var a = 1; a <= line; a++) {
//					//选择一行
//					refundRec.selectLineItem('apply', a);
//					//获取字段值，（apply的ID和type的ID也和creditmemoId相同）和ORIG.AMT.的值
//					var applyID = refundRec.getCurrentLineItemValue('apply',
//							'doc');
//					var amountRemaining = refundRec.getCurrentLineItemValue(
//							'apply', 'due');
//
//					if (applyID == creditmemoId) {
//						refundRec.setCurrentLineItemValue('apply', 'apply', 'T');
//						refundRec.setCurrentLineItemValue('apply', 'amount',amountRemaining);
//						refundRec.commitLineItem('apply');
//					}
//				}
//				var refundId = nlapiSubmitRecord(refundRec);
//				if (refundId) {
//
//					writeLog('新建客户退款单成功' + refundId,
//							'ustomer refund is created', 
//							user, 
//							scriptId, 
//							'OK',
//							JSON.stringify(dataIn), 
//							JSON.stringify(data));
//
//				}
//			} catch (e) {
//				
//				writeLog('新建客户退款单失败',
//						e.message, 
//						user, 
//						scriptId,
//						'ERROR', 
//						JSON.stringify(dataIn));
//				
//				return {
//					"status" : "failure",
//					"message" : "创建客户退款单失败!",
//					"reason" : e.message
//				};
//			}
			
			
			if(returnId && receiptId && creditmemoId){
				data = {
						"customerId" : dataIn.customerCode,
//						"paymentMethod" : paymentMethod,
						"location" : location,
						"orderType" : orderType,
//						"topUpNumber" : topUpNumber,
//						"vipId" : vipId,
						"memo" : memo,
						"itemData" : itemobj
					}
					Jsondata.push(data);
				responer = {
						"status" : "success",
						"message" : Jsondata
					}
				return JSON.stringify(responer);
			}
		}
	} catch (e) {
		
		return {
			"status" : "failure",
			"message" : "有源单退货失败!",
			"reason" : e.message
		};
	}
}
