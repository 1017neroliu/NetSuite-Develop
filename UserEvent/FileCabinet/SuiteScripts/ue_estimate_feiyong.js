//yaffil.wu@tctchina.com.cn  180905
function beforeLoadfeiyong(type, form) {
	try {

	} catch (e) {
		nlapiLogExecution('debug', 'beforeLoadPrintButton', 'exception=' + e);
	}

}

function aftersubmitfeiyong(type) {
	//获取SO的type和id
	var partype = nlapiGetRecordType();
	var parid = nlapiGetRecordId();

	if (type == 'create' || type == 'edit') {
		//获取SO的字体字段的id数组
		var fentancheck = [ 
                'custbody_invoice_yfsfft',
				'custbody_invoice_xbfsfft', 
				'custbody_invoice_ybfsfft',
				'custbody_invoice_bgfsfft', 
				'custbody_invoice_yjsfft' ], 
			feiyongbody = [
				'custbody_invoice_yjyf', 
				'custbody_invoice_yjxbf',
				'custbody_invoice_yjybf', 
				'custbody_invoice_yjbgf',
				'custbody_invoice_yjyj', 
				'custbody_est_yfybje',
				'custbody_est_xbfybje', 
				'custbody_est_ybfybje',
				'custbody_est_bgfybje', 
				'custbody_est_yjybje' ], 
			currencytype = [
				'custbody_est_freight_currency',
				'custbody_est_credit_currency',
				'custbody_est_guarantee_currency',
				'custbody_est_baogan_currency', 
				'custbody_est_yongji_currency' ], 
			feiyongcolumn = [
				'custcol_sales_invoice_ygyf', 
				'custcol_sales_invoice_yjxbf',
				'custcol_sales_invoice_yjybf', 
				'custcol_sales_invoice_yjbgf',
				'custcol_sales_invoice_yjyj',
				'custcol_est_freight_real_currency',
				'custcol_est_credit_real_currency',
				'custcol_est_yunbao_real_currency',
				'custcol_est_baogan_real_currency',
				'custcol_est_yongji_real_currency' ];
		//加载SO
		var curRec = nlapiLoadRecord(partype, parid);
		//获取SO的明细行
		var lineItemCountfeiyong = curRec.getLineItemCount('item');
		var basecurrency = curRec.getFieldValue('currency');
		var trandate = curRec.getFieldValue('trandate');
		//定义数组
		// get feiyongbodyvalue 
		var feiyongbodyvalue = [], fentancheckvalue = [];
		for (var i = 0; i <= 4; i++) {
			fentancheckvalue[i] = curRec.getFieldValue(fentancheck[i]);
			feiyongbodyvalue[i] = curRec.getFieldValue(feiyongbody[i]) * 1;
		}
		nlapiLogExecution('debug', 'fentancheckvalue', fentancheckvalue);
		// get  customrecord_expense_type    
		//加载search
		var expensetypeRec = nlapiSearchRecord('customrecord_expense_type',
				null, null, [
						new nlobjSearchColumn('custrecord_sales_fyzdid', null,
								null),
						new nlobjSearchColumn('custrecord_sales_fyftgz', null,
								null) ]);
		var expensetypefyzdid = [], expensetypefyftgz = [];
		for (var j = 0; expensetypeRec != null && j < expensetypeRec.length; j++) {
			var searchresult = expensetypeRec[j];
			expensetypefyzdid[j] = searchresult
					.getValue('custrecord_sales_fyzdid');
			expensetypefyftgz[j] = searchresult
					.getValue('custrecord_sales_fyftgz');

		}

		var feiyongbodyfyftgz = [];
		for (var i = 0; i <= 4; i++) {
			feiyongbodyfyftgz[i] = 0;
			for (var j = 0; j < expensetypeRec.length; j++) {
				if (expensetypefyzdid[j] == feiyongbody[i])
					feiyongbodyfyftgz[i] = expensetypefyftgz[j];
			}

		}

		// nlapiLogExecution('debug','feiyongbodyvalue',feiyongbodyvalue);
		//total quantity 
		var quantytotal = 0;
		var amounttotal = curRec.getFieldValue('total') * 1;
		nlapiLogExecution('debug', 'amounttotal', amounttotal);

		//init percent
		var custbody_invoice_yjxbfl = curRec
				.getFieldValue('custbody_invoice_yjxbfl'), custbody_invoice_commission_percent = curRec
				.getFieldValue('custbody_invoice_commission_percent');
		if (custbody_invoice_yjxbfl) {
			feiyongbodyvalue[1] = (custbody_invoice_yjxbfl.replace('%', '') * 0.01)
					* amounttotal;
			curRec.setFieldValue(feiyongbody[1], feiyongbodyvalue[1]);
			var transcurrency = curRec.getFieldValue(currencytype[1]);
			curRec.setFieldValue(feiyongbody[6], getcurrencyrate(basecurrency,
					transcurrency, trandate)
					* 1 * feiyongbodyvalue[1]);
		}

		if (custbody_invoice_commission_percent) {
			feiyongbodyvalue[4] = (custbody_invoice_commission_percent.replace(
					'%', '') * 0.01)
					* amounttotal;
			curRec.setFieldValue(feiyongbody[4], feiyongbodyvalue[4]);
			var transcurrency = curRec.getFieldValue(currencytype[4]);
			curRec.setFieldValue(feiyongbody[9], getcurrencyrate(basecurrency,
					transcurrency, trandate)
					* 1 * feiyongbodyvalue[4]);
		}

		for (var inij = 1; inij <= lineItemCountfeiyong; inij++) {
			quantytotal += curRec.getLineItemValue('item', 'quantity', inij) * 1;
		}

		//set feiyong
		var feiyongbodysum = [ 0, 0, 0, 0, 0 ];
		var purcostrealcursum = 0;
		for (var inik = 1; inik <= lineItemCountfeiyong; inik++) {
			var quantity = curRec.getLineItemValue('item', 'quantity', inik) * 1;
			var quantityper = quantity / quantytotal;
			var strtaxrate1 = curRec.getLineItemValue('item', 'taxrate1', inik);
			var grossamount;
			if (strtaxrate1)
				grossamount = (1 + strtaxrate1.replace('%', '') * 0.01)
						* curRec.getLineItemValue('item', 'amount', inik);
			else
				grossamount = curRec.getLineItemValue('item', 'amount', inik) * 1;
			var amountper = grossamount / amounttotal;
			nlapiLogExecution('debug', 'amountper', amountper);

			for (var i = 0; i <= 4; i++) {
				if (fentancheckvalue[i] == 'T') {

					if (feiyongbodyfyftgz[i] == 1) {
						curRec.setLineItemValue('item', feiyongcolumn[i], inik,
								feiyongbodyvalue[i] * amountper);
						var transcurrency = curRec
								.getFieldValue(currencytype[i]);
						curRec.setLineItemValue('item', feiyongcolumn[i + 5],
								inik, getcurrencyrate(basecurrency,
										transcurrency, trandate)
										* 1 * feiyongbodyvalue[i] * amountper);

					}
					if (feiyongbodyfyftgz[i] == 2) {
						curRec.setLineItemValue('item', feiyongcolumn[i], inik,
								feiyongbodyvalue[i] * quantityper);
						var transcurrency = curRec
								.getFieldValue(currencytype[i]);
						curRec
								.setLineItemValue('item', feiyongcolumn[i + 5],
										inik, getcurrencyrate(basecurrency,
												transcurrency, trandate)
												* 1
												* feiyongbodyvalue[i]
												* quantityper);
					}
				} else {
					feiyongbodysum[i] += curRec.getLineItemValue('item',
							feiyongcolumn[i], inik) * 1;
					var transcurrency = curRec.getFieldValue(currencytype[i]);
					curRec.setLineItemValue('item', feiyongcolumn[i + 5], inik,
							getcurrencyrate(basecurrency, transcurrency,
									trandate)
									* 1
									* (curRec.getLineItemValue('item',
											feiyongcolumn[i], inik) * 1));
				}
			}
			var purcostrealcur = curRec.getLineItemValue('item',
					'custcol_est_purchase_cost', inik)
					* 1
					* quantity
					+ curRec.getLineItemValue('item', feiyongcolumn[5], inik)
					* 1
					+ curRec.getLineItemValue('item', feiyongcolumn[6], inik)
					* 1
					+ curRec.getLineItemValue('item', feiyongcolumn[7], inik)
					* 1
					+ curRec.getLineItemValue('item', feiyongcolumn[8], inik)
					* 1
					+ curRec.getLineItemValue('item', feiyongcolumn[9], inik)
					* 1;
			var custcol_est_profit_percent = (grossamount - purcostrealcur)
					/ grossamount * 100;
			nlapiLogExecution('debug', 'custcol_est_profit_percent',
					custcol_est_profit_percent);
			curRec.setLineItemValue('item', 'custcol_est_profit_percent', inik,
					custcol_est_profit_percent);
			purcostrealcursum += purcostrealcur * 1;
		}

		for (var i = 0; i <= 4; i++) {
			if (fentancheckvalue[i] == 'F') {
				curRec.setFieldValue(feiyongbody[i], feiyongbodysum[i]);
				var transcurrency = curRec.getFieldValue(currencytype[i]);
				nlapiLogExecution('debug', 'transcurrency', basecurrency
						+ transcurrency + trandate);
				var feiyongbodysumchange = getcurrencyrate(basecurrency,
						transcurrency, trandate)
						* 1 * feiyongbodysum[i];
				curRec.setFieldValue(feiyongbody[i + 5], feiyongbodysumchange);
				if (i == 1)
					curRec.setFieldValue('custbody_invoice_yjxbfl',
							feiyongbodysum[i] / amounttotal * 100);
				if (i == 4)
					curRec.setFieldValue('custbody_invoice_commission_percent',
							feiyongbodysum[i] / amounttotal * 100);
			}
		}
		curRec.setFieldValue('custbody_est_total_cost', purcostrealcursum);
		curRec.setFieldValue('custbody_est_profit_percent',
				(amounttotal - purcostrealcursum) / amounttotal * 100);
		var id = nlapiSubmitRecord(curRec, true);

	}

}

function getcurrencyrate(basecurrency, transcurrency, trandate) {
	var transrate = 0;

	var loadSearch = nlapiLoadSearch('currencyrate',
			'customsearchcurrencyrate_for_estimate_ft');
	loadSearch.addFilter(new nlobjSearchFilter('basecurrency', null, 'is',
			basecurrency));
	loadSearch.addFilter(new nlobjSearchFilter('transactioncurrency', null,
			'is', transcurrency));

	var searchResults = loadSearch.runSearch();

	var resultkitSet = searchResults.getResults(0, 100);
	if (resultkitSet != null && resultkitSet.length > 0) {
		for (var ff = 0; ff < resultkitSet.length; ff++) {
			var resultskit = resultkitSet[ff];
			var columnskit = resultskit.getAllColumns();

			var effectdate = nlapiStringToDate(resultskit
					.getValue(columnskit[3]));
			if (nlapiStringToDate(trandate) >= effectdate) {
				transrate = resultskit.getValue(columnskit[2]) * 1;
				nlapiLogExecution('debug', 'transrate', transrate);
				return transrate;
			}
		}
	}

}
