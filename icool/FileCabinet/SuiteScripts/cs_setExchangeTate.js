function fieldChanged(type, name, linenum) {
	if (name == "quantity" || name == "custcol_field_so_line_extra_percent") {
		var quantity = nlapiGetCurrentLineItemValue("item", "quantity");
		var percent = parseFloat(nlapiGetCurrentLineItemValue("item", "custcol_field_so_line_extra_percent"));
		if (quantity && percent) {
			nlapiSetCurrentLineItemValue("item", "custcol_field_so_line_delivery",quantity*(1+percent*0.01) );
		}
	}
	if (name == 'custbody_so_primary_currency' || name == 'currency' || name == 'trandate') {
		try {//报些莫名其妙的错误的时候可以try catch
			// 获取SO上的值
			var primaryCurrency = nlapiGetFieldValue('custbody_so_primary_currency');
			var currency = nlapiGetFieldValue('currency');
			var date = nlapiGetFieldValue('trandate');
			
			if (primaryCurrency != null && currency != null) {
				// search汇率转换
				var search = nlapiSearchRecord(null, 92, 
						[new nlobjSearchFilter('basecurrency', null, 'is',primaryCurrency),
						new nlobjSearchFilter('transactioncurrency', null,'is', currency),
						//日期过滤器，在这个日期之前的，就是notafter
						new nlobjSearchFilter('effectivedate', null, 'notafter',date)], 
						[new nlobjSearchColumn('exchangerate'),
						new nlobjSearchColumn('effectivedate').setSort(true)]);
				
				if (search != null) {
					var exchangeRate = search[0].getValue('exchangerate');
					var effectiveDate = search[0].getValue('effectivedate');

					nlapiSetFieldValue('custbody_est_exchange_rate',exchangeRate);
				}
			}
		} catch (e) {
		}
	}
}
