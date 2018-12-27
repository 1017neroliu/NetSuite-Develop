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
		
		var companyname;
		var phone;
		var vatregnumber;
		var address;
		var search2 = nlapiSearchRecord('itemfulfillment', null, [
	    new nlobjSearchFilter('entity', null, 'is', customer),
	    new nlobjSearchFilter('custbody6', null, 'is', shipping)]);
	if(search2 != null){
		for (var i = 0; i < search2.length; i++) {
			var recId = search2[i].getId();
			var recType = search2[i].getRecordType();
			var record = nlapiLoadRecord(recType, recId);
			var soId = record.getFieldValue('createdfrom');
			var so = nlapiLoadRecord('salesorder', soId);
			if(so){
				var customerId = so.getFieldValue('entity');
				var customerRec = nlapiLoadRecord('customer', customerId);
				
				var address = so.getFieldValue('billaddress');
				companyname = customerRec.getFieldValue('companyname');
				phone = customerRec.getFieldValue('phone');
				vatregnumber = customerRec.getFieldValue('vatregnumber');
				if(!vatregnumber){
					vatregnumber = '';
				}
				nlapiLogExecution('error', 'companyname', companyname);
			}
		}
	}
		
		var search = nlapiSearchRecord(null, 48, [
				new nlobjSearchFilter('entity', null, 'is', customer),
				new nlobjSearchFilter('custbody6', null, 'is', shipping) ]);
		if (search != null) {
			var temp = '';
			
			var TTLQTY = 0;
			var TTLGW = 0;
			var TTLNW = 0;
			var TTLMEAS = 0;
			// 获取search上的值
			for (var i = 0; i < search.length; i++) {
				var cols = search[i].getAllColumns();
				var CN = parseFloat(search[i].getValue(cols[11]));
				var DESCRIPTION = search[i].getValue(cols[7]);
				var QTY = parseFloat(search[i].getValue(cols[12]));
				var GW = parseFloat(search[i].getValue(cols[8]));
				var NW = parseFloat(search[i].getValue(cols[9]));
				var str = search[i].getValue(cols[10]);
				nlapiLogExecution('error', 'str', str);
				
				var start = str.indexOf('.');
				//如果start不是0开头的
				if(start == 0){
					str = '0' + str;
				}else if(start == -1) {
					str = str;
				}
				var MEAS = parseFloat(str);
				nlapiLogExecution('error', 'MEAS', MEAS);
				nlapiLogExecution('error', '卷', CN);
				
				var units = search[i].getValue(cols[13]);
				// 求和
				TTLQTY += QTY;
				TTLGW += GW;
				TTLNW += NW;
				TTLMEAS += MEAS;
				nlapiLogExecution('error', 'TTLMEAS', TTLMEAS);
				
//				// 获取表单明细行上的内容
//				var linenum = record.getLineItemCount('item');
//				nlapiLogExecution('error', 'linenum', linenum);
//				for (var j = 1; j <= linenum; j++) {
//					
//					var CN = record.getLineItemValue('item', 'custcol_rolls', j);
//					var DESCRIPTION = record.getLineItemText('item', 'item', j);
//					var QTY = parseFloat(record.getLineItemValue('item', 'quantity', j));
//					var GW = parseFloat(record.getLineItemValue('item', 'custcol7', j));
//					var NW = parseFloat(record.getLineItemValue('item', 'custcol9', j));
//					var str = record.getLineItemValue('item', 'custcol6', j);
				
				//拼接模板
			 temp += '<tr style="margin-left:20px;">'+
				'<td style="align: right;"><span style="font-size:12px;">'+CN+'&nbsp;&nbsp;</span></td>'+
				'<td style="align: left;"><span style="font-size:12px;">Rolls</span></td>'+
				'<td colspan="2" style="align: center;"><span style="font-size:12px;">'+DESCRIPTION+'</span></td>'+
				'<td style="align: right;"><span style="font-size:12px;">'+QTY.toFixed(1)+'&nbsp;&nbsp;</span></td>'+
				'<td style="align: left;"><span style="font-size:12px;">'+units+'</span></td>'+
				'<td style="align: right;"><span style="font-size:12px;">'+GW.toFixed(2)+'&nbsp;&nbsp;</span></td>'+
				'<td style="align: left;"><span style="font-size:12px;">KGS</span></td>'+
				'<td style="align: right;"><span style="font-size:12px;">'+NW.toFixed(2)+'&nbsp;&nbsp;</span></td>'+
				'<td style="align: left;"><span style="font-size:12px;">KGS</span></td>'+
				'<td style="align: right;"><span style="font-size:12px;">'+MEAS.toFixed(2)+'&nbsp;&nbsp;</span></td>'+
			 	'<td style="align: left;"><span style="font-size:12px;">CBM</span></td></tr>';
		}
			var table = '<table align="center" border="0" cellpadding="3" cellspacing="2" style="width:700px;"><tr>'+
			'<td style="width:100px"></td>'+
			'<td style="align: right; width: 50px"><span style="font-size:12px;"><strong>TO:</strong></span></td>'+
			'<td style="align: left; width: 200px"><span style="font-size:12px;">'+companyname+'</span></td>'+
			'<td style="width:50px"></td>'+
			'<td style="align: left; width: 100px"><span style="font-size:12px;"><strong>INVOICE NO.:</strong></span></td>'+
			'<td style="align: left; width: 100px"><span style="font-size:12px;">${record.custbody6}</span></td>'+
			'<td style="width:100px"></td>'+
			'</tr>'+
			'<tr>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'<td colspan="1" rowspan="4" style="align: left; width: 200px;"><span style="font-size:12px;">${record.shipaddress}</span></td>'+
			'<td>&nbsp;</td>'+
			'<td style="align: left; width: 100px"><span style="font-size:12px;"><strong>DATE:</strong></span></td>'+
			'<td style="align: left; width: 100px"><span style="font-size:12px;">${record.createdfrom.trandate}</span></td>'+
			'<td>&nbsp;</td>'+
			'</tr>'+
			'<tr>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'<th><span style="font-size:12px;"></span></th>'+
			'<td>&nbsp;</td>'+
			'<td><span style="font-size:12px;"></span></td>'+
			'<td>&nbsp;</td>'+
			'</tr>'+
			'<tr>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'</tr>'+
			'<tr>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'</tr>'+
			'<tr>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'<td style="align: left; width: 200px; font-size: 12px;"><span style="font-size:12px;">'+phone+'</span></td>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'</tr>'+
			'<tr>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'<td style="align: left; width: 200px;"><span style="font-size: 12px;">'+vatregnumber+'</span></td>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'<td>&nbsp;</td>'+
			'</tr></table>';
			 var total = temp+'<tr style="margin-left:20px;">'+
				'<td colspan="12" style="align: center; height: 50px">&nbsp;</td>'+
				'</tr>'+
				'<tr style="margin-left:20px;">'+
				'<td colspan="2" style="align: left;"><span style="font-size:12px;"><strong>TTL:</strong></span></td>'+
				'<td colspan="2"></td>'+
				'<td style="align: right;"><span style="font-size:12px;">'+TTLQTY.toFixed(1)+'&nbsp;&nbsp;</span></td>'+
				'<td style="align: left;"><span style="font-size:12px;">'+units+'</span></td>'+
				'<td style="align: right;"><span style="font-size:12px;">'+TTLGW.toFixed(2)+'&nbsp;&nbsp;</span></td>'+
				'<td style="align: left;"><span style="font-size:12px;">KGS</span></td>'+
				'<td style="align: right;"><span style="font-size:12px;">'+TTLNW.toFixed(2)+'&nbsp;&nbsp;</span></td>'+
				'<td style="align: left;"><span style="font-size:12px;">KGS</span></td>'+
				'<td style="align: right;"><span style="font-size:12px;">'+TTLMEAS.toFixed(2)+'&nbsp;&nbsp;</span></td>'+
				'<td style="align: left;"><span style="font-size:12px;">CBM</span></td>'+
				'</tr>'+
				'<tr style="margin-left:20px;">'+
				'<td colspan="12" style="align: center; height: 50px">&nbsp;</td>'+
				'</tr>'+
				'<tr style="margin-bottom:10px; margin-left:20px;">'+
				'<td colspan="12" style="align: left;"><span style="font-size:12px;"><strong>TOTAL GROSS WEIGHT:&nbsp;&nbsp;</strong></span><span style="font-size:12px;">'+TTLGW.toFixed(2)+'&nbsp;&nbsp;KGS</span></td>'+
				'</tr>';
			 
				var soId = record.getFieldValue('createdfrom');
				if(soId){
					var soRec = nlapiLoadRecord('salesorder', soId);
					if(soRec){
						var subId = soRec.getFieldValue('subsidiary');
						var subRec = nlapiLoadRecord('subsidiary', subId);
						var zigongsi = subRec.getFieldValue('custrecord_subsidiary_en');
					}
				}
				var htmlFile = nlapiLoadFile(1167);
				var html = htmlFile.getValue();
				// 用temp替换模板中的#printHTML#
				html = html.replace("#printHTML#", total);
				html2 = html.replace("#print2HTML#",convert(zigongsi));
				html3 = html2.replace("#print3HTML#", table);
				var renderer = nlapiCreateTemplateRenderer();

				renderer.addRecord('record', record);
				renderer.setTemplate(html3);
				var file = renderer.renderToString();
				var pdfFile = nlapiXMLToPDF(file);

				response.setContentType('PDF', record.getRecordType().toUpperCase()
								+ record.getFieldValue('tranid') + '.pdf','inline');
				response.write(pdfFile.getValue());
			
		}
	}
}

//转义特殊字符
function convert(str){
	if(str!=null&&str!=''&&str!=undefined&&str!=' '){
		str=str.replace(/&/g,"&amp;");
		str=str.replace(/>/g,"&gt;");
		str=str.replace(/</g,"&lt;");
		str=str.replace(/"/g,"&quot;");
		str=str.replace(/'/g,"&#039;")
		}
	return str;
}
