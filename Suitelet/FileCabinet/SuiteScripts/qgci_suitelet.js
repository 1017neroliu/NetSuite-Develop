/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Jul 2018     Nero
 *
 */
function print(request, response) {
	if (request.getMethod() == "GET") {
		// 根据过滤条件搜索表单，返回search
		var customer = request.getParameter('customerName');
		var shipping = request.getParameter('shippingNumber');
		
		nlapiLogExecution('debug', '客户', customer);
		nlapiLogExecution('debug', '发货票号', shipping);
		
		var search = nlapiSearchRecord('invoice', null, [
				new nlobjSearchFilter('entity', null, 'is', customer),
				new nlobjSearchFilter('custbody6', null, 'is', shipping) ]);
		
		if (search != null) {
			var temp = '';
			
			var TTLQTY = 0;
			var TTLamount = 0;
			// 获取表单的信息
			for (var i = 0; i < search.length; i++) {
				var recId = search[i].getId();
				var recType = search[i].getRecordType();
				var record = nlapiLoadRecord(recType, recId);
				
				// 获取表单明细行上的内容
				var linenum = record.getLineItemCount('item');
				for (var j = 1; j <= linenum; j++) {

					var po = record.getLineItemValue('item', 'custcol_originnumber', j);
					var item = record.getLineItemText('item', 'item', j);
					var QTY = parseInt(record.getLineItemValue('item', 'quantity', j));
					var price = parseInt(record.getLineItemValue('item', 'rate', j));
					var amount = parseInt(record.getLineItemValue('item', 'amount', j));
					
					var units = record.getLineItemValue('item', 'units_display',j);
					// 求和
					
					TTLQTY += QTY;
					TTLamount += amount;
					
				//拼接模板
			 temp += '<tr>'+
						'<td>&nbsp;</td>'+
						'<td style="text-align: center;"><span style="font-size:12px;">'+po+'</span></td>'+
						'<td colspan="1" rowspan="1" style="text-align: center;"><span style="font-size:12px;">'+item+'</span></td>'+
						'<td rowspan="1" style="text-align: center;"><span style="font-size:12px;">'+QTY+'&nbsp;&nbsp;'+units+'</span></td>'+
						'<td style="text-align: center;"><span style="font-size:12px;">'+price+'</span></td>'+
						'<td style="text-align: center;"><span style="font-size:12px;">'+amount+'&nbsp;&nbsp;${record.currency}</span></td>'+
						'</tr>';
				}
				
				var total = temp+'<tr>'+
				'<td colspan="6" style="text-align: center; height: 200px; vertical-align: middle;">'+
				'<div style="margin-left:100px; margin-right:100px;"><span style="text-align: right; font-size:12px;">${record.custbody_special_note}</span></div>'+
				'</td>'+
				'</tr>'+
				'<tr style="margin-bottom:10px">'+
				'<th style="text-align: right;"><span style="font-size:12px;">TTL:</span></th>'+
				'<td colspan="2" rowspan="1">&nbsp;</td>'+
				'<td style="text-align: center;"><span style="font-size:12px;">'+TTLQTY+'&nbsp;&nbsp;'+units+'</span></td>'+
				'<td colspan="1" rowspan="1">&nbsp;</td>'+
				'<td style="text-align: center;"><span style="font-size:12px;">${record.total}&nbsp;&nbsp;${record.currency}</span></td>'+
				'</tr>';	
				var htmlFile = nlapiLoadFile(1183);
				var html = htmlFile.getValue();
				// 用temp替换模板中的#printHTML#
				html = html.replace("#printHTML#", total);
				
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
}
