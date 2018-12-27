/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       02 Nov 2018     Nero			   
 *
 */
//SO上make copy的时候，copy的record有些字段是旧的信息，需要从当前客户的record中获取最新的信息，再值设置进去
function beforeLoad(type){
	nlapiLogExecution('debug', '测试', type);
	if(type == 'copy'){
		//========================从customer上取值===================================
		var customerId = nlapiGetFieldValue('entity');
		if(customerId != null){
		nlapiLogExecution('debug', 'customerId', customerId);
		var customerRec = nlapiLoadRecord('customer', customerId);
		//获取customer地址，部门，账期的值
		var location = customerRec.getFieldValue('custentity_default_fulfillment_location');
		var department = customerRec.getFieldValue('custentity_sales_district');
		var terms = customerRec.getFieldValue('terms');
		nlapiLogExecution('debug', 'terms', terms);
		//取billing address的值
		var num1 = customerRec.getLineItemCount('addressbook');
		for (var i = 1; i <= num1; i++) {
			var defaultBilling = customerRec.getLineItemValue('addressbook', 'defaultbilling', i);
			if(defaultBilling == 'T'){
				var addressid = customerRec.getLineItemValue('addressbook', 'addressid', i);
				nlapiLogExecution('debug', 'addressid', addressid);
			}
		}
		
		//在给销售团队设置值的时候，因为已经将之前的SO上的值带过来了，所以要先删除旧数据，再添加新数据(子列表是动态的，删除不了)
		var num3 = nlapiGetLineItemCount('salesteam');
		for (var a = num3; a >= 1; a--) {
			nlapiRemoveLineItem('salesteam', a);
			}
		
		//取销售团队的值
		var num2 = customerRec.getLineItemCount('salesteam');
		for (var j = 1; j <= num2; j++) {
			var	employee = customerRec.getLineItemValue('salesteam', 'employee', j);
			var	salesRole = customerRec.getLineItemValue('salesteam', 'salesrole', j);
			var	isprimary = customerRec.getLineItemValue('salesteam', 'isprimary', j);
			var	contribution = customerRec.getLineItemValue('salesteam', 'contribution', j);
			//设置销售团队的值
			nlapiSelectNewLineItem('salesteam');
			nlapiSetCurrentLineItemValue('salesteam', 'employee', employee);
			nlapiSetCurrentLineItemValue('salesteam', 'salesrole', salesRole);
			nlapiSetCurrentLineItemValue('salesteam', 'isprimary', isprimary);
			nlapiSetCurrentLineItemValue('salesteam', 'contribution', contribution);
			nlapiCommitLineItem('salesteam');
		}
		
		//=========================给copy的SO赋值===============================
		nlapiSetFieldValue('location', location);
		nlapiSetFieldValue('department', department);
		nlapiSetFieldValue('terms', terms);
		nlapiSetFieldValue('billaddresslist', addressid);
		
//		var soSubrecord = nlapiViewSubrecord('billaddresslist');
//		soSubrecord.setFieldValue('country', country);
//		soSubrecord.setFieldValue('addressee', addressee);
//		nlapiSubmitRecord(soSubrecord);
		}
	}
}
