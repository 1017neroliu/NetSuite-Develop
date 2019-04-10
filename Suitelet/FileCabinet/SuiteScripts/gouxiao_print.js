/**
 * Module Description
 * 
 * Version Date Author Remarks 1.00 16 Jul 2018 Nero
 * 
 */
function beforeLoad(type, form, request) {
	try {
		// 获取应用到表单的记录id和类型
		var recId = nlapiGetRecordId();
		var recType = nlapiGetRecordType();
		nlapiLogExecution('debug', 'recType:' + recType, 'type:' + type);
		// 当处于view状态时添加打印按钮
		if (type == 'view') {
			nlapiLogExecution('debug', 'test', '123');
			
			form.addButton(
							"custpage_item_fulfillment_print",
							"打印购销合同",
							"window.open("
							+ "'/app/site/hosting/scriptlet.nl?script=15&deploy=1&"
							+ serializeURL({
								recType : recType,
								recId : recId
							}) + "'" + ",'_blank'),window.focus()");
			nlapiLogExecution('debug', 'test', '222');
		}
	} catch (e) {
		processException(e);
	}
}

function print(request, response) {
	if (request.getMethod() == "GET") {
		var recType = request.getParameter("recType");
		var recId = request.getParameter("recId");
		var record = nlapiLoadRecord(recType, recId);
		//取供方的值
		var poId = record.getLineItemValue('item', 'createdpo', 1);
		var pur = nlapiLoadRecord('purchaseorder', poId);
		var vendorId = pur.getFieldValue('entity');
		var vendor = nlapiLoadRecord('vendor', vendorId);
		
		var name = vendor.getFieldValue('altname');
		if(!name){
			name = '';
		}
		var faren = vendor.getFieldValue('custentity2');
		var jingban = vendor.getFieldValue('custentity3');
		var yinhang = vendor.getFieldValue('custentity4');
		var zhanghao = vendor.getFieldValue('custentity5');
		var add = vendor.getFieldValue('defaultaddress');
		var phone = vendor.getFieldValue('phone');
		var fax = vendor.getFieldValue('fax');
		
		nlapiLogExecution('debug', '供方',faren);
		
		//取需方的值
		var subId = pur.getFieldValue('subsidiary');
		var sub = nlapiLoadRecord('subsidiary', subId);
		
		var xname = sub.getFieldValue('name');
		var xfaren = sub.getFieldValue('custrecord11');
		var xjingban = sub.getFieldValue('custrecord12');
		var xyinhang = sub.getFieldValue('custrecord14');
		var xzhanghao = sub.getFieldValue('custrecord15');
		var xadd = sub.getFieldValue('mainaddress_text');
		var xphone = sub.getFieldValue('custrecord13');
		var xfax = sub.getFieldValue('fax');
		
		nlapiLogExecution('debug', '需方',xadd);
		
		//拼接供需方信息
		var gx = '<tr>'+
			'<td style="text-align: center;"><span style="font-size:12px;">需方：</span></td>'+
			'<td colspan="2" rowspan="1"><span style="font-size:12px;">'+xname+'</span></td>'+
			'<td style="text-align: center;"><span style="font-size:12px;">供方：</span></td>'+
			'<td colspan="2" rowspan="1"><span style="font-size:12px;">'+name+'</span></td>'+
			'</tr>'+
			'<tr>'+
			'<td style="text-align: center;"><span style="font-size:12px;">法人代表：</span></td>'+
			'<td colspan="2" rowspan="1"><span style="font-size:12px;">'+xfaren+'</span></td>'+
			'<td style="text-align: center;"><span style="font-size:12px;">法人代表：</span></td>'+
			'<td colspan="2" rowspan="1"><span style="font-size:12px;">'+faren+'</span></td>'+
			'</tr>'+
			'<tr>'+
			'<td style="text-align: center;"><span style="font-size:12px;">经办人员：</span></td>'+
			'<td colspan="2" rowspan="1"><span style="font-size:12px;">'+xjingban+'</span></td>'+
			'<td style="text-align: center;"><span style="font-size:12px;">经办人员：</span></td>'+
			'<td colspan="2" rowspan="1"><span style="font-size:12px;">'+jingban+'</span></td>'+
			'</tr>'+
			'<tr>'+
			'<td style="text-align: center;"><span style="font-size:12px;">地址：</span></td>'+
			'<td colspan="2" rowspan="1"><span style="font-size:12px;">'+xadd+'</span></td>'+
			'<td style="text-align: center;"><span style="font-size:12px;">地址：</span></td>'+
			'<td colspan="2" rowspan="1"><span style="font-size:12px;">'+add+'</span></td>'+
			'</tr>'+
			'<tr>'+
			'<td style="text-align: center;"><span style="font-size:12px;">电话：</span></td>'+
			'<td colspan="2" rowspan="1"><span style="font-size:12px;">'+xphone+'</span></td>'+
			'<td style="text-align: center;"><span style="font-size:12px;">电话：</span></td>'+
			'<td colspan="2" rowspan="1"><span style="font-size:12px;">'+phone+'</span></td>'+
			'</tr>'+
			'<tr>'+
			'<td style="text-align: center;"><span style="font-size:12px;">传真：</span></td>'+
			'<td colspan="2" rowspan="1"><span style="font-size:12px;">'+xfax+'</span></td>'+
			'<td style="text-align: center;"><span style="font-size:12px;">传真：</span></td>'+
			'<td colspan="2" rowspan="1"><span style="font-size:12px;">'+fax+'</span></td>'+
			'</tr>'+
			'<tr>'+
			'<td style="text-align: center;"><span style="font-size:12px;">开户银行：</span></td>'+
			'<td colspan="2" rowspan="1"><span style="font-size:12px;">'+xyinhang+'</span></td>'+
			'<td style="text-align: center;"><span style="font-size:12px;">开户银行：</span></td>'+
			'<td colspan="2" rowspan="1"><span style="font-size:12px;">'+yinhang+'</span></td>'+
			'</tr>'+
			'<tr style="margin-bottom:10px">'+
			'<td style="text-align: center;"><span style="font-size:12px;">账号：</span></td>'+
			'<td colspan="2" rowspan="1"><span style="font-size:12px;">'+xzhanghao+'</span></td>'+
			'<td style="text-align: center;"><span style="font-size:12px;">账号：</span></td>'+
			'<td colspan="2" rowspan="1"><span style="font-size:12px;">'+zhanghao+'</span></td>'+
			'</tr>';
		
		nlapiLogExecution("debug", "result", "OK");
		// 加载脚本文件（参数是脚本文件的ID）
		var htmlFile = nlapiLoadFile(1122);
		var html = htmlFile.getValue();
		// 用打印模板替换xml
		 html1 = html.replace("#print1HTML#", name);
		 html2 = html1.replace("#print2HTML#",gx);
		// 生成打印表单，renderer对象将模板作为字符串传递给FreeMarker方法
		var renderer = nlapiCreateTemplateRenderer();

		renderer.addRecord('record', record);
		renderer.setTemplate(html2);
		var file = renderer.renderToString();
		var pdfFile = nlapiXMLToPDF(file);
		/**
		 * response.setContentType(type,name,disposition); 
		 * type:文件类型 
		 * name:文件名
		 * disposition:下载文件内容的处理，值有inline（内联）和attachment（附件），默认值为attachment
		 */
		response.setContentType('PDF', record.getRecordType().toUpperCase()
				+ record.getFieldValue('tranid') + '.pdf', 'inline');
		response.write(pdfFile.getValue());
	}
}
