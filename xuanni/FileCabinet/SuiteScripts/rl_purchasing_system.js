/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Nov 2018     Nero
 *	采购入库--还未完成
 */
//云合在NS中提供一个批量汇总【配件创建】的页面，用户提交后调用丽晶提供的采购订单接口；丽晶入库后调用云合提供的库存转移接口。
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

			//创建退货授权记录（return authorization）
			var returnRec = nlapiCreateRecord('returnauthorization');
			//获取请求的数据，并设置body上的字段值
			returnRec.setFieldValue('entity', dataIn.customerId);//客户ID
			returnRec.setFieldValue('location', dataIn.location);//地点ID
			returnRec.setFieldValue('custbody10', dataIn.orderType);//订单类型ID
			returnRec.setFieldValue('custbody_top_up_number',dataIn.topUpNumber);//充值单单号
			returnRec.setFieldValue('custbody24', dataIn.vipId);//vip ID
			returnRec.setFieldValue('orderstatus', 'B');//状态设置为PENDING RECEIPT（已通过审批）
			if (dataIn.memo) {
				returnRec.setFieldValue('memo', dataIn.memo);//备注，不是必填
			} else {
				returnRec.setFieldValue('memo', " ");
			}

			//请求的数据是json数组，先转换成json对象，再遍历，取值（dataIn就是object类型，不需要用JSON.parse()进行转换）
			var source = dataIn.itemData;
			for (var x = 0; x < source.length; x++) {
				//获取请求的数据，并设置到明细行中
				returnRec.selectNewLineItem('item');
				var dataItemCode = source[x].itemCode;
				var dataTaxcode = source[x].taxcode;
				var dataAmount = source[x].amount;
				var search = nlapiSearchRecord('item', null,
						[ new nlobjSearchFilter('itemid', null, 'is',dataItemCode) ]);
				if (search != null) {
					var itemId2 = search[0].getId();
				}
				nlapiLogExecution('error', 'dataItemCode', dataItemCode);
//				nlapiLogExecution('error', 'dataTaxcode', dataTaxcode);
				returnRec.setCurrentLineItemValue('item', 'item', itemId2);//货品ID
				returnRec.setCurrentLineItemValue('item', 'taxcode',dataTaxcode);//货品taxcode
				returnRec.setCurrentLineItemValue('item', 'amount', dataAmount);//货品数量
				//提交对明细行的操作的数据
				returnRec.commitLineItem('item');
			}
			nlapiLogExecution('error', 'source.length', source.length);
			//提交record
			var returnId = nlapiSubmitRecord(returnRec);
			nlapiLogExecution('error', 'returnId', returnId);
			
			var customerId = returnRec.getFieldValue('entity');
			var location = returnRec.getFieldValue('location');
			var orderType = returnRec.getFieldValue('custbody10');
			var topUpNumber = returnRec.getFieldValue('custbody_top_up_number');
			var vipId = returnRec.getFieldValue('custbody24');
			var memo = returnRec.getFieldValue('memo');
			
			//获取明细行上的货品的id和数量
			var num1 = returnRec.getLineItemCount('item');
			var itemobj = [];
			for (var i = 1; i <= num1; i++) {
				var itemId = returnRec.getLineItemValue('item', 'item', i);
				var taxCode = returnRec.getLineItemValue('item', 'taxcode', i);
				var amount = returnRec.getLineItemValue('item', 'amount', i);
				itemobj.push({
					"itemId" : itemId,
					"taxCode" : taxCode,
					"amount" : amount
				});
			}
			
			if(returnId){
				writeLog('新建退货授权成功' + returnId,
						'return authorisation is created', user, scriptId,
						'OK', JSON.stringify(dataIn), JSON.stringify(data));
			}else{
				writeLog('新建退货授权失败' + returnId,
						'return authorisation creation failed', user,
						scriptId, 'ERROR', JSON.stringify(dataIn));
			}
			//===========================================================================
			//创建货品收据（item receipt）
			var receiptRec = nlapiTransformRecord('returnauthorization',
					returnId, 'itemreceipt');
			receiptRec.setFieldValue('memo', '我是从退货授权那过来的');
			//当item receipt保存后，return authorisation的状态会自动变成pending refund状态
			var receiptId = nlapiSubmitRecord(receiptRec);
			if(receiptId){
				writeLog('新建货品收据单成功' + receiptId,
						'item receipt is created', user, scriptId,
						'OK', JSON.stringify(dataIn), JSON.stringify(data));
			}else{
				writeLog('新建货品收据单失败' + receiptId,
						'item receipt creation failed', user,
						scriptId, 'ERROR', JSON.stringify(dataIn));
			}
			//============================================================================
			//创建贷项通知单
			var creditmemoRec = nlapiTransformRecord('returnauthorization', returnId, 'creditmemo');
			creditmemoRec.setFieldValue('memo', '我是从退货授权那过来的');
			var creditmemoId = nlapiSubmitRecord(creditmemoRec);
			if(creditmemoId){
			writeLog('新建贷项通知单成功' + creditmemoId,
					'credit memo is created', user, scriptId,
					'OK', JSON.stringify(dataIn), JSON.stringify(data));
		}else{
			writeLog('新建贷项通知单失败' + creditmemoId,
					'credit memo creation failed', user,
					scriptId, 'ERROR', JSON.stringify(dataIn));
		}
			//============================================================================
			//创建客户退款
			var refundRec = nlapiCreateRecord('customerrefund', {recordmode: 'dynamic'});
			refundRec.setFieldValue('customer', dataIn.customerId);//客户ID
			refundRec.setFieldValue('paymentmethod', dataIn.paymentMethod);//付款方式ID
			refundRec.setFieldValue('memo', '我是新建的客户退款');
			/**
			 * 创建客户退款单record，获取请求数据，并把值设置进sublist中
			 * 创建贷项通知单没有问题，创建客户退款单的时候，输入客户和付款方式后，apply的sublist
			 * 下面会有日记账，付款单，贷项通知单三个，遍历apply下的子项，将apply的值设置为T，即勾选上即可
			 */
			var paymentMethod = refundRec.getFieldValue('paymentmethod');
			var line = refundRec.getLineItemCount('apply');
			nlapiLogExecution('error', 'line', line);
			for (var a = 1; a <= line; a++) {
				//选择一行
				refundRec.selectLineItem('apply', a);
				//获取字段值，（apply的ID和type的ID也和creditmemoId相同）和ORIG.AMT.的值
				var applyID = refundRec.getCurrentLineItemValue('apply', 'doc');
				var amountRemaining = refundRec.getCurrentLineItemValue('apply', 'due');
			 
				if (applyID == creditmemoId) {
					refundRec.setCurrentLineItemValue('apply', 'apply', 'T');
					refundRec.setCurrentLineItemValue('apply', 'amount', amountRemaining);
					refundRec.commitLineItem('apply');
			 
				}
			}
			var refundId = nlapiSubmitRecord(refundRec);
			if(refundId){
			writeLog('新建客户退款单成功' + refundId,
					'ustomer refund is created', user, scriptId,
					'OK', JSON.stringify(dataIn), JSON.stringify(data));
		}else{
			writeLog('新建客户退款单失败' + refundId,
					'customer refund creation failed', user,
					scriptId, 'ERROR', JSON.stringify(dataIn));
		}
			if(returnId && receiptId && creditmemoId && refundId){
				data = {
						"customerId" : customerId,
						"paymentMethod" : paymentMethod,
						"location" : location,
						"orderType" : orderType,
						"topUpNumber" : topUpNumber,
						"vipId" : vipId,
						"memo" : memo,
						"itemData" : itemobj
					}
					Jsondata.push(data);
				responer = {
						"status" : "success",
						"message" : data,
					}
				return JSON.stringify(responer);
			}else {
				return {
					"status" : "failure",
					"message" : "创建记录失败!"
				};
			}
			//获取设置的值，return回去
//			var paymentMethod = receiptRec.getFieldValue('paymentmethod');
//			var customerId = returnRec.getFieldValue('entity');
//			var location = returnRec.getFieldValue('location');
//			var orderType = returnRec.getFieldValue('custbody10');
//			var topUpNumber = returnRec.getFieldValue('custbody_top_up_number');
//			var vipId = returnRec.getFieldValue('custbody24');
//			var memo = returnRec.getFieldValue('memo');

			//获取明细行上的货品的id和数量
//			var creditmemo = nlapiLoadRecord('creditmemo', returnId);
//			var num1 = creditmemo.getLineItemCount('item');
//			var itemobj = [];
//			for (var i = 1; i <= num1; i++) {
//				var itemId = creditmemo.getLineItemValue('item', 'item', i);
//				var taxCode = creditmemo.getLineItemValue('item', 'taxcode', i);
//				var amount = creditmemo.getLineItemValue('item', 'amount', i);
//				itemobj.push({
//					"itemId" : itemId,
//					"taxCode" : taxCode,
//					"amount" : amount
//				});
//			}

//			nlapiLogExecution('error', 'itemobj', itemobj);
//			if (returnId && refundId) {
//				data = {
//					"customerId" : customerId,
//					"paymentMethod" : paymentMethod,
//					"location" : location,
//					"orderType" : orderType,
//					"topUpNumber" : topUpNumber,
//					"vipId" : vipId,
//					"memo" : memo,
//					"itemData" : itemobj
//				}
//				Jsondata.push(data);
//				responer = {
//					"status" : "success",
//					"message" : data,
//					"returnId" : returnId,
//					"refundId" : refundId
//				}
				//写入日志，将关键信息写入丽晶接口日志record
//				writeLog('新建贷项通知单和客户退款' + customerId,
//						'creditmemo and payment is created', user, scriptId,
//						'OK', JSON.stringify(dataIn), JSON.stringify(data));
//
//				return JSON.stringify(responer);
//
//			} else {
//				writeLog('新建贷项通知单和客户退款' + customerId,
//						'creditMemo and customerRefund creation failed', user,
//						scriptId, 'ERROR', JSON.stringify(dataIn), JSON
//								.stringify(data));
//				return {
//					"status" : "failure",
//					"message" : "创建贷项通知单和客户退款失败!"
//				};
//			}
		}
	} catch (e) {
	}
}
