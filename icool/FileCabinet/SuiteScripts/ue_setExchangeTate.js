function fieldChanged(type, name, linenum) {
	if (name == 'custbody_so_primary_currency' || name == 'currency') {
		// 获取SO上的值
		var primaryCurrency = nlapiGetFieldValue('custbody_so_primary_currency');
		var currency = nlapiGetFieldValue('currency');
		var date = nlapiGetFieldValue('trandate');
//		var arr = new Array();
//		arr[0]=primaryCurrency;
//		var arr2 = new Array();
//		arr2[0] = currency;
		var exchangeRate = null;
		nlapiLogExecution('debug', 'primaryCurrency', primaryCurrency);
		nlapiLogExecution('debug', 'currency', currency);
		if (primaryCurrency != null && currency != null) {
			nlapiLogExecution('debug', '测试0', '0');
			// search汇率转换
			var search = nlapiSearchRecord(null, 92,
					 [new nlobjSearchFilter('effectivedate', null,'lessthanorequalto',date)], 
					[new nlobjSearchColumn('exchangerate'),
					 new nlobjSearchColumn('effectivedate').setSort(true)]);
			nlapiLogExecution('debug', '测试1', '1');
			
			if (search != null) {
				nlapiLogExecution('debug', '测试2', '2');
//					if(baseCurrency == primaryCurrency && sourceCurrency == currency){
//						var columns = new Array();
//						columns.push(effectiveDate);
//						columns.setSort(true);//降序排列
//						var maxDate = columns[0];
//					}
					exchangeRate = search[0].getValue('exchangerate');
					var effectiveDate = search[0].getValue('effectivedate');
					
//					nlapiLogExecution('debug', 'baseCurrency', baseCurrency);
//					nlapiLogExecution('debug', 'sourceCurrency', sourceCurrency);
					nlapiLogExecution('debug', 'effectiveDate', effectiveDate);
				
//					if (baseCurrency == primaryCurrency && sourceCurrency == currency) {
//						nlapiLogExecution('debug', 'exchangeRate', exchangeRate);
//						nlapiSetFieldValue('custbody_est_exchange_rate',exchangeRate);
//						break;
//					}
//				}
			}
			var search2 = nlapiLoadSearch(null, 92);
			var searchResults = search2.runSearch();
			var result = searchResults.getResults(0, 1000);
			var searchLength = result.length;
			var baseCurrency = null;
			var sourceCurrency = null;
			if(result != null && searchLength > 0){
				for (var i = 0; i < searchLength; i++) {
				var cols = result[i].getAllColumns();
//				 获取search上的值
				baseCurrency = result[i].getValue(cols[0]);
				sourceCurrency = result[i].getValue(cols[1]);
				}
			}
			if (baseCurrency == primaryCurrency && sourceCurrency == currency) {
				nlapiLogExecution('debug', 'exchangeRate', exchangeRate);
				nlapiSetFieldValue('custbody_est_exchange_rate',exchangeRate);
				break;
			}
		}
	}
}
