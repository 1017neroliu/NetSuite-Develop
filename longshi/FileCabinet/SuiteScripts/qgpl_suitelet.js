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
		
		var search = nlapiSearchRecord('itemfulfillment', null, [
				new nlobjSearchFilter('entity', null, 'is', customer),
				new nlobjSearchFilter('custbody6', null, 'is', shipping) ]);

		if (search != null) {
			var temp = '';
			
			var TTLQTY = 0;
			var TTLGW = 0;
			var TTLNW = 0;
			var TTLMEAS = 0;
			// 获取表单的信息
			for (var i = 0; i < search.length; i++) {
				var recId = search[i].getId();
				var recType = search[i].getRecordType();
				var record = nlapiLoadRecord(recType, recId);

				nlapiLogExecution('debug', 'ID', recId);
				nlapiLogExecution('debug', 'TYPE', recType);
			
				// 获取表单明细行上的内容
				var linenum = record.getLineItemCount('item');
				for (var j = 1; j <= linenum; j++) {

					var CN = record.getLineItemValue('item', 'custcol_rolls', j);
					var DESCRIPTION = record.getLineItemText('item', 'item', j);
					var QTY = parseInt(record.getLineItemValue('item', 'quantity', j));
					var GW = parseInt(record.getLineItemValue('item', 'custcol7', j));
					var NW = parseInt(record.getLineItemValue('item', 'custcol9', j));
					var MEAS = parseInt(record.getLineItemValue('item', 'custcol6', j));
					
					nlapiLogExecution('debug', '卷', CN);
					
					var units = record.getLineItemValue('item', 'unitsdisplay',j);
					// 求和
					
					TTLQTY += QTY;
					TTLGW += GW;
					TTLNW += NW;
					TTLMEAS += MEAS;
					
				//拼接模板
			 temp += '<tr style="margin-left:20px;">'+
				'<td style="text-align: cener;"><span style="font-size:12px;">'+CN+' Rolls</span></td>'+
				'<td style="text-align: center;"><span style="font-size:12px;">'+DESCRIPTION+'</span></td>'+
				'<td style="text-align: center;"><span style="font-size:12px;">'+QTY+' '+units+'</span></td>'+
				'<td style="text-align: center;"><span style="font-size:12px;">'+GW+' KGS</span></td>'+
				'<td style="text-align: center;"><span style="font-size:12px;">'+NW+' KGS</span></td>'+
				'<td style="text-align: center;"><span style="font-size:12px;">'+MEAS+' CBM</span></td></tr>';
				}
				
				var total = temp+'<tr style="margin-left:20px;">'+
				'<td colspan="6" style="text-align: center; height: 50px">&nbsp;</td>'+
				'</tr>'+
				'<tr style="margin-left:20px;">'+
				'<td><span style="font-size:12px;"><strong>TTL:</strong></span></td>'+
				'<td>&nbsp;</td>'+
				'<td style="text-align: center;"><span style="font-size:12px;">'+TTLQTY+' '+units+'</span></td>'+
				'<td style="text-align: center;"><span style="font-size:12px;">'+TTLGW+' KGS</span></td>'+
				'<td style="text-align: center;"><span style="font-size:12px;">'+TTLNW+' KGS</span></td>'+
				'<td style="text-align: center;"><span style="font-size:12px;">'+TTLMEAS+' CBM</span></td>'+
				'</tr>'+
				'<tr style="margin-left:20px;">'+
				'<td colspan="6" style="text-align: center; height: 50px">&nbsp;</td>'+
				'</tr>'+
				'<tr style="margin-bottom:10px; margin-left:20px;">'+
				'<td colspan="2" style="text-align: left;"><span style="font-size:12px;"><strong>TOTAL GROSS WEIGHT:</strong></span></td>'+
				'<td style="align: center;"><span style="font-size:12px;">'+TTLGW+' KGS</span></td>'+
			    '<td>&nbsp;</td>'+
				'<td>&nbsp;</td>'+
				'<td>&nbsp;</td>'+
				'</tr>';	
				var htmlFile = nlapiLoadFile(1167);
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
