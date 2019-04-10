/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Dec 2018     Nero
 *	
 *	系统每天凌晨00:00:00定时执行销售订单自动关闭脚本。针对销售订单状态为“pending fulfilled”和
 *  “partially fulfilled”进行查询，并根据已设定的条件筛选出符合条件的销售订单，执行订单“关闭”操作。自动关闭逻辑如下：
	1．	当销售订单满足以下条件：
		1）	销售订单的状态为“pending fulfilled”和“partially fulfilled”；
		2）	销售订单相关记录中的item fulfillment，单据状态不是“picked” and  “packed item fulfillment”；0关闭
			如果相关记录没有item fulfillment，那么也满足条件。
		3）	创建日期（字段ID：createddate）早于当前系统日期21天（不包括21天）；
		将该销售订单执行“订单关闭”操作；
		在关闭订单的前七天发送邮件“销售订单：1234将于七天后关闭！”
	2．	当销售订单满足以下条件：
		1）	销售订单的状态为“pending fulfilled”和“partially fulfilled”；
		2）	销售订单相关记录中的item fulfillment，单据状态不是“picked” and  “packed item fulfillment”；
		3）	创建日期（字段ID：createddate）早于当前系统日期14天（不包括14天）；
		4）	销售订单上的客户对应的客户主数据的CUSTOMER ACCOUNT TYPE字段（字段ID：custentitycustentity_cat）不等于P；
		将该销售订单执行“订单关闭”操作；
		在关闭订单的前七天发送邮件“销售订单：1234将于七天后关闭！”
	3．	当销售订单满足以下条件：
		1）	销售订单的状态为“pending fulfilled”和“partially fulfilled”；
		2）	销售订单相关记录中的item fulfillment，单据状态不是“picked”and  “packed item fulfillment”；
		3）	创建日期（字段ID：createddate）早于当前系统日期7天（不包括7天）；
		4）	销售订单上的客户对应的客户主数据的CUSTOMER ACCOUNT TYPE字段（字段ID：custentitycustentity_cat）不等于P和S；
		将该销售订单执行“订单关闭”操作。
		在关闭订单的前七天发送邮件“销售订单：1234将于七天后关闭！”
 */

function scheduled(type) {
		// 加载search
		var search = nlapiLoadSearch(null, 590);
		//load search需要运行search
		var searchResults = search.runSearch();
		var resultIndex = 0;
		var resultStep = 1000;
		var result;
		//超过1000条的更新，每1000条1000条的更新
		do {
			//获取search的结果
			result = searchResults.getResults(resultIndex, resultStep);
			resultIndex = resultIndex + resultStep;
			var searchLength = result.length;
//			nlapiLogExecution('debug', 'search长度', searchLength);
			
			if (result != null && searchLength > 0) {
				for (var i = 0; i < searchLength; i++) {
					var cols = result[i].getAllColumns();
					
					//销售订单的状态
					var orderStatus = result[i].getValue(cols[1]);
//	              	nlapiLogExecution('debug', 'orderStatus', orderStatus);
	              	
					//item fulfillment的状态
	              	var status = result[i].getValue(cols[5]);
//	              	nlapiLogExecution('debug', 'status', status);
	              
	              	//创建日期
	              	//[1,9]{1,2}/[1,9]{1,2}/[1,9]{4}正则匹配，正则截取如下，或者用split截取，放入数组，取第一个
	              	var createDate = result[i].getValue(cols[2]);
	              	createDate = createDate.replace(/([^\s]+)\s.*/,"$1");
	              	var o = createDate.split('/').reverse().join('/');
	              	var one = new Date(o);
//	              	nlapiLogExecution('debug', 'createDate', typeof createDate);//判断数据类型
//	              	nlapiLogExecution('debug', 'createDate', createDate);
	            	
	              	//customer account type
	              	var accountType = result[i].getValue(cols[3]);	
//	              	nlapiLogExecution('debug', 'accountType', accountType);
	              
	              	//SO的ID
					var recId = result[i].getValue(cols[0]);
					nlapiLogExecution('debug', 'recId', recId);
					
					//加载记录	
					var record = nlapiLoadRecord('salesorder', recId);
					//获取销售团队下的primary员工，获取到员工的内部ID，并到员工记录上获取该员工的邮箱
					var num = record.getLineItemCount('salesteam');
					for (var s = 1; s <= num; s++) {
						//获取primary字段
						var flag = record.getLineItemValue('salesteam', 'isprimary', s);
						//判断primary字段是否为T，如果为T，那么获取当前行号，并获取该行号的员工的内部ID===primary
						if(flag == 'T'){
//							var rowNum = record.getCurrentLineItemIndex('salesteam');
							var primary = record.getLineItemValue('salesteam', 'employee', s);
						}
					}
					//加载员工记录
					var employee = nlapiLoadRecord('employee', primary);
//					nlapiLogExecution('error', 'primary', primary);
					//获取员工的邮箱
					var email = employee.getFieldValue('email');
//					nlapiLogExecution('error', 'email', email);
					var subsidiary = record.getFieldValue('subsidiary');
					var soNum = record.getFieldValue('tranid');
					//子公司为嘉兴奥索的不执行此脚本
					if(subsidiary != "16"){
					//当前北京时间 
					var now = new Date();
					var tmp = now.getHours();
					var zone = now.getTimezoneOffset()/60;//getTimezoneOffset，与0时区的时差，单位分钟，除60，zone为-8
					zone = Math.abs(zone) + 8;//美国是西区，西区的时区的绝对值+8就是东八区
					now.setHours(tmp + zone);
					var time = nlapiDateToString(now);
					var n = time.split('/').reverse().join('/');
					var two = new Date(n);
//					nlapiLogExecution('debug', 'time', n);
//					nlapiLogExecution('debug', 'newDate', new Date());	
					
					//当前日期与创建日期的差的天数
					var day = parseInt((two.getTime() - one.getTime())/(1000*60*60*24));
//					nlapiLogExecution('debug', '当前日期', two.getTime());
//					nlapiLogExecution('debug', '创建日期', one.getTime());
//					nlapiLogExecution('debug', 'day', day);
					if((orderStatus == 'Partially Fulfilled' || orderStatus == 'Pending Fulfillment') && status == '0'){
					//第一种
					if(day==31){
						var subject1 = "SO will be close notification";
						var body1 = "Attention: Your Sales Order "+soNum+" will be close in 7 days！";
						nlapiSendEmail(primary, email, subject1, body1);	
//						nlapiLogExecution('error', 'day1', day);
//						nlapiLogExecution('error', '1', '1');
					}
					if(day > 37){
						var num1 = record.getLineItemCount('item');//关闭明细行才可以关闭订单，user events不适用！
						for (var x = 1; x <= num1; x++) {
							record. setLineItemValue('item','isclosed', x,'T');
						}
						nlapiSubmitRecord(record);
						var so = nlapiLoadRecord('salesorder', recId);
//						nlapiLogExecution('debug', '更新后订单状态1', so.getFieldValue('orderstatus'));
					}else 
					//第二种
					if(day==22 && accountType != '1'){
							var subject2 = "SO will be close notification";
							var body2 = "Attention: Your Sales Order "+soNum+" will be close in 7 days！";
							nlapiSendEmail(primary, email, subject2, body2);	
//							nlapiLogExecution('error', 'day2', day);
//							nlapiLogExecution('error', '2', '2');
					}
					if((day > 28 && day <= 37) && accountType != '1'){
//						record.setFieldValue('orderstatus', 'H');
						var num2 = record.getLineItemCount('item');
						for (var j = 1; j <= num2; j++) {
							record. setLineItemValue('item','isclosed', j,'T');
						}
						nlapiSubmitRecord(record);
						var so = nlapiLoadRecord('salesorder', recId);
//						nlapiLogExecution('debug', '更新后订单状态2', so.getFieldValue('orderstatus'));
					}else 
					if(day==15 && (accountType != '1' && accountType != '3')){
							var subject3 = "SO will be close notification";
							var body3 = "Attention: Your Sales Order "+soNum+" will be close in 7 days！";
							nlapiSendEmail(primary, email, subject3, body3);
//							nlapiLogExecution('error', 'day3', day);
//							nlapiLogExecution('error', '3', '3');
					}
					//第三种
					if((day > 21 && day <= 28) && (accountType != '1' && accountType != '3')){
//						record.setFieldValue('orderstatus', 'H');这种无法关闭订单
						var num3 = record.getLineItemCount('item');
						for (var a = 1; a <= num3; a++) {
							record. setLineItemValue('item','isclosed', a,'T');
						}
						nlapiSubmitRecord(record);
						var so = nlapiLoadRecord('salesorder', recId);
						nlapiLogExecution('debug', '更新后订单状态3', so.getFieldValue('orderstatus'));
						}
					}
					//解决脚本执行超过限制问题
					checkGovernance();
				}
			}
			}
			//当条件为假时，不再执行do，跳出循环
		} while (result != null && result.length > 0);
}
