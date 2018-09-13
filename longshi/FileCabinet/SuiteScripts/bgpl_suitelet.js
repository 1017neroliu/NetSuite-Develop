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
		
		var search = nlapiSearchRecord(null, 'customsearch35', [
				new nlobjSearchFilter('entity', null, 'is', customer),
				new nlobjSearchFilter('custbody6', null, 'is', shipping) ]);

		if (search != null) {
			nlapiLogExecution('debug', 'test', '123');
			var temp = '';
			
			var TTLQTY = 0;
			var TTLGW = 0;
			var TTLNW = 0;
			var TTLMEAS = 0;
			// 获取表单的信息
			for (var i = 0; i < search.length; i++) {
				
				var cols = search[i].getAllColumns();
				nlapiLogExecution('debug', 'all', cols[1]);
				
				var QTY = parseInt(search[i].getValue(cols[1]));
				if(!QTY){
					QTY = '0';
				}else {
					QTY = search[i].getValue(cols[1]);
				}
			
				var NW = search[i].getValue(cols[7]);
				if(!NW){
					NW = '0';
				}
				var GW = search[i].getValue(cols[8]);
				if(!GW){
					GW = '0';
				}
				var MEAS = search[i].getValue(cols[6]);
				if(!MEAS){
					MEAS = '0';
				}
				var currency = search[i].getValue(cols[9]);
				var units = search[i].getValue(cols[2]);
				var CN = search[i].getValue(cols[4]);
					// 求和
					
					TTLQTY += parseInt(QTY);
					TTLGW += parseInt(GW);
					TTLNW += parseInt(NW);
					TTLMEAS += parseInt(MEAS);
					
				//拼接模板
			 temp += '<tr style="margin-left:20px;">'+
				'<td style="text-align: cener;"><span style="font-size:12px;">'+CN+'</span></td>'+
				'<td style="text-align: center;"><span style="font-size:12px;"></span></td>'+
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
			
			renderer.setTemplate(html);
			var file = renderer.renderToString();
			var pdfFile = nlapiXMLToPDF(file);
			
			response.setContentType('PDF', '2018fulfillment'+'.pdf','inline');
			response.write(pdfFile.getValue());
		}
	}
}
