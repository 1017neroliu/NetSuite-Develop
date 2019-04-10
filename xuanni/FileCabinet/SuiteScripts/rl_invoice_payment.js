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
//			var Csearch = nlapiSearchRecord('customer', null,
//					[new nlobjSearchFilter('entityid', null, 'is',dataIn.customerCode)]);
//			if (Csearch != null) {
//			var customerId2 = Csearch[0].getId();
			invoiceRec.setFieldValue('entity', dataIn.customerCode);//客户ID
			var customerRec = nlapiLoadRecord('customer', dataIn.customerCode);
			var location2 = customerRec.getFieldValue('custentity_location');
			invoiceRec.setFieldValue('location', location2);//地点ID
//			}
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
			var totalPrice = 0;
			for (var x = 0; x < source.length; x++) {
				//获取请求的数据，并设置到明细行中
				invoiceRec.selectNewLineItem('item');
				var dataItemCode = source[x].itemCode;
				var dataAmount = source[x].amount;
				var dataPrice = parseInt(source[x].price);
				totalPrice += dataPrice;
//				nlapiLogExecution('error', 'dataItemCode', dataItemCode);
//				nlapiLogExecution('error', 'dataAmount', dataAmount);
				//根据传过来的code取item的id
				var search = nlapiSearchRecord('item', null, [
                             new nlobjSearchFilter('itemid', null, 'is', dataItemCode)]);
				if(search != null){
					var itemId2 = search[0].getId();
				}
				invoiceRec.setCurrentLineItemValue('item', 'item', itemId2);//货品ID
				invoiceRec.setCurrentLineItemValue('item', 'quantity', dataAmount);//货品数量
				invoiceRec.setCurrentLineItemValue('item', 'price', '-1');//价格基准
				invoiceRec.setCurrentLineItemValue('item', 'rate', dataPrice/1.16);//货品价格
				//提交对明细行的操作的数据
				invoiceRec.commitLineItem('item');
			}
//			nlapiLogExecution('error', 'source.length', source.length);
			//提交record
			var invoiceId = nlapiSubmitRecord(invoiceRec);
			
			//=====================================创建付款单核销发票========================================================
			//如果是自收银，就核销（创建付款单）
			var isCash = customerRec.getFieldValue('custentity20');
			if(isCash == 'T'){
			try {
				//当付款方式为储值卡支付的时候，用客户存款去核销发票
				if (dataIn.paymentMethod == '12') {
					var customerId = dataIn.customerCode;
					var vip = dataIn.vipCode;
					applyDeposits(invoiceId, customerId, vip);
				}else{
//					nlapiLogExecution('error', 'totalPrice2', totalPrice);
					if(totalPrice != 0){
				//创建payment
				var paymentRec = nlapiTransformRecord('invoice', invoiceId,'customerpayment');
				paymentRec.setFieldValue('paymentmethod', dataIn.paymentMethod);//付款方式
				paymentRec.setFieldValue('status', 'Deposited');//给付款单的状态是deposited
				var paymentId = nlapiSubmitRecord(paymentRec);
					}
				}
				var invRec = nlapiLoadRecord('invoice', invoiceId);
				var invStatus = invRec.getFieldValue('status');
				nlapiLogExecution('ERROR', 'invStatus', invStatus);
				if(invStatus == "Paid In Full" || invStatus == "全额付款"){
					responer = {
							"status" : "success",
							"message" : '自收银核销成功'
						}
//						写入日志，将关键信息写入丽晶接口日志record
						writeLog('自收银核销成功',
								 'success',
								 user,
								 scriptId,
								 'OK',
								 JSON.stringify(dataIn),
								 JSON.stringify(responer)
								 );

						return JSON.stringify(responer);
				}else{
					responer = {
							"status" : "failure",
							"message" : '自收银核销失败，发票未核销'
						}
					writeLog('自收银核销失败，发票未核销',
							 'failure', 
							 user, 
							 scriptId, 
							 'ERROR',
							 JSON.stringify(dataIn), 
							 JSON.stringify(responer)
							 );

					return JSON.stringify(responer);
				}
			} catch (e) {
				responer = {
						"status" : "failure",
						"message" : '自收银核销失败',
						"reason" : e.message
					}
//					写入日志，将关键信息写入丽晶接口日志record
					writeLog('自收银核销失败',
							 'failure', 
							 user, 
							 scriptId, 
							 'ERROR',
							 JSON.stringify(dataIn), 
							 JSON.stringify(responer)
							 );

					return JSON.stringify(responer);
			}
			} 
			if(isCash == 'F' && dataIn.paymentMethod == '12'){
				try {
					//创建payment
//					var paymentRec = nlapiTransformRecord('invoice', invoiceId,'customerpayment');
//					paymentRec.setFieldValue('paymentmethod',dataIn.paymentMethod);//付款方式
					//当付款方式为储值卡支付的时候，用客户存款去核销发票
					var customerId = dataIn.customerCode;
					var vip = dataIn.vipCode;
					applyDeposits(invoiceId, customerId, vip);
//					paymentRec.setFieldValue('status', 'Deposited');//给付款单的状态是deposited
//					var paymentId = nlapiSubmitRecord(paymentRec);
					
					var invRec = nlapiLoadRecord('invoice', invoiceId);	
					var invStatus = invRec.getFieldValue('status');
					nlapiLogExecution('ERROR', 'invStatus2', invStatus);
					if(invStatus == "Paid In Full"  || invStatus == "全额付款"){
						responer = {
								"status" : "success",
								"message" : '非自收银核销成功'
							}
//							写入日志，将关键信息写入丽晶接口日志record
							writeLog('非自收银核销成功',
									 'success', 
									 user, 
									 scriptId, 
									 'OK',
									 JSON.stringify(dataIn), 
									 JSON.stringify(responer)
									 );

							return JSON.stringify(responer);
					}else{
						responer = {
								"status" : "failure",
								"message" : '非自收银核销失败，发票未核销'
							}
						writeLog('非自收银核销失败，发票未核销',
								 'failure', 
								 user, 
								 scriptId, 
								 'ERROR',
								 JSON.stringify(dataIn), 
								 JSON.stringify(responer)
								 );

						return JSON.stringify(responer);
					}
				} catch (e) {
					responer = {
							"status" : "failure",
							"message" : '非自收银核销失败',
							"reason" : e.message
						}
//						写入日志，将关键信息写入丽晶接口日志record
						writeLog('非自收银核销失败',
								 'failure', 
								 user, 
								 scriptId, 
								 'ERROR',
								 JSON.stringify(dataIn), 
								 JSON.stringify(responer)
								 );

						return JSON.stringify(responer);
				}
			}
			if(invoiceId && isCash == 'F' && dataIn.paymentMethod != '12'){
				responer = {
					"status" : "success",
					"message" : '创建发票成功'
				}
//				写入日志，将关键信息写入丽晶接口日志record
				writeLog('创建发票成功',
						 'success', 
						 user, 
						 scriptId, 
						 'OK',
						 JSON.stringify(dataIn), 
						 JSON.stringify(responer)
						 );

				return JSON.stringify(responer);
			}else{
				responer = {
						"status" : "failure",
						"message" : '创建发票失败，发票未创建'
					}
				writeLog('创建发票失败，发票未创建',
						 'failure', 
						 user, 
						 scriptId, 
						 'ERROR',
						 JSON.stringify(dataIn), 
						 JSON.stringify(responer)
						 );

				return JSON.stringify(responer);
			}
		}
	} catch (e) {
		
		writeLog('创建发票失败',
				 e.message, 
				 user, 
				 scriptId,
				 'ERROR', 
				 JSON.stringify(dataIn)
				 );
//		
		return {
			"status" : "failure",
			"message" : "创建发票失败!",
			"reason" : e.message
		};
		
	}
}
function applyDeposits(invId, cusId,vip){ //invoice id and customer id
	var func = 'applyDeposits ';
//	var depositbalance = nlapiLookupField('customer', cusId, 'depositbalance');
	//取客户存款的余额
//	var cusDeposit = nlapiLoadSearch(null, 'customsearch307');
//	cusDeposit.addFilters([new nlobjSearchFilter('entity', null, 'is', cusId),
//	                       new nlobjSearchFilter('custbody24', null, 'is', vip)]);
//	var cusDepositResult = cusDeposit.runSearch();
//	var resultIndex = 0;
//	var resultStep = 1000;
//	var cusResult;
//	do {
//		cusResult = cusDepositResult.getResults(resultIndex, resultStep);
//		resultIndex = resultIndex + resultStep;
//		var searchLength = cusResult.length;
//		
//		if (cusResult != null && searchLength > 0) {
	
	//if there are no monies to apply, avoid doing work
//	if (depositbalance > 0){
		//find all the related open deposit records
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('entity', null, 'is', cusId);
		//indicates not full applied
//		filters[1] = new nlobjSearchFilter('status', null, 'noneof', 'CustDep:C');
//		filters[2] = new nlobjSearchFilter('mainline', null, 'is', 'T');
		//don't try to get those deposits hard linked to sales orders
//		filters[3] = new nlobjSearchFilter('salesorder', null, 'anyof', '@NONE@'); 
		
		filters[1] = new nlobjSearchFilter('custbody24', null, 'is', vip);
		
//		var columns = new Array();
//		columns[0] = new nlobjSearchColumn('internalid').setSort(false);

		//hunt for the records
		var records = nlapiLoadSearch(null, 'customsearch307');
		records.addFilters(filters);
//		records.addColumns(columns);
		var recordsResult = records.runSearch();
		var resultIndex = 0;
		var resultStep = 1000;
		var result;
		do{
			result = recordsResult.getResults(resultIndex, resultStep);
			resultIndex = resultIndex + resultStep;
			var searchLength = result.length;
			nlapiLogExecution('ERROR', 'searchLength', searchLength);
		if (!result){
			nlapiLogExecution('ERROR', func  + 'Found no deposit records; but they were expected.');
			return
		};

		nlapiLogExecution('ERROR', func + ' starting deposit application work');
		//遍历客户存款记录
		for ( var r = 0; r < searchLength; r++ ) {
			//transform below does not appear documented; but works as expected
			var cols = result[r].getAllColumns();
			var amountCredit = result[r].getValue(cols[6]);
			var amountPaid = result[r].getValue(cols[5]);
			var unpaid = amountCredit - amountPaid;
			nlapiLogExecution('ERROR', 'unpaid', unpaid);
			
			var deposit = nlapiTransformRecord('customerdeposit', result[r].getId(), 'depositapplication');

//			deposit.setFieldValue('trandate', nlapiDateToString(new Date()));
//			deposit.setFieldValue('memo', 'Applied Invoice: ' + new Date());

			//walk the invoice list that we want to apply; find the invoice we are working on
			var a = deposit.getLineItemCount('apply');
			//遍历每一张客户存款下的明细行
			for (var i = 1; i <= a; i++){
				if ( deposit.getLineItemValue('apply', 'internalid', i) == invId ){
					nlapiLogExecution('ERROR', func  + 'working on invoice line:' + i, deposit.getLineItemValue('apply', 'refnum', i));
					//find the related line and mark it on; appears safe to apply as much as you can; NetSuite appears to
					// handle if there is insufficient funds and it will match the amount of the invoice
						//如果第一张付款单的余额足够核销，那么用这张存款单核销全部
						if(unpaid >= deposit.getLineItemValue('apply', 'total', i)){
						deposit.setLineItemValue('apply', 'amount', i, deposit.getLineItemValue('apply', 'total', i));
						deposit.setLineItemValue('apply', 'apply', i, 'T');
						nlapiSubmitRecord(deposit);
						return;
						}else{
							deposit.setLineItemValue('apply', 'amount', i, unpaid);
							deposit.setLineItemValue('apply', 'apply', i, 'T');
						}
//					}
				};
			};
//			nlapiSubmitRecord(deposit);
		};
//	}
		}while (result != null && result.length > 0);
	nlapiLogExecution('ERROR', 'test', '123');
};