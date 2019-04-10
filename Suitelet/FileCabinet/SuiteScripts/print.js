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
							+ "'/app/site/hosting/scriptlet.nl?script=12&deploy=1&"
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

		nlapiLogExecution("debug", "result", "OK");
		// 加载脚本文件（参数是脚本文件的ID）
		var htmlFile = nlapiLoadFile(1118);
		var html = htmlFile.getValue();
		// 用打印模板替换xml
//		 html = html.replace("#printHTML#", unit);
		// 生成打印表单，renderer对象将模板作为字符串传递给FreeMarker方法
		var renderer = nlapiCreateTemplateRenderer();

		renderer.addRecord('record', record);
		renderer.setTemplate(html);
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
