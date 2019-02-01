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
		
//		nlapiLogExecution('error', '客户', customer);	
//		nlapiLogExecution('error', '发货票号', shipping);
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
//		nlapiLogExecution('error', 'exchangeRate', exchangeRate);
		
		var search2 = nlapiSearchRecord('invoice', null, [
  		        new nlobjSearchFilter('entity', null, 'is', customer),
  		        new nlobjSearchFilter('custbody6', null, 'is', shipping),
  		        new nlobjSearchFilter('mainline', null, 'is', 'T')]);//过滤科目，防止重复打印
		//这里的search长度为4，但是符合条件的invoice只有一条，下面打印出来的record的ID也是4个重复的ID
//		nlapiLogExecution('error', 'search2.length', search2.length);
  		if(search2 != null){
  				var recId = search2[0].getId();
//  				nlapiLogExecution('error', 'recId', recId);
  				var recType = search2[0].getRecordType();
  				var record = nlapiLoadRecord(recType, recId);
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
//				nlapiLogExecution('debug', 'all', cols[1]);
				
				QTY = parseFloat(search[i].getValue(cols[4]));
				if(!QTY){
					QTY = 0;
				}
				nlapiLogExecution('error', 'QTY', QTY);
				amount = parseFloat(search[i].getValue(cols[5]));
				if(!amount){
					amount = 0;
				}
//				nlapiLogExecution('error', 'amount', amount);
				price = parseFloat(search[i].getValue(cols[3])).toFixed(2);
//				nlapiLogExecution('error', 'price', price);
				units = search[i].getValue(cols[6]);
				currency = search[i].getValue(cols[8]);
				declaration = search[i].getValue(cols[9]);
				
				TTLQTY += QTY;
				nlapiLogExecution('error', 'TTLQTY', TTLQTY);
				t += parseFloat(amount);
				TTLAMOUNT = t.toFixed(2);
				
				//拼接模板
			 temp += '<tr>'+
						'<td>&nbsp;</td>'+
						'<td></td>'+
						'<td colspan="1" rowspan="1" style="align: center;"><span style="font-size:12px;">'+declaration +'</span></td>'+
						'<td style="align: center;"><span style="font-size:12px;">'+QTY.toFixed(1)+'&nbsp;&nbsp;'+units+'</span></td>'+
						'<td style="align: center;"><span style="font-size:12px;">'+price+'&nbsp;&nbsp;USD/'+units+'</span></td>'+
						'<td style="align: center;"><span style="font-size:12px;">'+amount+'&nbsp;&nbsp;'+currency+'</span></td>'+
						'</tr>';
			}
		
		var total = temp+
//		'<tr>'+
//		'<td colspan="6" style="align: center; height: 200px; vertical-align: middle;">'+
//		'<div style="margin-left:100px; margin-right:100px;"><span style="align: right; font-size:12px;">${record.custbody_special_note}</span></div>'+
//		'</td>'+
//		'</tr>'+
		'<tr style="margin-left:20px;">'+
		'<td colspan="6" style="align: center; height: 50px">&nbsp;</td>'+
		'</tr>'+
		'<tr style="margin-bottom:10px">'+
		'<th style="align: left;"><span style="font-size:12px;"><strong>TTL:</strong></span></th>'+
		'<td colspan="2" rowspan="1">&nbsp;</td>'+
		'<td style="align: center;"><span style="font-size:12px;">'+TTLQTY.toFixed(1)+'&nbsp;&nbsp;'+units+'</span></td>'+
		'<td colspan="1" rowspan="1">&nbsp;</td>'+
		'<td style="align: center;"><span style="font-size:12px;">'+TTLAMOUNT+'&nbsp;&nbsp;'+currency+'</span></td>'+
		'</tr>';
		}
	}
		// 子公司为凯喜雅
		if (subsidiary == '2') {
//			var soId = record.getFieldValue('createdfrom');
//			if (soId) {
//				var soRec = nlapiLoadRecord('salesorder', soId);
//				// 判断是否为SO
//				if (soRec) {
//					var num = soRec.getLineItemCount('links');
//					nlapiLogExecution('error', 'num', num);
//					
//					for (var x = 1; x <= num; x++) {
//						var type = soRec.getLineItemValue('links', 'type', x);
//						nlapiLogExecution('error', 'type', type);
//						
//						if (type == "Purchase Order" || type == "采购订单") {
//							poId = soRec.getLineItemValue('links', 'id', x);
//							nlapiLogExecution('error', 'poId', poId);
//							var poRec = nlapiLoadRecord('purchaseorder', poId);
			//========================不用search，未做合并打印==============================================
//							for (var q = 0; q < search2.length; q++) {
//								var kxyrecId = search2[q].getId();
//				  				nlapiLogExecution('error', 'kxyrecId', kxyrecId);
//				  				var kxyrecType = search2[q].getRecordType();
//				  				var kxyrecord = nlapiLoadRecord(kxyrecType, kxyrecId);
							//从invoice上取数据
//							var num2 = kxyrecord.getLineItemCount('item');
//							nlapiLogExecution('error', 'num2', num2);
//							for (var j = 1; j <= num2; j++) {
			//====================用45号search==================================================================
			var kxysearch = nlapiSearchRecord(null,'customsearch45', [
							   				new nlobjSearchFilter('entity', null, 'is', customer),
							   				new nlobjSearchFilter('custbody6', null, 'is', shipping)]);
			if(kxysearch != null){
				for (var b = 0; b < kxysearch.length; b++) {
					cols = kxysearch[b].getAllColumns();
//					QTY = parseFloat(kxyrecord.getLineItemValue('item','quantity', j)).toFixed(1);
					QTY = parseFloat(kxysearch[b].getValue(cols[4])).toFixed(1);
					if(!QTY){
						QTY = 0;
					}
	//								nPrice = parseFloat(record.getLineItemValue('item', 'rate',j));
	//								var taxRate = parseFloat(record.getLineItemValue('item','taxrate1', j))/100;
	//								nlapiLogExecution('error', 'taxRate', taxRate);
//					var bgPrice = kxyrecord.getLineItemValue('item', 'custcol_bill_rate', j);
					var bgPrice = parseFloat(kxysearch[b].getValue(cols[3]));
					nlapiLogExecution('error', 'bgPrice', bgPrice);
					var price = (bgPrice /exchangeRate).toFixed(2);
//					amount = (kxyrecord.getLineItemValue('item','custcol_bill_amount', j)/exchangeRate).toFixed(2);
					var totalPrice = parseFloat(kxysearch[b].getValue(cols[5]));
					if(!totalPrice){
						totalPrice = 0;
					}
					amount = (totalPrice/exchangeRate).toFixed(2);
					
					nlapiLogExecution('error', 'amount', amount);
//					units = kxyrecord.getLineItemValue('item','units_display', j);
					units = kxysearch[b].getValue(cols[6]);
//					declaration = kxyrecord.getLineItemValue('item','custcol_bgm_en', j);
					declaration = kxysearch[b].getValue(cols[9]);
	
					TTLQTY += parseFloat(QTY);
					t += parseFloat(amount);
//					nlapiLogExecution('error', 't', t);
					TTLAMOUNT = t.toFixed(2);
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
						
//						}
//					}
//				}
//			}

			var total = temp
//					+ '<tr>'
//					+ '<td colspan="6" style="align: center; height: 200px; vertical-align: middle;">'
//					+ '<div style="margin-left:100px; margin-right:100px;"><span style="align: right; font-size:12px;">${record.custbody_special_note}</span></div>'
//					+ '</td>'
//					+ '</tr>'
					+'<tr style="margin-left:20px;">'
					+'<td colspan="6" style="align: center; height: 50px">&nbsp;</td>'
					+'</tr>'
					+ '<tr style="margin-bottom:10px">'
					+ '<th style="align: left;"><span style="font-size:12px;"><strong>TTL:</strong></span></th>'
					+ '<td colspan="2" rowspan="1">&nbsp;</td>'
					+ '<td style="align: center;"><span style="font-size:12px;">'
					+ TTLQTY.toFixed(1)
					+ '&nbsp;&nbsp;'
					+ units
					+ '</span></td>'
					+ '<td colspan="1" rowspan="1">&nbsp;</td>'
					+ '<td style="align: center;"><span style="font-size:12px;">'
					+ TTLAMOUNT + '&nbsp;&nbsp;&nbsp;USD</span></td>' + '</tr>';
		}
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
