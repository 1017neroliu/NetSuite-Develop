/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       14 Sep 2018     Nero
 *	发运金额的数据来源，部署在item fulfillment上
 */
//当item fulfillment保存的时候，触发脚本，实际占用额度设置值（发运金额是在这个记录上更改的），实际=发运-已开+balance
function afterSubmit(type){
		var soId = nlapiGetFieldValue('createdfrom');
		var soRec = nlapiLoadRecord('salesorder', soId);
		//获取class的值，如果class的值为内销，实际占用额度的值就是：发运-已开+balance
		var _class = soRec.getFieldValue('class');
		if(_class == '9'){
		//已开票金额
		var total_billed_amount = soRec.getFieldValue('custbody_so_amount_shipped');
		//加载customer记录，获取balance
		var customerId = soRec.getFieldValue('entity');
		var customerRec = nlapiLoadRecord('customer', customerId);
		var balance = customerRec.getFieldValue('balance');
		//加载信用额度search
		var search = nlapiLoadSearch(null, 82);
		//添加过滤器，以客户id为过滤条件
		search.addFilter(new nlobjSearchFilter('entity', null, 'is', customerId));
		//运行search
		var searchResults = search.runSearch();
		//获取search结果
		var result = searchResults.getResults(0,1000);
		//定义未开票金额（首要币种）的累计值和非前TT预付款余额（首要币种）的累计值以及发运金额（首要币种）的累计值
		var totalfayun = 0;
		//如果search不为空，遍历search
		if(result != null){
			for (var i = 0; i < result.length; i++) {
				//获取所有行
				var cols = result[i].getAllColumns();
				//获取发运金额（首要币种）的值
				var fayun = result[i].getValue(cols[8]);
				//如果为没有值就取0
				if(!fayun){
					fayun = 0;
				}
					var tfayun = parseFloat(fayun);
					//计算累计值
						totalfayun += tfayun;
			}
		}
		//计算审批占用额度
		var shiji = totalfayun + parseFloat(balance) - total_billed_amount;
		//赋值，提交
		customerRec.setFieldValue('custentity_customer_actual_amount', shiji);
		nlapiSubmitRecord(customerRec);
}
}
