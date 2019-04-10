/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Jul 2018     Nero
 *
 */
function print(request, response) {
	if (request.getMethod() == "GET") {
		// 根据过滤条件搜索表单，返回search，获取单证打印上的两个筛选条件的字段
		var customer = request.getParameter('customerName');
		var shipping = request.getParameter('shippingNumber');
		
		nlapiLogExecution('error', '客户', customer);
		nlapiLogExecution('error', '发货票号', shipping);
		
		var CusSearch = nlapiSearchRecord('invoice', null, [
				new nlobjSearchFilter('entity', null, 'is', customer),
				new nlobjSearchFilter('custbody6', null, 'is', shipping)]);
//		new nlobjSearchColumn('quantity').setSort(true);按数量排序，降序，升序改为true
		if(CusSearch != null){
			for (var i = 0; i < CusSearch.length; i++) {
				var recId = CusSearch[i].getId();
				nlapiLogExecution('error', 'recId', recId);
				var recType = CusSearch[i].getRecordType();
				var record = nlapiLoadRecord(recType, recId);
//				var quantity =  CusSearch[i].getValue('quantity');
//				nlapiLogExecution('error', 'quantity', quantity);
			}
		}
		var search = nlapiSearchRecord(null, 34, [
      				new nlobjSearchFilter('entity', null, 'is', customer),
      				new nlobjSearchFilter('custbody6', null, 'is', shipping) ]);
		if (search != null) {
			var temp = '';
			
			var TTLQTY = 0;
			var TTLamount = 0;
			nlapiLogExecution('error', 'search.length', search.length);
			// 获取表单的信息
//			for (var i = 0; i < search.length; i++) {
//				var recId = search[i].getId();
//				nlapiLogExecution('error', 'recId', recId);
//				var recType = search[i].getRecordType();
//				var record = nlapiLoadRecord(recType, recId);
//			}
				// 获取表单明细行上的内容
//				var linenum = record.getLineItemCount('item');
//				for (var j = 1; j <= linenum; j++) {
			for (var i = 0; i < search.length; i++) {
					var cols = search[i].getAllColumns();

					var po = search[i].getValue(cols[0]);
					var item = search[i].getValue(cols[2]);
					var QTY = parseFloat(search[i].getValue(cols[4]));
					var price = parseFloat(search[i].getValue(cols[9]));
					var amount = parseFloat(search[i].getValue(cols[8]));
					
					var units = search[i].getValue(cols[5]);
					// 求和
					
					TTLQTY += QTY;
					TTLamount += amount;
					
				//拼接模板
			 temp += '<tr>'+
						'<td>&nbsp;</td>'+
						'<td style="align: center;"><span style="font-size:12px;">'+po+'</span></td>'+
						'<td colspan="1" rowspan="1" style="align: center;"><span style="font-size:12px;">'+item+'</span></td>'+
						'<td rowspan="1" style="align: center;"><span style="font-size:12px;">'+QTY.toFixed(1)+'&nbsp;&nbsp;'+units+'</span></td>'+
						'<td style="align: center;"><span style="font-size:12px;">'+price.toFixed(2)+'&nbsp;&nbsp;USD/'+units+'</span></td>'+
						'<td style="align: center;"><span style="font-size:12px;">'+amount.toFixed(2)+'&nbsp;&nbsp;${record.currency}</span></td>'+
						'</tr>';
				}
			//========================================分单位统计======================================================
			//单位合计search
			var ut,ut1,total;
			var qsearch = nlapiSearchRecord(null, 70, [
          				new nlobjSearchFilter('entity', null, 'is', customer),
          				new nlobjSearchFilter('custbody6', null, 'is', shipping) ]);
			if (qsearch != null) {
				for (var C = 0; C < qsearch.length; C++) {
      				var qcols = qsearch[C].getAllColumns();
				}
				ut = temp+
				'<tr style="margin-left:20px;">'+
				'<td colspan="6" style="align: center; height: 50px">&nbsp;</td>'+
				'</tr>'+
				'<tr>'+
				'<th style="align: left;"><span style="font-size:12px;"><strong>TTL:</strong></span></th>'+
				'<td colspan="2" rowspan="1">&nbsp;</td>'+
				'<td style="align: center;"><span style="font-size:12px;">'+parseFloat(qsearch[0].getValue(qcols[3])).toFixed(1)+'&nbsp;&nbsp;'+qsearch[0].getText(qcols[0])+'</span></td>'+
				'<td colspan="1" rowspan="1">&nbsp;</td>'+
				'<td style="align: center;"><span style="font-size:12px;">'+TTLamount.toFixed(2)+'&nbsp;&nbsp;${record.currency}</span></td>'+
				'</tr>';
				for (var A = 1; A < qsearch.length; A++) {
					ut1 += 
					'<tr>'+
					'<th style="align: left;"></th>'+
					'<td colspan="2" rowspan="1">&nbsp;</td>'+
					'<td style="align: center;"><span style="font-size:12px;">'+parseFloat(qsearch[A].getValue(qcols[3])).toFixed(1)+'&nbsp;&nbsp;'+qsearch[A].getText(qcols[0])+'</span></td>'+
					'<td colspan="1" rowspan="1">&nbsp;</td>'+
					'<td style="align: center;"></td>'+
					'</tr>';
				}
			}
//				var subId = record.getFieldValue('subsidiary');
//				var subRec = nlapiLoadRecord('subsidiary', subId);
//				var zigongsi = subRec.getFieldValue('custrecord_subsidiary_en');
				total = ut + ut1;
				var htmlFile = nlapiLoadFile(1183);
				var html = htmlFile.getValue();
				// 用temp替换模板中的#printHTML#
				html = html.replace("#printHTML#", total);
//				html2 = html.replace("#print2HTML#",zigongsi);
				var renderer = nlapiCreateTemplateRenderer();

				renderer.addRecord('record', record);
				renderer.setTemplate(html);
				var file = renderer.renderToString();
				var pdfFile = nlapiXMLToPDF(file);

				response.setContentType('PDF', record.getRecordType().toUpperCase()
								+ record.getFieldValue('tranid') + '.pdf','inline');
				response.write(pdfFile.getValue());
			
		}
	}
}


