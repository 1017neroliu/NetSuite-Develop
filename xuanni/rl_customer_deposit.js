/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       18 Oct 2018     Nero
 *	
 * VIP储值接口
 * 云合提供NS的客户存款接口
 */
	var context = nlapiGetContext();
	var user = context.getName();
	var scriptId = context.getScriptId();
//NS系统开发API接口，丽晶系统储值单据审核后传输到NS系统中
function customerDeposit(datain) {
//	var context = nlapiGetContext();
//	var user = context.getName();
//	var scriptId = context.getScriptId();
	
	try {
		if (datain != null && datain != "") {
			var customerDeposit;
			var responer;
			var jsondata = [];
			
			var customerDepositRec = nlapiCreateRecord('customerdeposit');
			//获取客户code，转成客户id
			var Csearch = nlapiSearchRecord('customer', null,
					[new nlobjSearchFilter('entityid', null, 'is',datain.customerCode)]);
			
			if (Csearch != null) {
				var customerId2 = Csearch[0].getId();
			}
			customerDepositRec.setFieldValue('custbody_lijing_recordid', datain.orderId);//丽晶单据ID
			customerDepositRec.setFieldValue('customer', customerId2);//客户id，店铺id
	//		customerDepositRec.setFieldValue('currency', datain.currency);//货币类型ID
	//		customerDepositRec.setFieldValue('exchangerate', datain.exchangeRate);//汇率
	//		customerDepositRec.setFieldValue('trandate', datain.date);//日期
			customerDepositRec.setFieldValue('payment', datain.payment);//支付金额
			if (datain.memo) {
				customerDepositRec.setFieldValue('memo', datain.memo);//备注
			} else {
				customerDepositRec.setFieldValue('memo', " ");
			}
			customerDepositRec.setFieldValue('custbody24', datain.vipId);//vip的ID
	//		customerDepositRec.setFieldValue('paymentmethod', datain.paymentmethod);//付款方式
			customerDepositRec.setFieldValue('custbody_top_up_number',datain.topUpNumber);//充值单号

			//给单据状态设置为deposited
			
			var internalId = nlapiSubmitRecord(customerDepositRec);
			
			var customerId = customerDepositRec.getFieldValue('customer');
	//		var currency = customerDepositRec.getFieldValue('currency');
	//		var exchangeRate = customerDepositRec.getFieldValue('exchangerate');
	//		var date = customerDepositRec.getFieldValue('trandate');
			var payment = customerDepositRec.getFieldValue('payment');
			var memo = customerDepositRec.getFieldValue('memo');
			var vipId = customerDepositRec.getFieldValue('custbody24');
	//		var paymentmethod = customerDepositRec.getFieldValue('paymentmethod');
			var topUpNumber = customerDepositRec.getFieldValue('custbody_top_up_number');

			if (internalId) {
				customerDeposit = {
					"customerId" : customerId,
				  //"currency" : currency,
			      //"exchangeRate" : exchangeRate,
				  //"date" : date,
					"payment" : payment,
					"memo" : memo,
					"vipId" : vipId,
	//				"paymentmethod" : paymentmethod,
					"topUpNumber" : topUpNumber
				}
				jsondata.push(customerDeposit);
				responer = {
					"status" : "success",
					"message" : jsondata
				}

				writeLog('新建客户存款'+internalId,
						'customer deposit is created', 
						user, 
						scriptId, 
						'OK',
						JSON.stringify(datain), 
						JSON.stringify(customerDeposit));

				return JSON.stringify(responer);

			}
		}
	} catch (e) {
		writeLog('新建客户存款',
				'customer creation failed', 
				user, 
				scriptId, 
				'ERROR',
				JSON.stringify(datain));

		return {
			"status" : "failure",
			"message" : "储值失败!",
			"reason" : e.message
		};
	}
}
