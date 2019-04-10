/**
 * 在单证打印界面，输入筛选条件，点击打印按钮，将saved searches中的明细行下的item打印成PDF
 */

if (typeof this.alert == "function" && !window.console) {
    window.console = {
        log: function() {}
    };
}
 
function run(request, response) {
	var context = nlapiGetContext();
	var params = request.getAllParameters();
	if (request.getMethod() == "GET") {
		// 创建表单
		var form = nlapiCreateForm("单证打印", false);
		// 添加字段组
		form.addFieldGroup('fieldgroup1', 'Filter 筛选条件');
		// 添加字段以及文本框
		var customer = form.addField("custpage_fr_customer", "select", "客户",
				'customer', 'fieldgroup1');	

		var shipping = form.addField("custpage_shipping", "text", "出货票号", null,
				'fieldgroup1');
		
		 var getparacustomer = params['paracustomer'];
 		 var getparashipping = params['parashipping'];
            
 		 form.setScript('customscriptcs_print');
	//添加按钮		
	 form.addButton("custpage_qgci","清关CI","QCI_Print();");				
	 form.addButton("custpage_qgpl","清关PL","CS_Print();");				
	 form.addButton("custpage_bgci","报关CI","BCI_Print();");				
	 form.addButton("custpage_bgpl","报关PL","BPL_Print();");				
	
	 nlapiLogExecution('debug', 'TEST', '123');
	 // 筛选过后传回来的值设为默认值
		if (getparacustomer != null && getparacustomer != '') {
			customer.setDefaultValue(getparacustomer);
		}
		if (getparashipping != null && getparashipping != '') {
			shipping.setDefaultValue(getparashipping);
		}
		response.writePage(form);
		
		 } else {
	var all_params = request.getAllParameters();
	
	var getcustomer = all_params['custpage_fr_customer'];
	var getshipping = all_params['custpage_shipping'];
 
	//传值回本页面
	var slparames = [];
 
	slparames['paracustomer'] = getcustomer;
	slparames['parashipping'] = getshipping;
	//suiteletID,suitelet部署ID
	response.sendRedirect("SUITELET", "customscript22", "customdeploy1", false, slparames);
}
    }