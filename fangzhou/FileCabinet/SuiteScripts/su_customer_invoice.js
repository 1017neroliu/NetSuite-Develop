/**
 * Module Description
 * 
 * Version 	  Date 			 Author 		Remarks 
 * 1.00 	  31 Aug 2018 	 Nero
 * 
 */

/**
 * 需求：
 * 		search并遍历所有customer下的invoice，如果存在invoice中的字段daysoverdue>=15天
 * 		则custentity1的值设置为true。如果所有的invoice中的字段daysoverdue全都<15天，则custentity1
 * 		的值设置为false。每天上午5点半更新一次，执行一次脚本。
 * @param recType
 * @param recId
 */
function scheduleUpdate() {
	// 加载search
	var search = nlapiLoadSearch(null, 463);
	// var len = result.length % 1000 == 0?result.length/1000:result.length/1000+1;
	//运行search，返回结果
	var searchResults = search.runSearch();
	var resultIndex = 0;
	var resultStep = 1000;
	//超过1000条的更新
	do {
		var result = searchResults.getResults(resultIndex, resultStep);
		
		resultIndex = resultIndex + resultStep;
		var searchLength = result.length;
		if (result != null && searchLength > 0) {
			for (var i = 0; i < searchLength; i++) {
				var cols = result[i].getAllColumns();
				var day = result[i].getText(cols[4]);
				var status = result[i].getText(cols[5]);
				
				var recId = result[i].getValue(cols[0]);
				//加载记录
				var record = nlapiLoadRecord('customer', recId);
				
				//获取发件人邮箱，发件人
//				var linenum = record.getLineItemCount('salesteam');
//				for (var x = 1; x <= linenum; x++) {
//					var primary = record.getLineItemValue('salesteam', 'primary', x);
//					if(primary == 'T'){
//						var employee = record.getLineItemValue('salesteam', 'employee');
//					}
//				}
				//获取employee的Id
//				var id = nlapiGetFieldValue('employee');
				//加载employee所在的record
//				var employeeRec = nlapiLoadRecord('employee', id);
				//获取employee的邮箱
//				var email = employeeRec.getFieldValue('email');
				
				
				//发送邮件必需信息
//				var author; 
//				var recipient = record.getFieldValue('email');
//				var subject1 = '解锁停止信用';
//				var subject1 = '停止信用';
//				var body1 = 'Dear'+sName1+','+'\n\n'+
//					'Please note that the subject customer'+ cName+'\n'+'has been blocked for further order fulfilment as one or more of their open invoices are overdue by 15 days now.'+'\n\n'+ 
//					'Please call the customer to ensure payment is made for these invoices. The customer account would be unblocked once the payment is cleared.'+'\n\n'+
//					'Regards'+'\n\n\n'+
//					'Accounts Receivable Team';
//				var body2 = 'Dear'+sName2+','+'\n\n'+
//					'The subject customer'+ cName2+'\n'+'has been unblocked for further order fulfilment as their overdue 15 days invoices have been settled.'+'\n\n'+
//					'Regards'+'\n\n\n'+
//					'Accounts Receivable Team';
				
				//当天数为小于15天的时候将字段设置为F
				if (day < 15 || !day) {
					record.setFieldValue('custentity1', 'F');
					//解锁停止信用的时候，发送邮件通知客户
//					nlapiSendEmail(author, recipient, subject1, body1);
				}
				//当天数大于等于15天时，将字段值设置为T
				if (day >= 15) {
					record.setFieldValue('custentity1', 'T');
					//当用户信用被停止的时候，发送邮件通知客户
//					nlapiSendEmail(author, recipient, subject2, body2);
				}
			}
		}
		// 提交记录
		nlapiSubmitRecord(record);
		//当条件为假时，不再执行do，跳出循环
	} while (result != null && result.length > 0)
}
