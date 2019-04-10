/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       07 Mar 2019     Nero
 *
 * 定时向丽晶传color信息
 */
//获取context
	var context = nlapiGetContext();
	//获取当前用户名，用于后面写入日志record
	var user = context.getName();
	//获取当前操作的脚本的id
	var scriptId = context.getScriptId();
function addColor(type) {
	//添加颜色接口地址
	var addColorUrl = "http://116.62.219.119:8089/api/AddDictColor";
	//token接口地址
	var accessTokenUrl = "http://116.62.219.119:8089/api/AccessToken?AppKey=xuanni01&AppSecret=xuanni01";
	
	var accessToken = nlapiRequestURL(accessTokenUrl);
	//body里面是json字符串
	var jsonstr = accessToken.body;
	//json字符串转对象
	var ljdata =  eval('(' + jsonstr + ')').data;
	
	//请求头信息
	var headers = {'Content-Type' : 'application/json',
				   'Authorization' : ljdata};
	nlapiLogExecution('error', 'ljdata', ljdata);
	//颜色list的search
	var search = nlapiLoadSearch(null, 'customsearch286');
	
	var searchResults = search.runSearch();
	var resultIndex = 0;
	var resultStep = 1000;
	var result;
	var colorArr = [];
	//超过1000条的更新，每1000条1000条的更新
	do {
		result = searchResults.getResults(resultIndex, resultStep);
		resultIndex = resultIndex + resultStep;
		var searchLength = result.length;
		nlapiLogExecution('error', 'search长度', searchLength);
		
		if (result != null && searchLength > 0) {
			for (var i = 0; i < searchLength; i++) {
				var cols = result[i].getAllColumns();
				//颜色名称
				var name = result[i].getValue(cols[0]);
				var color = name.split('/')[1];// 截取"/"后面的
				//颜色id
				var colorId = name.split('/')[0];// 截取"/"前面的
				//颜色json对象
				var colorJsonobj = {
						"colorId" : colorId,
						"color" : color}
				colorArr.push(colorJsonobj);
				//json对象转成json字符串
//				var colorJsonStr = JSON.stringify(colorJsonobj);
//				nlapiLogExecution('error', 'colorJsonStr', colorJsonStr);
			}
			var colorJsonStr = JSON.stringify(colorArr);
			nlapiLogExecution('error', 'colorJsonStr', colorJsonStr);
			// 调用接口地址
			var addColor = nlapiRequestURL(addColorUrl, colorJsonStr, headers);
			var bodystr = addColor.getBody();
			nlapiLogExecution('error', 'bodystr', bodystr);
			// 转成响应体对象，并获取flag信息，是否调用成功
			var flag = eval('(' + bodystr + ')').flag;
			var message = eval('(' + bodystr + ')').message;
			if (flag == "1") {
				writeLog('上传货品颜色资料', 
						message, 
						user, 
						scriptId, 
						'OK', 
						colorJsonStr, 
						bodystr);
			} else {
				writeLog('上传货品颜色资料', 
						message, 
						user, 
						scriptId, 
						'ERROR', 
						colorJsonStr, 
						bodystr);
			}
		}
	}while (result != null && result.length > 0);
}
