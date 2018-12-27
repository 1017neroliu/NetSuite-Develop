/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       14 Sep 2018     Nero
 *
 */
/**这个是在customer信用额度下的search删除一个so后触发脚本计算非前TT累计值并赋值给financial下的预付款余额的脚本
 * 具体的逻辑参照ue_shenpi.js中的，几乎是一模一样，应用到SO上，点击保存触发脚本
 */
//审批已占用额度=未开票金额（首要币种）累计值+Balance-非前TT预付款余额（首要币种）累计值
function afterSubmit(type){
	if(type != 'delete'){
	try {
		//加载Customer记录
		var customerId = nlapiGetFieldValue('entity');
		var customerRec = nlapiLoadRecord('customer', customerId);
		//获取Customer下面的balance
		var balance = customerRec.getFieldValue('balance');
		nlapiLogExecution('debug', 'balance', balance);
		//加载search
		var search = nlapiLoadSearch(null, 82);
		//添加过滤器，以客户id为过滤条件
		search.addFilter(new nlobjSearchFilter('entity', null, 'is',customerId));
		//运行search
		var searchResults = search.runSearch();
		//获取search结果
		var result = searchResults.getResults(0, 1000);
		//定义未开票金额（首要币种）的累计值和非前TT预付款余额（首要币种）的累计值以及发运金额（首要币种）的累计值
		var totalweikai = 0;
		var totalfeiqian = 0;
		//如果search不为空，遍历search
		if (result != null) {
			for (var i = 0; i < result.length; i++) {
				//获取所有行
				var cols = result[i].getAllColumns();
				//获取未开票金额（首要币种），非前TT预付款余额（首要币种），发运金额（首要币种）的值
				var weikai = result[i].getValue(cols[6]);
				var feiqian = result[i].getValue(cols[10]);
				//如果为没有值就取0
				if (!weikai) {
					weikai = 0;
				}
				if (!feiqian) {
					feiqian = 0;
				}
				nlapiLogExecution('debug', 'weikai', weikai);
				nlapiLogExecution('debug', 'feiqian', feiqian);
				var tweikai = parseFloat(weikai);
				var tfeiqian = parseFloat(feiqian);
				//计算累计值
				totalweikai += tweikai;
				totalfeiqian += tfeiqian;
			}
		}
		nlapiLogExecution('debug', 'totalweikai', totalweikai);
		nlapiLogExecution('debug', 'totalfeiqian', totalfeiqian);
		//计算审批占用额度
		var shenpi = totalweikai + parseFloat(balance) - totalfeiqian;
		nlapiLogExecution('debug', 'shenpi', shenpi);
		var yufu = totalfeiqian;
		//	//赋值，提交
		customerRec.setFieldValue('custentity_customer_audit_amount', shenpi);
		customerRec.setFieldValue('custentity_customer_pp_remaining', yufu);
		nlapiSubmitRecord(customerRec);
	} catch (e) {
	}
	}
}
function beforeSubmit(type){
	if(type == 'delete'){
		try {
			var soId = nlapiGetRecordId();
			//加载Customer记录
			var customerId = nlapiGetFieldValue('entity');
			var customerRec = nlapiLoadRecord('customer', customerId);
			//获取Customer下面的balance
			var balance = customerRec.getFieldValue('balance');
			nlapiLogExecution('debug', 'balance', balance);
			//加载search
			var search = nlapiLoadSearch(null, 82);
			//添加过滤器，以客户id为过滤条件
			search.addFilter(new nlobjSearchFilter('entity', null, 'is',customerId));
			//运行search
			var searchResults = search.runSearch();
			//获取search结果
			var result = searchResults.getResults(0, 1000);
			//定义未开票金额（首要币种）的累计值和非前TT预付款余额（首要币种）的累计值以及发运金额（首要币种）的累计值
			var totalweikai = 0;
			var totalfeiqian = 0;
			//如果search不为空，遍历search
			if (result != null) {
				for (var i = 0; i < result.length; i++) {
					var searchSoId = result[i].getId();
					if(searchSoId != soId){
					//获取所有行
					var cols = result[i].getAllColumns();
					//获取未开票金额（首要币种），非前TT预付款余额（首要币种），发运金额（首要币种）的值
					var weikai = result[i].getValue(cols[6]);
					var feiqian = result[i].getValue(cols[10]);
					//如果为没有值就取0
					if (!weikai) {
						weikai = 0;
					}
					if (!feiqian) {
						feiqian = 0;
					}
					nlapiLogExecution('debug', 'weikai(删除)', weikai);
					nlapiLogExecution('debug', 'feiqian(删除)', feiqian);
					var tweikai = parseFloat(weikai);
					var tfeiqian = parseFloat(feiqian);
					//计算累计值
					totalweikai += tweikai;
					totalfeiqian += tfeiqian;
					}
				}
			}
			nlapiLogExecution('debug', 'totalweikai(删除)', totalweikai);
			nlapiLogExecution('debug', 'totalfeiqian(删除)', totalfeiqian);
			//计算审批占用额度
			var shenpi = totalweikai + parseFloat(balance) - totalfeiqian;
			nlapiLogExecution('debug', 'shenpi(删除)', shenpi);
			var yufu = totalfeiqian;
			//	//赋值，提交
			customerRec.setFieldValue('custentity_customer_audit_amount', shenpi);
			customerRec.setFieldValue('custentity_customer_pp_remaining', yufu);
			nlapiSubmitRecord(customerRec);
		} catch (e) {
		}
	}
}