function fieldChanged(type, name, linenum) {
	if (name == 'custbody_so_primary_currency' || name == 'currency' || name == 'trandate') {
			// 获取SO上的值
			var primaryCurrency = nlapiGetFieldValue('custbody_so_primary_currency');
			var currency = nlapiGetFieldValue('currency');
			var date = nlapiGetFieldValue('trandate');
			nlapiLogExecution('error', 'trandate', date);
			if (primaryCurrency && currency) {
				// search汇率转换
				var search = nlapiSearchRecord(null, customsearch92, 
						[new nlobjSearchFilter('basecurrency', null, 'is',primaryCurrency),
						new nlobjSearchFilter('transactioncurrency', null,'is', currency),
						new nlobjSearchFilter('effectivedate', null, 'notafter',date)], 
						[new nlobjSearchColumn('exchangerate'),
						new nlobjSearchColumn('effectivedate').setSort(true)]);
				
				if (search != null) {
					var exchangeRate = search[0].getValue('exchangerate');
					var effectiveDate = search[0].getValue('effectivedate');
					nlapiLogExecution('error', 'exchangeRate', exchangeRate);
					nlapiSetFieldValue('custbody_est_exchange_rate',exchangeRate);
				}
			}
	}
}
