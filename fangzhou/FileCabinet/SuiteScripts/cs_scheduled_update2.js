/**
 * Module Description
 * 
 * Version 	  Date 			 Author 		Remarks 
 * 1.00 	  01 Aug 2018 	 Nero
 * 
 */

/**
 * 需求：
 * 		search并遍历所有customer下的invoice，如果存在invoice中的字段daysoverdue>=15天，
 * 		就把Customer下的custentity1的值设置为true。如果所有的invoice中的字段daysoverdue全都<15天，
 * 		就把Customer下的custentity1的值设置为false。每天上午5点半更新一次，执行一次脚本。
 * @param recType
 * @param recId
 */
function scheduleUpdate() {
	// 加载search
	var search = nlapiLoadSearch(null, 487);
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
//				var status = result[i].getText(cols[5]);
				nlapiLogExecution('debug', 'day', day);
				var recId = result[i].getValue(cols[0]);
				nlapiLogExecution('debug', 'recId', recId);
				//加载记录
				var record = nlapiLoadRecord('customer', recId);
				//加载invoice
				var search2 = nlapiLoadSearch(null, recId);
				var searchResults2 = search.runSearch();
				var resultIndex2 = 0;
				var resultStep2 = 1000;
				
				do {
					var result2 = searchResults2.getResults(resultIndex2, resultStep2);
					
					resultIndex2 = resultIndex2 + resultStep2;
					var searchLength2 = result2.length;
					if (result2 != null && searchLength2 > 0) {
						for (var j = 0; j < searchLength2; j++) {
							var cols2 = result[j].getAllColumns();
							var day2 = result[j].getText(cols[12]);
							nlapiLogExecution('debug', 'day2', day2);
							
							//当天数为小于15天的时候将字段设置为F
							if (day2 < 15 || !day2) {
								record.setFieldValue('custentity1', 'F');
							}
							//当天数大于等于15天时，将字段值设置为T
							if (day2 >= 15) {
								record.setFieldValue('custentity1', 'T');
							}
						}
					}
				}while(result2 != null && result2.length > 0)
			}
		}
		// 提交记录
		nlapiSubmitRecord(record);
		//当条件为假时，不再执行do，跳出循环
	} while (result != null && result.length > 0)
}
