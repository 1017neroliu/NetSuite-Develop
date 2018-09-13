/**
 * Module Description
 * 
 * Version 		Date 		Author 	Remarks 
 * 1.00 	30 Aug 2018 	Nero
 * 
 */
function beforeSubmit(type) {
	// 根据item Pricing上的Customer获取对应的Customer记录
	var CId = nlapiGetFieldValue('custrecord_customer');
	nlapiLogExecution('debug', 'CId', CId);
	// 需要传的值
	var item = nlapiGetFieldText('custrecord_item');
	var currency = nlapiGetFieldText('custrecord_currency');
	if(currency == 'CNY'){
		currency = '1';
	}else if(currency == 'USD'){
		currency = '2';
	}else if(currency == 'EUR'){
		currency = '4';
	}else if(currency == 'AUD'){
		currency = '5';
	}
	nlapiLogExecution('debug', 'currency', currency);
	
	var rate = nlapiGetFieldValue('custrecord_rate');
	nlapiLogExecution('debug', '价格', rate);
	// 当status==‘Approved’时，才将值传过去
	var status = nlapiGetFieldValue('custrecord_status');
	if ('2' == status) {
		// 加载对应的Customer
		var CRec = nlapiLoadRecord('customer', CId);
		
		var num = CRec.getLineItemCount('itempricing');
		var itemName;
		var i = 1;
		for ( ;i <= num; i++) {
			itemName = CRec.getLineItemText('itempricing', 'item', i);
			if (item == itemName) {
				nlapiLogExecution('debug', '测试', '1');
				CRec.setLineItemValue('itempricing', 'level', i,'-1');
				CRec.setLineItemValue('itempricing', 'currency',i,currency);
				CRec.setLineItemValue('itempricing', 'price', i,rate);
				nlapiLogExecution('debug', '测试', '2');
				break;
			}
		}
		if(i == num+1){
		// 新建并将值设置进去
		CRec.selectNewLineItem('itempricing');
		CRec.setCurrentLineItemText('itempricing', 'item', item);
		// level值设置固定值，值为Custom
		CRec.setCurrentLineItemValue('itempricing', 'level', '-1');
		CRec.setCurrentLineItemValue('itempricing', 'currency', currency);
		CRec.setCurrentLineItemValue('itempricing', 'price', rate);
		CRec.commitLineItem('itempricing');
		CRec.setFieldValue('custentity_vip', 'T');
		}
		// 保存记录
		nlapiSubmitRecord(CRec);
	}
}
