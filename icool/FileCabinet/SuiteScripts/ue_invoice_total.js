/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       14 Sep 2018     Nero
 *	未开票金额和已开票金额的数据来源
 */
//未开票金额（首要币种），部署到invoice上
function afterSubmit(type){
		try {
			var soId = nlapiGetFieldValue('createdfrom');
			var soRec = nlapiLoadRecord('salesorder', soId);
			var _class = soRec.getFieldValue('class');
			//获取SO的发票信息采集金额
			var invoice_amount = parseFloat(soRec.getFieldValue('custbody_so_invoice_amount'));
			if (soId) {
				//billed amount
				var total_billed_amount = 0;
				var num = soRec.getLineItemCount('item');
				for (var i = 1; i <= num; i++) {
					var invoice = soRec.getLineItemValue('item', 'quantitybilled', i);
					nlapiLogExecution('debug', 'invoice', invoice);
					var rate = soRec.getLineItemValue('item', 'rate', i);
					nlapiLogExecution('debug', 'rate', rate);
					var billed_amount = invoice * rate;
					total_billed_amount += billed_amount;
				}
				soRec.setFieldValue('custbody_so_amount_shipped', total_billed_amount);
				nlapiSubmitRecord(soRec);
				
				var customerId = soRec.getFieldValue('entity');
				var customerRec = nlapiLoadRecord('customer', customerId);
				var balance = customerRec.getFieldValue('balance');
				var search = nlapiLoadSearch(null, 82);
				//添加过滤器，以客户id为过滤条件
				search.addFilter(new nlobjSearchFilter('entity', null, 'is',
						customerId));
				//运行search
				var searchResults = search.runSearch();
				//获取search结果
				var result = searchResults.getResults(0, 1000);
				//定义未开票金额（首要币种）的累计值和非前TT预付款余额（首要币种）的累计值以及发运金额（首要币种）的累计值
				var totalweikai = 0;
				var totalfeiqian = 0;
				var totalfayun = 0;
				//如果search不为空，遍历search
				if (result != null) {
					for (var i = 0; i < result.length; i++) {
						//获取所有行
						var cols = result[i].getAllColumns();
						//获取未开票金额（首要币种），非前TT预付款余额（首要币种），发运金额（首要币种）的值
						var weikai = result[i].getValue(cols[6]);
						var feiqian = result[i].getValue(cols[10]);
						var fayun = result[i].getValue(cols[8]);
						//如果为没有值就取0
						if (!weikai) {
							weikai = 0;
						}
						if (!feiqian) {
							feiqian = 0;
						}
						if (!fayun) {
							fayun = 0;
						}
						nlapiLogExecution('debug', 'weikai', weikai);
						nlapiLogExecution('debug', 'feiqian', feiqian);
						var tweikai = parseFloat(weikai);
						var tfeiqian = parseFloat(feiqian);
						var tfayun = parseFloat(fayun);
						//计算累计值
						totalweikai += tweikai;
						totalfeiqian += tfeiqian;
						totalfayun += tfayun;
					}
				}
				nlapiLogExecution('debug', 'totalweikai', totalweikai);
				nlapiLogExecution('debug', 'totalfeiqian', totalfeiqian);
				//计算审批占用额度
				var shenpi = totalweikai + parseFloat(balance) - totalfeiqian;
				nlapiLogExecution('debug', 'shenpi', shenpi);
				var shenji = 0;
				//当class为内销时，实际占用额度 = 发运金额 + balance - 已开票金额
				if(_class == '9'){
					shiji = totalfayun + parseFloat(balance) - total_billed_amount;
				}else{
					//当class不是内销时，实际占用额度 = 发票信息采集金额 + balance - 已开票金额
					shenji = invoice_amount + parseFloat(balance) - total_billed_amount;
				}
				var yufu = totalfeiqian;
				//赋值，提交
				customerRec.setFieldValue('custentity_customer_audit_amount',
						shenpi);
				customerRec.setFieldValue('custentity_customer_actual_amount',
						shiji);
				customerRec.setFieldValue('custentity_customer_pp_remaining',
						yufu);
				nlapiSubmitRecord(customerRec);
			}
		} catch (e) {
		}
}
