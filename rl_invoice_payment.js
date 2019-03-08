/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       23 Oct 2018     Nero
 *	
 * 核销单接口
 * 云合提供接口，同时生成发票和付款单；NS中价格为未税单价。
 */
	//获取context
	var context = nlapiGetContext();
	//获取当前用户名，用于后面写入日志record
	var user = context.getName();
	//获取当前操作的脚本的id
	var scriptId = context.getScriptId();
//云合提供接口，同时生成发票和付款单；NS中价格为未税单价。
function createInvoicePayment(dataIn) {
//	//获取context
//	var context = nlapiGetContext();
//	//获取当前用户名，用于后面写入日志record
//	var user = context.getName();
//	//获取当前操作的脚本的id
//	var scriptId = context.getScriptId();
	
	try {
		if (dataIn) {
			var data;
			var responer;
			var Jsondata = [];

			//创建发票记录
			var invoiceRec = nlapiCreateRecord('invoice');
			//获取请求的数据，并设置body上的字段值
			var Csearch = nlapiSearchRecord('customer', null,
					[new nlobjSearchFilter('entityid', null, 'is',dataIn.customerCode)]);
			if (Csearch != null) {
				var customerId2 = Csearch[0].getId();
				var customerRec = nlapiLoadRecord('customer', customerId2);
				var location2 = customerRec.getFieldValue('custentity_location');
				invoiceRec.setFieldValue('entity', customerId2);//客户ID
				invoiceRec.setFieldValue('location', location2);//地点ID
			}
			invoiceRec.setFieldValue('custbody_lijing_recordid', dataIn.orderId);//丽晶单据ID
			invoiceRec.setFieldValue('custbody10', dataIn.orderType);//订单类型ID
//			invoiceRec.setFieldValue('custbody_top_up_number',dataIn.topUpNumber);//充值单单号
//			invoiceRec.setFieldValue('custbody24', dataIn.vipId);//vip ID
			invoiceRec.setFieldValue('approvalstatus','2');//给invoice Approved状态
			if(dataIn.memo){
			invoiceRec.setFieldValue('memo', dataIn.memo);//备注，不是必填
			}else {
				invoiceRec.setFieldValue('memo', " ");
			}
			//请求的数据是json数组，先转换成json对象，再遍历，取值（dataIn就是object类型，不需要用JSON.parse()进行转换）
			var source = dataIn.itemData;
			for (var x = 0; x < source.length; x++) {
				//获取请求的数据，并设置到明细行中
				invoiceRec.selectNewLineItem('item');
				var dataItemCode = source[x].itemCode;
				var dataAmount = source[x].amount;
				nlapiLogExecution('error', 'dataItemCode', dataItemCode);
				nlapiLogExecution('error', 'dataAmount', dataAmount);
				//根据传过来的code取item的id
				var search = nlapiSearchRecord('item', null, [
                             new nlobjSearchFilter('itemid', null, 'is', dataItemCode)]);
				if(search != null){
					var itemId2 = search[0].getId();
				}
				invoiceRec.setCurrentLineItemValue('item', 'item', itemId2);//货品ID
				invoiceRec.setCurrentLineItemValue('item', 'amount', dataAmount);//货品数量
				//提交对明细行的操作的数据
				invoiceRec.commitLineItem('item');
			}
			nlapiLogExecution('error', 'source.length', source.length);
			//提交record
			var invoiceId = nlapiSubmitRecord(invoiceRec);
			//创建payment
			var paymentRec = nlapiTransformRecord('invoice', invoiceId, 'customerpayment');
//			var paymentRec = nlapiCreateRecord('customerpayment'); 
//			paymentRec.setFieldValue('customer', dataIn.customerId);//客户ID
//			paymentRec.setFieldValue('payment', dataIn.payment);//付款金额
			paymentRec.setFieldValue('status', 'Deposited');//给付款单的状态是deposited
			var paymentId = nlapiSubmitRecord(paymentRec);
			//获取设置的值，return回去
			var payment = paymentRec.getFieldValue('payment');
			var customerId = invoiceRec.getFieldValue('entity');
			var location = invoiceRec.getFieldValue('location');
			var orderType = invoiceRec.getFieldValue('custbody10');
//			var topUpNumber = invoiceRec.getFieldValue('custbody_top_up_number');
//			var vipId = invoiceRec.getFieldValue('custbody24');
			var memo = invoiceRec.getFieldValue('memo');

			//获取明细行上的货品的id和数量
			var invoice = nlapiLoadRecord('invoice', invoiceId);
			var num1 = invoice.getLineItemCount('item');
			var itemobj = [];
			for (var i = 1; i <= num1; i++) {
				var itemId = invoice.getLineItemValue('item', 'item', i);
				var amount = invoice.getLineItemValue('item', 'amount', i);
				itemobj.push({
					"itemId" : itemId,
					"amount" : amount
				});
			}

			nlapiLogExecution('error', 'itemobj', itemobj);
			if (invoiceId && paymentId) {
				data = {
					"customerId" : customerId,
					"payment" : payment,
					"location" : location,
					"orderType" : orderType,
//					"topUpNumber" : topUpNumber,
//					"vipId" : vipId,
					"memo" : memo,
					"itemData" : itemobj
				}
				Jsondata.push(data);
				responer = {
					"status" : "success",
					"message" : Jsondata
//					"invoiceId" : invoiceId,
//					"paymentId" : paymentId
				}
				//写入日志，将关键信息写入丽晶接口日志record
				writeLog('新建发票和付款单',
						 'invoice and payment is created', 
						 user, 
						 scriptId, 
						 'OK',
						 JSON.stringify(dataIn), 
						 JSON.stringify(responer)
						 );

				return JSON.stringify(responer);

			}
		}
	} catch (e) {
		
		writeLog('新建发票和付款单',
				 'invoice and payment creation failed', 
				 user, 
				 scriptId,
				 'ERROR', 
				 JSON.stringify(dataIn)
				 );
		
		return {
			"status" : "failure",
			"message" : "创建发票和付款单失败!",
			"reason" : e.message
		};
		
	}
}
