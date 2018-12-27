/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Sep 2018     Nero
 * 
 *	应用到customer deposit上，点击保存触发脚本,影响的是未开票金额
 */
//审批已占用额度=未开票金额（首要币种）累计值+Balance-非前TT预付款余额（首要币种）累计值
function afterSubmit(type){
	var soId = nlapiGetFieldValue('salesorder');
	var soRec = nlapiLoadRecord('salesorder', soId);
	nlapiLogExecution('debug', 'soId', soId);
	//加载Customer记录
	var customerId = soRec.getFieldValue('entity');
	var customerRec = nlapiLoadRecord('customer', customerId);
	nlapiLogExecution('debug', 'customerId', customerId);
	//获取Customer下面的balance
	var balance = customerRec.getFieldValue('balance');
	nlapiLogExecution('debug', 'balance', balance);
	//加载search
	var search = nlapiLoadSearch(null, 82);
	//添加过滤器，以客户id为过滤条件
	search.addFilter(new nlobjSearchFilter('entity', null, 'is', customerId));
	//运行search
	var searchResults = search.runSearch();
	//获取search结果
	var result = searchResults.getResults(0,1000);
	//定义未开票金额（首要币种）的累计值和非前TT预付款余额（首要币种）的累计值以及发运金额（首要币种）的累计值
	var totalweikai = 0;
	var totalfeiqian = 0;
	//如果search不为空，遍历search
	if(result != null){
		for (var i = 0; i < result.length; i++) {
			//获取所有行
			var cols = result[i].getAllColumns();
			//获取未开票金额（首要币种），非前TT预付款余额（首要币种），发运金额（首要币种）的值
			var weikai = result[i].getValue(cols[6]);
			var feiqian = result[i].getValue(cols[10]);
			//如果为没有值就取0
			if(!weikai){
				weikai = 0;
			}
			if(!feiqian){
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
	//赋值，提交
	customerRec.setFieldValue('custentity_customer_audit_amount', shenpi);
	customerRec.setFieldValue('custentity_customer_pp_remaining', yufu);
	nlapiSubmitRecord(customerRec);
}
