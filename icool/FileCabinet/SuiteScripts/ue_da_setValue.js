/**
 * Module Description
 * 
 * Version 		Date 		Author 		Remarks 
 * 	1.00 	11 Sep 2018 	Nero
 * 
 */
// 应用到Deposit Application上
function beforeSubmit(type) {
	try {
		var deposit = nlapiGetFieldValue('deposit');
		nlapiLogExecution('debug', 'deposit', deposit);
		// 获取每一个deposit application上的amount总和
		var total = 0;
		//遍历deposit上的apply
		var num = nlapiGetLineItemCount('apply');
		nlapiLogExecution('debug', 'num', num);
		for (var i = 1; i <= num; i++) {
			var amount = parseFloat(nlapiGetLineItemValue('apply', 'amount', i));
			if (!amount) {
				amount = 0;
			}
			nlapiLogExecution('debug', 'amount', amount);
			total += amount;
		}
		nlapiLogExecution('debug', 'total', total);
		var depositRec = nlapiLoadRecord('customerdeposit', deposit);
		//获取未应用金额
		var weiying = depositRec.getFieldValue('custbody_deposit_undeposit_amount');
		nlapiLogExecution('debug', 'weiying', weiying);
		var weiying1 = 0;
		var weiying2 = 0;
		//当第一次create deposit的时候，未应用金额没有值，就用payment减去amount总和
		if (!weiying) {
			var payment = parseFloat(depositRec.getFieldValue('payment'));
			weiying1 = payment - total;
			nlapiLogExecution('debug', 'weiying1', weiying1);
			depositRec.setFieldValue('custbody_deposit_undeposit_amount',weiying1);
		} else {
			//如果不是第一次创建，未应用金额就等于上一个的未应用金额减去amount总和
			weiying2 = weiying - total;
			nlapiLogExecution('debug', 'weiying2', weiying2);
			depositRec.setFieldValue('custbody_deposit_undeposit_amount',weiying2);
			nlapiLogExecution('debug', 'weiying', weiying);
		}
		nlapiSubmitRecord(depositRec);
		//非前TT预付款余额
		var soId = depositRec.getFieldValue('salesorder');
		var soRec = nlapiLoadRecord('salesorder', soId);
		var non_tt = 0;
		var search = nlapiSearchRecord('customerdeposit', null, 
				[new nlobjSearchFilter('salesorder', null, 'is', soId)],
				[new nlobjSearchColumn('custbody_deposit_undeposit_amount')]);
		nlapiLogExecution('debug', 'search长度', search.length);
		if(search != null){
			for (var i = 0; i < search.length; i++) {
				var undeposit_amount = search[i].getValue('custbody_deposit_undeposit_amount');
				nlapiLogExecution('debug', 'undeposit_amount', undeposit_amount);
				non_tt += parseFloat(undeposit_amount);
			}
		}
		nlapiLogExecution('debug', 'non_tt', non_tt);
		soRec.setFieldValue('custbody_so_amount_remaining_non_tt', non_tt);
		nlapiSubmitRecord(soRec);
		
//		var qianTT = soRec.getFieldValue('custbody_so_amount_remaining_non_tt');
//		nlapiLogExecution('debug', 'qianTT', qianTT);
		//把每一次提交后的未应用金额加和，就是非前TT预付款余额
//		nlapiLogExecution('debug', 'weiying', weiying);
//		if(!qianTT){
//			var qianTT1 = weiying2;
//			nlapiLogExecution('debug', 'qianTT1', qianTT1);
//			soRec.setFieldValue('custbody_so_amount_remaining_non_tt', qianTT1);
//		}else{
//			qianTT2 = parseFloat(qianTT) + weiying2;
//			nlapiLogExecution('debug', 'qianTT2', qianTT2);
//			soRec.setFieldValue('custbody_so_amount_remaining_non_tt', qianTT2);
//		}
//		nlapiSubmitRecord(soRec);
	} catch (e) {
	}
}
