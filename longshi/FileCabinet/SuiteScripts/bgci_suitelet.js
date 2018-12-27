/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Jul 2018     Nero
 *	当子公司不同的时候，取的数据也不同
 */
function print(request, response) {
	if (request.getMethod() == "GET") {
		// 根据过滤条件搜索表单，返回search
		var customer = request.getParameter('customerName');
		var shipping = request.getParameter('shippingNumber');
		
		nlapiLogExecution('debug', '客户', customer);	
		nlapiLogExecution('debug', '发货票号', shipping);
		//取汇率1--CNY,2--USD
//		var search3 = nlapiSearchRecord('currencyrate', null, 
//				[new nlobjSearchFilter('basecurrency', null, 'is', 1),
//				new nlobjSearchFilter('transactioncurrency', null,'is', 2)], 
//				[new nlobjSearchColumn('exchangerate'),
//				 new nlobjSearchColumn('effectivedate').setSort(true)]);
//		if(search3 != null){
//			var exchangeRate = search3[0].getValue('exchangerate');
//			nlapiLogExecution('error', 'exchangeRate', exchangeRate);
//		}
		//新自定义的一个报关汇率record，由龙石手动维护这个数据
		var bgExchangeRateRec = nlapiLoadRecord('customrecord221', 1);
		var exchangeRate = bgExchangeRateRec.getFieldValue('custrecord_exchang_rate');
		nlapiLogExecution('error', 'exchangeRate', exchangeRate);
		
		var search2 = nlapiSearchRecord('invoice', null, [
  		        new nlobjSearchFilter('entity', null, 'is', customer),
  		        new nlobjSearchFilter('custbody6', null, 'is', shipping)]);
  		if(search2 != null){
  			for (var i = 0; i < search2.length; i++) {
  				var recId = search2[i].getId();
  				var recType = search2[i].getRecordType();
  				var record = nlapiLoadRecord(recType, recId);
  			}
  		}
  		//子公司
  		var subsidiary = record.getFieldValue('subsidiary');
  		var temp = '';
		
		var TTLQTY = 0;
		var TTLAMOUNT = 0;
		var t = 0;
		var cols;
		var QTY;
		var amount;
		var	price;
		var units;
		var currency;
		var declaration;
		var poId;
		//子公司为龙石
		if(subsidiary == '1'){
  		var search = nlapiSearchRecord(null,'customsearch36', [
				new nlobjSearchFilter('entity', null, 'is', customer),
				new nlobjSearchFilter('custbody6', null, 'is', shipping)]);
		
		if (search != null) {
			// 获取表单的信息
			for (var i = 0; i < search.length; i++) {
				nlapiLogExecution('error', 'search', search[i].getRecordType());
				cols = search[i].getAllColumns();
				nlapiLogExecution('debug', 'all', cols[1]);
				
				QTY = parseFloat(search[i].getValue(cols[4])).toFixed(1);
				if(!QTY){
					QTY = '0';
				}
				nlapiLogExecution('error', 'QTY', QTY);
				amount = search[i].getValue(cols[5]);
				if(!amount){
					amount = '0';
				}
				nlapiLogExecution('error', 'amount', amount);
				price = parseFloat(search[i].getValue(cols[3])).toFixed(2);
				nlapiLogExecution('error', 'price', price);
				units = search[i].getValue(cols[6]);
				currency = search[i].getValue(cols[8]);
				declaration = search[i].getValue(cols[9]);
				
				TTLQTY += parseFloat(QTY);
				t += parseFloat(amount);
				TTLAMOUNT = t.toFixed(2);
				
				//拼接模板
			 temp += '<tr>'+
						'<td>&nbsp;</td>'+
						'<td></td>'+
						'<td colspan="1" rowspan="1" style="align: center;"><span style="font-size:12px;">'+declaration +'</span></td>'+
						'<td style="align: center;"><span style="font-size:12px;">'+QTY+'&nbsp;&nbsp;'+units+'</span></td>'+
						'<td style="align: center;"><span style="font-size:12px;">'+price+'&nbsp;&nbsp;USD/'+units+'</span></td>'+
						'<td style="align: center;"><span style="font-size:12px;">'+amount+'&nbsp;&nbsp;'+currency+'</span></td>'+
						'</tr>';
			}
		}
		var total = temp+'<tr>'+
		'<td colspan="6" style="align: center; height: 200px; vertical-align: middle;">'+
		'<div style="margin-left:100px; margin-right:100px;"><span style="align: right; font-size:12px;">${record.custbody_special_note}</span></div>'+
		'</td>'+
		'</tr>'+
		'<tr style="margin-bottom:10px">'+
		'<th style="align: left;"><span style="font-size:12px;"><strong>TTL:</strong></span></th>'+
		'<td colspan="2" rowspan="1">&nbsp;</td>'+
		'<td style="align: center;"><span style="font-size:12px;">'+TTLQTY+'&nbsp;&nbsp;'+units+'</span></td>'+
		'<td colspan="1" rowspan="1">&nbsp;</td>'+
		'<td style="align: center;"><span style="font-size:12px;">'+TTLAMOUNT+'&nbsp;&nbsp;'+currency+'</span></td>'+
		'</tr>';	
	}
		// 子公司为凯西雅
		if (subsidiary == '2') {
			var soId = record.getFieldValue('createdfrom');
			if (soId) {
				var soRec = nlapiLoadRecord('salesorder', soId);
				// 判断是否为SO
				if (soRec) {
					var num = soRec.getLineItemCount('links');
					nlapiLogExecution('error', 'num', num);
					
					for (var x = 1; x <= num; x++) {
						var type = soRec.getLineItemValue('links', 'type', x);
						nlapiLogExecution('error', 'type', type);
						
						if (type == "Purchase Order" || type == "采购订单") {
							poId = soRec.getLineItemValue('links', 'id', x);
							nlapiLogExecution('error', 'poId', poId);
							var poRec = nlapiLoadRecord('purchaseorder', poId);
							var num2 = poRec.getLineItemCount('item');
							nlapiLogExecution('error', 'num2', num2);
							
							for (var j = 1; j <= num2; j++) {
								QTY = parseFloat(poRec.getLineItemValue('item','quantity', j)).toFixed(1);
								price = (parseFloat(poRec.getLineItemValue('item', 'rate',j))/exchangeRate).toFixed(2);
								amount = (poRec.getLineItemValue('item','amount', j)/exchangeRate).toFixed(2);
								units = poRec.getLineItemValue('item','units_display', j);
								declaration = poRec.getLineItemValue('item','custcol_bgm_en', j);

								TTLQTY += parseFloat(QTY);
								t += parseFloat(amount);
								TTLAMOUNT = t.toFixed(2);
								nlapiLogExecution('error', 'test', '测试');
								// 拼接模板
								temp += '<tr>'
										+ '<td>&nbsp;</td>'
										+ '<td></td>'
										+ '<td colspan="1" rowspan="1" style="align: center;"><span style="font-size:12px;">'
										+ declaration
										+ '</span></td>'
										+ '<td style="align: center;"><span style="font-size:12px;">'
										+ QTY
										+ '&nbsp;&nbsp;'
										+ units
										+ '</span></td>'
										+ '<td style="align: center;"><span style="font-size:12px;">'
										+ price
										+ '&nbsp;&nbsp;USD/'+units+'</span></td>'
										+ '<td style="align: center;"><span style="font-size:12px;">'
										+ amount
										+ '&nbsp;&nbsp;USD</span></td>'
										+ '</tr>';
							}
						}
					}
				}
			}

			var total = temp
					+ '<tr>'
					+ '<td colspan="6" style="align: center; height: 200px; vertical-align: middle;">'
					+ '<div style="margin-left:100px; margin-right:100px;"><span style="align: right; font-size:12px;">${record.custbody_special_note}</span></div>'
					+ '</td>'
					+ '</tr>'
					+ '<tr style="margin-bottom:10px">'
					+ '<th style="align: left;"><span style="font-size:12px;"><strong>TTL:</strong></span></th>'
					+ '<td colspan="2" rowspan="1">&nbsp;</td>'
					+ '<td style="align: center;"><span style="font-size:12px;">'
					+ TTLQTY
					+ '&nbsp;&nbsp;'
					+ units
					+ '</span></td>'
					+ '<td colspan="1" rowspan="1">&nbsp;</td>'
					+ '<td style="align: center;"><span style="font-size:12px;">'
					+ TTLAMOUNT + '&nbsp;&nbsp;USD</span></td>' + '</tr>';
		}
//			var subId = record.getFieldValue('subsidiary');
//			var subRec = nlapiLoadRecord('subsidiary', subId);
//			var zigongsi = subRec.getFieldValue('custrecord_subsidiary_en');
			
			var htmlFile = nlapiLoadFile(1183);
			var html = htmlFile.getValue();
			// 用temp替换模板中的#printHTML#
			html = html.replace("#printHTML#", total);
//			html2 = html.replace("#print2HTML#",zigongsi);
			var renderer = nlapiCreateTemplateRenderer();
			renderer.addRecord('record', record);
			renderer.setTemplate(html);
			var file = renderer.renderToString();
			var pdfFile = nlapiXMLToPDF(file);
			
			response.setContentType('PDF', '2018' + '.pdf','inline');
			response.write(pdfFile.getValue());
	}
}
