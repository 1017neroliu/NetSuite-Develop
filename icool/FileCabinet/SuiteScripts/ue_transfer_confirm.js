/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Sep 2018     Nero
 *	此脚本部署到运输条件确认书上，发票信息采集金额的来源
 */
//在发票信息采集表上点击运输条件确认，将发票信息采集表上的subsidiary和currency传到运输条件确认上。
function beforeLoad(type, form, request){
	if(type != 'delete'){
	var invoice_collect_id = nlapiGetFieldValue('custbody_shipping_invoice_collect');
	if(invoice_collect_id){
		nlapiLogExecution('debug', 'id', invoice_collect_id);
		var invoice_collect_rec = nlapiLoadRecord('customtransaction_invoice_data_collect', invoice_collect_id);
		var subsidiary = invoice_collect_rec.getFieldValue('subsidiary');
		var currency = invoice_collect_rec.getFieldValue('currency');
		nlapiLogExecution('debug', 'subsidiary', subsidiary);
		nlapiLogExecution('debug', 'currency', currency);
		nlapiSetFieldValue('subsidiary', subsidiary);
		nlapiSetFieldValue('currency', currency);
		}
	}
}
/**1.点击保存后，生成单号，将此单号回传到发票信息收集表上的运输条件确认号
 * 2.回传提单日期
 * 3.把有回单日期的，发票信息采集表上的金额累加起来，赋值到SO上的发票信息采集金额
 */
function afterSubmit(type){
	if(type != 'delete'){
	//获取运输条件确认上对应的发票信息采集的id
	var invoice_collect_id = nlapiGetFieldValue('custbody_shipping_invoice_collect');
	//获取运输条件确认上的提单日期
	var bl_date = nlapiGetFieldValue('custbody_shpping_bl_date');
	//加载发票信息采集表
	var invoice_collect_rec = nlapiLoadRecord('customtransaction_invoice_data_collect', invoice_collect_id);
	//获取运输条件确认号
	var number = nlapiGetRecordId();
	nlapiLogExecution('debug', 'number', number);
	//把运输条件确认号传到发票信息采集表上
	invoice_collect_rec.setFieldValue('custbody_field_shipping_number', number);
	//如果有提单日期就执行以下操作
	if(bl_date){
		//2.把提单日期回传到发票信息采集表上
		invoice_collect_rec.setFieldValue('custbody_shpping_bl_date', bl_date);
	}
	if(!bl_date){
		invoice_collect_rec.setFieldValue('custbody_shpping_bl_date', null);
	}
	nlapiSubmitRecord(invoice_collect_rec);
		//3.把有回单日期的，发票信息采集表上的金额累加起来，赋值到SO上的发票信息采集金额
		//加载SO
		var soId = nlapiGetFieldValue('custbody_shipping_so_number');
		var soRec = nlapiLoadRecord('salesorder', soId);
		//定义发票信息采集表总金额
		var invoice_amount = 0;
		//加载发票信息采集表search
		var search = nlapiLoadSearch(null, 157);
		//添加过滤器，以SO的id为过滤条件
		search.addFilter(new nlobjSearchFilter('custbody_field_in_col_so', null, 'is', soId));
		//运行search
		var searchResults = search.runSearch();
		var resultIndex = 0;
		var resultStep = 1000;
		do{
			var result = searchResults.getResults(resultIndex, resultStep);
			resultIndex = resultIndex + resultStep;
			var searchLength = result.length;
			if (result != null && searchLength > 0) {
				//遍历search
				for (var i = 0; i < searchLength; i++) {
					var cols = result[i].getAllColumns();
					//获取search上的提单日期
					var bl_date = result[i].getValue(cols[7]);
					//如果提单日期存在，就加和
					if(bl_date){
						//获取search上的发票信息采集金额
					var amount = parseFloat(result[i].getValue(cols[4]));
					nlapiLogExecution('debug', 'amount', amount);
						invoice_amount += amount;
					}
				}
			}
		}while (result != null && result.length > 0)
		//==================实际占用额度取值====================
		var _class = soRec.getFieldValue('class');
		if(_class != '9'){
		//获取SO上的已开票金额
		var total_billed_amount = soRec.getFieldValue('custbody_so_amount_shipped');
		//加载customer获取balance
		var customerId = soRec.getFieldValue('entity');
		var customerRec = nlapiLoadRecord('customer', customerId);
		var balance = customerRec.getFieldValue('balance');
		//如果class不为内销，实际占用额度 = 发票信息采集金额 + balance - 已开票金额
		var shiji = invoice_amount + parseFloat(balance) - total_billed_amount;
		customerRec.setFieldValue('custentity_customer_actual_amount', shiji);
		nlapiSubmitRecord(customerRec);
		}
		//把值传到SO上的发票信息采集金额
		nlapiLogExecution('debug', 'invoice_amount', invoice_amount);
		soRec.setFieldValue('custbody_so_invoice_amount', invoice_amount);
		nlapiSubmitRecord(soRec);
	}
}
//解决删除运输条件确认的时候，回传到发票信息采集表的提单日期没有删除的问题
//function beforeSubmit(type){	
//	if(type == 'delete'){
//		//获取运输条件确认上对应的发票信息采集的id
//		var invoice_collect_id = nlapiGetFieldValue('custbody_shipping_invoice_collect');
//		//加载发票信息采集表
//		var invoice_collect_rec = nlapiLoadRecord('customtransaction_invoice_data_collect', invoice_collect_id);
//		invoice_collect_rec.setFieldValue('custbody_shpping_bl_date', null);
//		nlapiSubmitRecord(invoice_collect_rec);
//		//3.把有回单日期的，发票信息采集表上的金额累加起来，赋值到SO上的发票信息采集金额
//		//加载SO
//		var soId = nlapiGetFieldValue('custbody_shipping_so_number');
//		var soRec = nlapiLoadRecord('salesorder', soId);
//		//定义发票信息采集表总金额
//		var invoice_amount = 0;
//		//加载发票信息采集表search
//		var search = nlapiLoadSearch(null, 157);
//		//运行search
//		var searchResults = search.runSearch();
//		var resultIndex = 0;
//		var resultStep = 1000;
//		do{
//			var result = searchResults.getResults(resultIndex, resultStep);
//			resultIndex = resultIndex + resultStep;
//			var searchLength = result.length;
//			if (result != null && searchLength > 0) {
//				//遍历search
//				for (var i = 0; i < searchLength; i++) {
//					var cols = result[i].getAllColumns();
//					//获取search上的提单日期
//					var bl_date = result[i].getValue(cols[7]);
//					//如果提单日期存在，就加和
//					if(bl_date){
//						//获取search上的发票信息采集金额
//					var amount = parseFloat(result[i].getValue(cols[4]));
//						invoice_amount += amount;
//					}
//				}
//			}
//		}while (result != null && result.length > 0)
//		//把值传到SO上的发票信息采集金额
//		soRec.setFieldValue('custbody_so_invoice_amount', invoice_amount);
//		nlapiSubmitRecord(soRec);
//	}
//}

