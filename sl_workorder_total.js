/**
 * Module Description
 * 
 * Version 		Date 		Author 		Remarks 
 * 1.00 	19 Feb 2019 	Nero 
 * 自定义配件创建的页面
 * 两个过滤器，筛选出符合条件的工单，如果筛选条件不为空：
 * 获取用户输入的信息，根据获取的信息过滤出工单，再根据过滤出的工单选择需要上传丽晶系统的工单，丽晶回传POID
 * 如果筛选条件为空，不需要任何操作，根据用户选择的工单上传至丽晶系统，丽晶回传POID
 */
function createWorkOrderTotal(request, response) {
	// 自定义配件创建页面
	var params = request.getAllParameters();
	if (request.getMethod() == "GET") {
		var wotForm = nlapiCreateForm("配件创建", false);
		wotForm.addSubmitButton("Submit");
		wotForm.addButton('custpage_upload', '上传丽晶系统', 'poin();');
		wotForm.addFieldGroup('fieldgroup1', 'Filter 筛选条件');
		
		var custDate1 = wotForm.addField("custpage_date1", "date", "起始日期", null,
				'fieldgroup1').setMandatory(true);
		var custDate2 = wotForm.addField("custpage_date2", "date", "截止日期", null,
		'fieldgroup1').setMandatory(true);
		var custVendor = wotForm.addField("custpage_vendor", "select", "供应商", "vendor", "fieldgroup1");
		// 获取URL中的参数信息
		var getvendor = params['paravendor'];
		var getparadate1 = params['paradate1'];
		var getparadate2 = params['paradate2'];
		
		// 用来判断是最初刷新页面还是生成之后的跳转回来的页面 “T”是生成之后的页面
		var flag = params['myflag'];
		// 如果用户输入的值不为空或者null，那么设置默认值
		if (getvendor != null && getvendor != '') {
			custVendor.setDefaultValue(getvendor);
		}
		if (getparadate1 != null && getparadate1 != '') {
			custDate1.setDefaultValue(getparadate1);
		}
		if (getparadate2 != null && getparadate2 != '') {
			custDate2.setDefaultValue(getparadate2);
		}
		wotForm.setScript('customscript128');
		if (flag == "T") {
			// 添加sublist
			var wotList = wotForm.addSubList('custpage_list', 'list', '工单列表');
			wotList.addMarkAllButtons();// 全选按钮

			wotList.addField('custpage_select', 'checkbox', '选择');
			wotList.addField('custpage_no', 'integer', '序号');
			wotList.addField('custpage_internalid', 'text', 'internalid');
			wotList.addField('custpage_poid', 'text', '手工单号');
			wotList.addField('custpage_vendorid', 'text', '供应商编号');
			wotList.addField('custpage_podate', 'date', '采购日期');
			wotList.addField('custpage_memo', 'text', '备注');
			wotList.addField('custpage_barcode', 'text', '条码');
			wotList.addField('custpage_warehouseid', 'text', '仓库编号');
			wotList.addField('custpage_price', 'text', '单价');
			wotList.addField('custpage_quantity', 'text', '数量');
			
			var searchwo = nlapiLoadSearch('workorder', 'customsearch_workorder');
			searchwo.addFilters([new nlobjSearchFilter('trandate', null, 'within', [getparadate1,getparadate2]),
			                     new nlobjSearchFilter('custbody_workorder_jk', null, 'is', 'F')]);
			if (getvendor != null && getvendor != '') {
			searchwo.addFilter(new nlobjSearchFilter('custbody_workorder_vendor', null, 'is', getvendor));
			}
			var searchResults = searchwo.runSearch();
			var resultIndex = 0;
			var resultStep = 1000;
			var array = [];
			do {
				var result = searchResults.getResults(resultIndex, resultStep);
//				nlapiLogExecution('error', '搜索结果', result.length);
				resultIndex = resultIndex + resultStep;
				if (result != null) {
					for (var i = 0; i < result.length; i++) {
						var cols = result[i].getAllColumns();
						//筛选出大货的工单
						var number = result[i].getText(cols[14]);
						number = number.substring(0, 9);
						//截取最后一个字符，判断是否有数字
						var str = number.charAt(number.length - 1);
						var p = /[0-9]/;
						var b = p.test(str);
						//供应商
//						var vendor = result[i].getValue(cols[19]);
						if (number[0] == '3' && b == true) {
							array.push(result[i]);
						}
					}
					for (var a = 0; a < array.length; a++) {
						wotList.setLineItemValue('custpage_no', a+1,(a+1).toString());
						// 从工单上获取数据
						var internalid = array[a].getId();
						wotList.setLineItemValue('custpage_internalid', a+1,internalid);
						var Manual_ID = array[a].getValue(cols[6]);
//						nlapiLogExecution('error', 'purchase_id', purchase_id+'==='+a);
						// 在面上设置相应的值
						wotList.setLineItemValue('custpage_poid', a+1,Manual_ID);

						var supply_no = array[a].getValue(cols[19]);
						wotList.setLineItemValue('custpage_vendorid', a+1,supply_no);

						var purch_date = array[a].getValue(cols[1]);
						wotList.setLineItemValue('custpage_podate', a+1,purch_date);

						var remark = array[a].getValue(cols[16]);
						wotList.setLineItemValue('custpage_memo', a+1,remark);

						var itemId = array[a].getText(cols[14]);
						var code = itemId.split(': ');
						var barcode = code[code.length-1];
						wotList.setLineItemValue('custpage_barcode', a+1,barcode);

						var warehouse_no = array[a].getValue(cols[15]);
						wotList.setLineItemValue('custpage_warehouseid', a+1,warehouse_no);

						var price = 0;
						wotList.setLineItemValue('custpage_price', a+1,price);

						var quantity = array[a].getValue(cols[18]);
						wotList.setLineItemValue('custpage_quantity', a+1,quantity);
						
						}
					
				}
			} while (result != null && result.length > 0);
		}
		response.writePage(wotForm);
	} else {
		var all_params = request.getAllParameters();

		var getvendor = all_params['custpage_vendor'];
		var getdate1 = all_params['custpage_date1'];
		var getdate2 = all_params['custpage_date2'];

		// 传值回本页面
		var slparames = [];
		slparames['paravendor'] = getvendor;
		slparames['paradate1'] = getdate1;
		slparames['paradate2'] = getdate2;

		slparames['myflag'] = 'T';
		response.sendRedirect("SUITELET", "customscript126", "customdeploy1",false, slparames);
	}
}