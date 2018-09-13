/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Sep 2018     Nero
 *
 */
//审批已占用额度=未开票金额（首要币种）累计值+Balance-非前TT预付款余额（首要币种）累计值
function afterSubmit(type){
	var customerId = nlapiGetFieldValue('entity');
	var customerRec = nlapiLoadRecord('customer', customerId);
	var balance = customerRec.getFieldValue('balance');
	nlapiLogExecution('debug', 'balance', balance);
	
	var search = nlapiLoadSearch(null, 82);
	search.addFilter(new nlobjSearchFilter('entity', null, 'is', customerId));
	var searchResults = search.runSearch();
	var result = searchResults.getResults(0,1000);
	//定义未开票金额和非前TT预付款余额
	var totalweikai = 0;
	var totalfeiqian = 0;
	var totalfayun = 0;
	if(result != null){
		for (var i = 0; i < result.length; i++) {
			var cols = result[i].getAllColumns();
			var weikai = result[i].getValue(cols[6]);
			var feiqian = result[i].getValue(cols[10]);
			var fayun = result[i].getValue(cols[8]);
			//如果为没有值就取0
			if(!weikai){
				weikai = 0;
			}
			if(!feiqian){
				feiqian = 0;
			}
			if(!fayun){
				fayun = 0;
			}
				nlapiLogExecution('debug', 'weikai', weikai);
				nlapiLogExecution('debug', 'feiqian', feiqian);
				var tweikai = parseFloat(weikai);
				var tfeiqian = parseFloat(feiqian);
				var tfayun = parseFloat(fayun);
				//计算累计值
					totalweikai += tweikai;
					totalfeiqian += tfeiqian;
					totalfayun += tfayun;
		}
	}
	nlapiLogExecution('debug', 'totalweikai', totalweikai);
	nlapiLogExecution('debug', 'totalfeiqian', totalfeiqian);
	//计算审批占用额度
	var shenpi = totalweikai + parseFloat(balance) -totalfeiqian;
	nlapiLogExecution('debug', 'shenpi', shenpi);
	var shiji = totalfayun + parseFloat(balance) - totalweikai;
	var yufu = totalfeiqian;
	//赋值，提交
	customerRec.setFieldValue('custentity_customer_audit_amount', shenpi);
	customerRec.setFieldValue('custentity_customer_actual_amount', shiji);
	customerRec.setFieldValue('custentity_customer_pp_remaining', yufu);
	nlapiSubmitRecord(customerRec);
  
	//2018-09-12  kelly
	var soId = nlapiGetRecordId();
	if (soId) {
		var search = nlapiSearchRecord("customerdeposit", null,
				[new nlobjSearchFilter("salesorder", null, "is", soId)]);
		var num = 0;
		if (search != null) {
			for (var i = 0; i < search.length; i++) {
				var record1 = nlapiLoadRecord(search[i].getRecordType(), search[i].getId());
			num += parseFloat(record1.getFieldValue("payment"));
			}
		}
		var record = nlapiLoadRecord("salesorder", soId);
		var total = record.getFieldValue("total");
		var percent = num / total * 100;
		percent = percent.toFixed(2)+"%";
		record.setFieldValue("custbody_field_so_actual_dep_per", percent);
		nlapiSubmitRecord(record);
	}
	
}
