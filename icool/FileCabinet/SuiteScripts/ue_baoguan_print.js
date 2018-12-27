/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Oct 2018     Nero
 *
 */

function beforeLoad(type, form, request){
	try {
		// 获取应用到表单的记录id和类型
		var recId = nlapiGetRecordId();
		var recType = nlapiGetRecordType();
		nlapiLogExecution('debug', 'recType:' + recType, 'type:' + type);
		// 当处于view状态时添加打印按钮
		if (type == 'view') {
			nlapiLogExecution('debug', 'test', '123');
			
			form.addButton(
							"custpage_baoguandan_print",
							"打印报关单",
							"window.open("
							+ "'/app/site/hosting/scriptlet.nl?script=156&deploy=1&"
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
		
		// 加载脚本文件（参数是脚本文件的ID）
		var htmlFile = nlapiLoadFile(426);
		var html = htmlFile.getValue();
		// 用打印模板替换xml
//		 html1 = html.replace("#print1HTML#", name);
		// 生成打印表单，renderer对象将模板作为字符串传递给FreeMarker方法
		var renderer = nlapiCreateTemplateRenderer();

		renderer.addRecord('record', record);
		renderer.setTemplate(html);
		var file = renderer.renderToString();
		//转成PDF格式
		var pdfFile = nlapiXMLToPDF(file);
		response.setContentType('PDF', record.getRecordType().toUpperCase()
				+ record.getFieldValue('tranid') + '.pdf', 'inline');
		response.write(pdfFile.getValue());
	}
}
