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
		
		var search = nlapiSearchRecord(null,'customsearch36', [
				new nlobjSearchFilter('entity', null, 'is', customer),
				new nlobjSearchFilter('custbody6', null, 'is', shipping)]);
		
		if (search != null) {
			var temp = '';
			
			var TTLQTY = 0;
			var TTLAMOUNT = 0;
			// 获取表单的信息
			for (var i = 0; i < search.length; i++) {
				
				var cols = search[i].getAllColumns();
				nlapiLogExecution('debug', 'all', cols[1]);
				
				var QTY = search[i].getValue(cols[3]);
				if(!QTY){
					QTY = '0';
				}
				var amount = search[i].getValue(cols[4]);
				if(!amount){
					amount = '0';
				}
				
				var price = search[i].getValue(cols[2]);
				var units = search[i].getValue(cols[5]);
				var currency = search[i].getValue(cols[7]);
				
				TTLQTY += parseInt(QTY);
				TTLAMOUNT += parseInt(amount);
				
				//拼接模板
			 temp += '<tr>'+
						'<td>&nbsp;</td>'+
						'<td></td>'+
						'<td></td>'+
						'<td style="text-align: center;"><span style="font-size:12px;">'+QTY+'&nbsp;&nbsp;'+units+'</span></td>'+
						'<td style="text-align: center;"><span style="font-size:12px;">'+price+'</span></td>'+
						'<td style="text-align: center;"><span style="font-size:12px;">'+amount+'&nbsp;&nbsp;'+currency+'</span></td>'+
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
			'<td style="text-align: center;"><span style="font-size:12px;">'+TTLAMOUNT+'&nbsp;&nbsp;'+currency+'</span></td>'+
			'</tr>';	
			var htmlFile = nlapiLoadFile(1183);
			var html = htmlFile.getValue();
			// 用temp替换模板中的#printHTML#
			html = html.replace("#printHTML#", total);
			
			var renderer = nlapiCreateTemplateRenderer();
			
			renderer.setTemplate(html);
			var file = renderer.renderToString();
			var pdfFile = nlapiXMLToPDF(file);
			
			response.setContentType('PDF', '2018' + '.pdf','inline');
			response.write(pdfFile.getValue());
		}
	}
}
