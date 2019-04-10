/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       20 Sep 2018     Nero
 *
 */
function postvipDetail(datain) {
     var responer;	
   nlapiLogExecution('debug','recordtype',datain.recordtype);
	if (datain.recordtype=='customrecord81')
      responer=vipDetail();
	//json通常用于与服务端交换数据，在向服务端发送数据时一般是字符串，用以下方法将js对象转换为字符串
	return JSON.stringify(responer);

}
function vipDetail() {
	var vipColumns = new Array();
	vipColumns[0] = new nlobjSearchColumn('altname');
	vipColumns[1] = new nlobjSearchColumn('custrecord7');
	vipColumns[2] = new nlobjSearchColumn('custrecord8');
	vipColumns[3] = new nlobjSearchColumn('custrecord6');
	vipColumns[4] = new nlobjSearchColumn('custrecord9');

	var vipsearchresults = nlapiCreateSearch('customrecord81', null,
			vipColumns);

	//运行search
	var runSearch = vipsearchresults.runSearch();
	//定义json数据数组
	var jsondata = [];
	var resultIndex = 0;
	var resultStep = 1000;
	var resultSet;
	var viprow = 0;
	do {
		resultSet = runSearch.getResults(resultIndex, resultIndex + resultStep);
		resultIndex = resultIndex + resultStep;
		var searchlength = resultSet.length;
		viprow += searchlength;
		if (resultSet != null && searchlength > 0) {
			for (var i = 0; i < searchlength; i++) {
				var vipName = resultSet[i].getValue('altname');
				var vipGender = resultSet[i].getValue('custrecord7');
				var vipPhone = resultSet[i].getValue('custrecord8');
				var vipIntegral = resultSet[i].getValue('custrecord6');
				var vipDeposit = resultSet[i].getValue('custrecord9');
				//将数据封装到vip对象中
				var vip = {
					"vipName" : vipName,
					"vipGender" : vipGender,
					"vipPhone" : vipPhone,
					"vipIntegral" : vipIntegral,
					"vipDeposit" : vipDeposit
				};
				//把vip对象放到json数组中
				jsondata.push(vip);

			}
		}
	} while (resultSet != null && resultSet.length > 0)

	nlapiLogExecution('debug', 'searchlength', viprow);
	//响应
	var responer = {
		"response" : jsondata
	}
	return responer;

}