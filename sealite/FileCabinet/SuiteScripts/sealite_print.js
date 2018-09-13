/**
 * Module Description
 * 
 * Version 		Date 		Author 	Remarks 
 * 	1.00 	16 	Jul 2018 	Nero
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
			//添加按钮
			form.addButton(
							"custpage_item_sealite_print",
							"打印",
							"window.open("
							+ "'/app/site/hosting/scriptlet.nl?script=149&deploy=2&"
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
//转义特殊字符
//function convert(str){
//	if(str!=null&&str!=''&&str!=undefined&&str!=' '){
//		str=str.replace(/&/g,"&amp;");
//		str=str.replace(/>/g,"&gt;");
//		str=str.replace(/</g,"&lt;");
//		str=str.replace(/"/g,"&quot;");
//		str=str.replace(/'/g,"&#039;")
//		}
//	return str;
//}

function print(request, response) {
	if (request.getMethod() == "GET") {
		var recType = request.getParameter("recType");
		var recId = request.getParameter("recId");
		//加载record
		var record = nlapiLoadRecord(recType, recId);
		//获取item的列表行数
		var linenum= record.getLineItemCount('recmachcustrecord53');
		var xml3='';
		//根据行数，打印item列表字段的值
		var xml4 = '<table style="width: 100%; margin-top: 10px;"><thead><tr><th align="center" style="padding: 10px 6px;">Serial No.</th><th align="center" style="padding: 10px 6px;">Product Code</th><th align="center" style="padding: 10px 6px;">Picture</th><th align="center" style="padding: 10px 6px;">Description</th><th align="center" style="padding: 10px 6px;">Specification</th><th align="center" style="padding: 10px 6px;">Unit Price</th><th align="center" style="padding: 10px 6px;">MOQ</th><th align="center" style="padding: 10px 6px;">Remark</th></tr></thead>';
		//获取url头
		var header = request.getURL();
		//截取地址需要的部分
		var serverURL = header.substring(0, header.lastIndexOf("com") + 3); 
		//遍历子记录中的列表的值
		for (var i = 1; i <= linenum; i++) {
			var custrecord_serial_no = record.getLineItemValue('recmachcustrecord53','custrecord_serial_no', i);
			var name = record.getLineItemValue('recmachcustrecord53','name', i);
			var custrecord_picture = record.getLineItemValue('recmachcustrecord53','custrecord_picture', i);
			//加载图片文件
			var loadImage = nlapiLoadFile(custrecord_picture);
			var urlImage = loadImage.getURL();
			//拼接图片的url
			var urlAddressImage = serverURL + urlImage;
			//转义图片符号
			custrecord_picture = urlAddressImage.replace(/&/g, '&amp;');
			var custrecord_description = record.getLineItemValue('recmachcustrecord53','custrecord_description', i);
			var custrecord_specification = record.getLineItemValue('recmachcustrecord53','custrecord_specification', i);
			var custrecord_unit_price = record.getLineItemValue('recmachcustrecord53','custrecord_unit_price', i);
			var custrecord_moq = record.getLineItemValue('recmachcustrecord53','custrecord_moq', i);
			var custrecord_remark = record.getLineItemValue('recmachcustrecord53','custrecord_remark', i);
			//拼接表字符串
			xml3 += '<tr><td align="center">'+
			custrecord_serial_no+'</td><td align="center">'+
			name+'</td><td align="center"><img src="'+
			custrecord_picture+'" style="width:60px;height:30px;"/></td><td align="center">'+
			custrecord_description+'</td><td align="center">'+
			custrecord_specification+'</td><td align="center">'+
			custrecord_unit_price+'</td><td align="center">'+
			custrecord_moq+'</td><td align="center">'+
			custrecord_remark+'</td></tr>';
		}
		nlapiLogExecution('debug','测试', custrecord_moq);
		var logoImageUrl = "https://system.na3.netsuite.com/core/media/media.nl?id=349&c=4872416&h=4611ca084cf3e56ce2bf";
		logoImageUrl = logoImageUrl.replace(/&/g, '&amp;');
		var xml1 = '<#if companyInformation.logoUrl?length != 0><img src="'+logoImageUrl+'" style="float: left; margin: 7px" /> </#if>';
//		var xml1 = '<#if companyInformation.logoUrl?length != 0><img src="${companyInformation.logoUrl}" style="float: left; margin: 7px" /> </#if>';
//		convert(xml1);
		//拼接#print2HTML#
		var xml2=xml4+xml3+'<tr><th align="center">Reamrk:</th><td colspan="7" rowspan="1">${record.custrecord_remark_quotation}</td></tr></table>';
//		convert(xml2);
		nlapiLogExecution("debug", "result", "OK");
		// 加载脚本文件（参数是脚本文件的ID）
		var htmlFile = nlapiLoadFile(358);
		var html = htmlFile.getValue();
		// 用打印模板替换xml
		 html1 = html.replace("#print1HTML#", xml1);
		 html2 = html1.replace("#print2HTML#",xml2);
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

