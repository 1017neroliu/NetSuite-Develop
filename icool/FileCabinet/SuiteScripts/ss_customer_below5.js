/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       18 Sep 2018     Nero
 *
 */

//customer下，如果search 131 不为空，则custentity_customer_due_date == T，否则 == F，每天更新一次
function scheduled(type) {
	//加载search  131
	var search = nlapiLoadSearch(null, 131);
	
	var searchResults = search.runSearch();
	var resultIndex = 0;
	var resultStep = 1000;
	do {
		var result = searchResults.getResults(resultIndex, resultStep);
		resultIndex = resultIndex + resultStep;
		var searchLength = result.length;
		if (result != null && searchLength > 0) {
			for (var i = 0; i < searchLength; i++) {
				var cols = result[i].getAllColumns();
				var customerId = result[i].getValue(cols[3]);
				nlapiLogExecution('debug', 'customerId', customerId);
				var customerRec = nlapiLoadRecord('customer', customerId);
				var due_date = customerRec.getFieldValue('custentity_customer_due_date');
				nlapiLogExecution('debug', 'due_date', due_date);
				//如果“是否有5天内到期的发票”没有勾选上，就勾选上
				if(due_date != 'T'){
					customerRec.setFieldValue('custentity_customer_due_date', 'T');
					nlapiSubmitRecord(customerRec);
				}
			}
		}
	}while (result != null && result.length > 0)
}
