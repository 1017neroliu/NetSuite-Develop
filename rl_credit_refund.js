/**
 * 无源单退货
 * @param dataIn
 * @returns
 */
//云合提供接口，同时生成贷项通知单和客户退款；NS中单价为未税单价。
function createCreditRefund(dataIn) {
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
				
				//创建贷项通知单记录
				var creditmemoRec = nlapiCreateRecord('creditmemo');
				//获取请求的数据，并设置body上的字段值
				//获取客户code，转成客户id
				var Csearch = nlapiSearchRecord('customer', null,
						[new nlobjSearchFilter('entityid', null, 'is',dataIn.customerCode)]);
				
				if (Csearch != null) {
					var customerId2 = Csearch[0].getId();
				}
				//获取location的code，转成location的id
				var Lsearch = nlapiSearchRecord('location', null,
						[new nlobjSearchFilter('custrecord_locationid', null, 'is',dataIn.locationCode)]);
				if (Lsearch != null) {
					var location2 = Lsearch[0].getId();
				}
				creditmemoRec.setFieldValue('custbody_lijing_recordid', dataIn.orderId);//丽晶单据ID
				creditmemoRec.setFieldValue('entity', customerId2);//客户ID
				creditmemoRec.setFieldValue('location', location2);//地点ID
				creditmemoRec.setFieldValue('custbody10', dataIn.orderType);//订单类型ID
				if (dataIn.memo) {
					creditmemoRec.setFieldValue('memo', dataIn.memo);//备注，不是必填
				} else {
					creditmemoRec.setFieldValue('memo', " ");
				}
				//加载客户record获取免税代码
				var customerRec = nlapiLoadRecord('customer', customerId2);
				var taxCode2 = customerRec.getFieldValue('taxitem');

				//请求的数据是json数组，先转换成json对象，再遍历，取值（dataIn就是object类型，不需要用JSON.parse()进行转换）
				var source = dataIn.itemData;
				for (var x = 0; x < source.length; x++) {
					//获取请求的数据，并设置到明细行中
					creditmemoRec.selectNewLineItem('item');
					var dataItemCode = source[x].itemCode;
	//				var dataTaxcode = source[x].taxcode;
					var dataAmount = source[x].amount;

					var search = nlapiSearchRecord('item', null,
							[new nlobjSearchFilter('itemid', null, 'is',dataItemCode)]);
					if (search != null) {
						var itemId2 = search[0].getId();
					}
					nlapiLogExecution('error', 'itemId2', itemId2);
	//				nlapiLogExecution('error', 'dataTaxcode', dataTaxcode);
					creditmemoRec.setCurrentLineItemValue('item', 'item',itemId2);//货品ID
					creditmemoRec.setCurrentLineItemValue('item', 'taxcode',taxCode2);//货品taxcode
					creditmemoRec.setCurrentLineItemValue('item', 'amount',dataAmount);//货品数量
					//提交对明细行的操作的数据
					creditmemoRec.commitLineItem('item');
				}
				nlapiLogExecution('error', 'source.length', source.length);
				//提交record
				var creditmemoId = nlapiSubmitRecord(creditmemoRec);
				nlapiLogExecution('error', 'creditmemoId', creditmemoId);
				//创建payment
				var refundRec = nlapiCreateRecord('customerrefund', {recordmode : 'dynamic'});
				refundRec.setFieldValue('custbody_lijing_recordid', dataIn.orderId);//丽晶单据ID
				refundRec.setFieldValue('customer', customerId2);//客户ID
				refundRec.setFieldValue('paymentmethod', dataIn.paymentMethod);//付款方式ID
				/**
				 * 创建客户退款单record，获取请求数据，并把值设置进sublist中
				 * 创建贷项通知单没有问题，创建客户退款单的时候，输入客户和付款方式后，apply的sublist
				 * 下面会有日记账，付款单，贷项通知单三个，遍历apply下的子项，将apply的值设置为T，即勾选上即可
				 */
				var line = refundRec.getLineItemCount('apply');
				nlapiLogExecution('error', 'line', line);
				for (var a = 1; a <= line; a++) {
					//选择一行
					refundRec.selectLineItem('apply', a);
					//获取字段值，（apply的ID和type的ID也和creditmemoId相同）和ORIG.AMT.的值
					var applyID = refundRec.getCurrentLineItemValue('apply','doc');
					var amountRemaining = refundRec.getCurrentLineItemValue('apply', 'due');

					if (applyID == creditmemoId) {
						refundRec.setCurrentLineItemValue('apply', 'apply', 'T');
						refundRec.setCurrentLineItemValue('apply', 'amount',amountRemaining);
						refundRec.commitLineItem('apply');
					}
				}
				var refundId = nlapiSubmitRecord(refundRec);

				//获取设置的值，return回去
				var paymentMethod = refundRec.getFieldValue('paymentmethod');
				var customerId = creditmemoRec.getFieldValue('entity');
				var location = creditmemoRec.getFieldValue('location');
				var orderType = creditmemoRec.getFieldValue('custbody10');
				var memo = creditmemoRec.getFieldValue('memo');

				//获取明细行上的货品的id和数量
				var creditmemo = nlapiLoadRecord('creditmemo', creditmemoId);
				var num1 = creditmemo.getLineItemCount('item');
				var itemobj = [];
				for (var i = 1; i <= num1; i++) {
					var itemId = creditmemo.getLineItemValue('item', 'item', i);
					var amount = creditmemo.getLineItemValue('item', 'amount',
							i);
					itemobj.push({
						"itemId" : itemId,
						"amount" : amount
					});
				}

				nlapiLogExecution('error', 'itemobj', itemobj);
				if (creditmemoId && refundId) {
					data = {
						"customerId" : customerId,
						"paymentMethod" : paymentMethod,
						"location" : location,
						"orderType" : orderType,
						"memo" : memo,
						"itemData" : itemobj
					}
					Jsondata.push(data);
					responer = {
						"status" : "success",
						"message" : data
//						"creditmemoId" : creditmemoId,
//						"refundId" : refundId
					}
					//写入日志，将关键信息写入丽晶接口日志record
					writeLog('新建贷项通单'+creditmemoId+'客户退款单'+refundId,
							'creditmemo and payment is created', 
							user,
							scriptId, 
							'OK', 
							JSON.stringify(dataIn), 
							JSON.stringify(responer));

					return JSON.stringify(responer);

				}
			}
		} catch (e) {
			
			writeLog('新建贷项通知单和客户退款',
					'creditMemo and customerRefund creation failed',
					user, 
					scriptId, 
					'ERROR', 
					JSON.stringify(dataIn));

			return {
				"status" : "failure",
				"message" : "退货失败!",
				"reason" : e.message
			};
		}
}
