/**
 * Module Description
 * 
 * Version Date Author Remarks 1.00 01 Aug 2018 Nero
 * 
 */
function scheduleUpdate() {
	// 加载search
	var search = nlapiLoadSearch(null, 463);
	// var len = result.length % 1000 == 0?result.length/1000:result.length/1000+1;
	//运行search，返回结果
	var searchResults = search.runSearch();
	var resultIndex = 0;
	var resultStep = 1000;
	//超过1000条的更新
	do {
		var result = searchResults.getResults(resultIndex, resultStep);
		resultIndex = resultIndex + resultStep;
		var searchLength = result.length;
		if (result != null && searchLength > 0) {
			for (var i = 0; i < searchLength; i++) {
				var cols = result[i].getAllColumns();
				var day = result[i].getText(cols[4]);
				var status = result[i].getText(cols[5]);

				var recId = result[i].getValue(cols[0]);
				//加载记录
				var record = nlapiLoadRecord('customer', recId);
				//当天数为小于15天的时候将字段设置为F
				if (day < 15 || !day) {
					record.setFieldValue('custentity1', 'F');
				}
				//当天数大于等于15天时，将字段值设置为T
				if (day >= 15) {
					record.setFieldValue('custentity1', 'T');
				}
			}
		}
		// 提交记录
		nlapiSubmitRecord(record);
		//当条件为假时，不再执行do，跳出循环
	} while (result != null && result.length > 0)
}
