/**
 * Module Description
 * 
 * Version 	  Date 			 Author 		Remarks 
 * 1.00 	  31 Aug 2018 	 Nero
 * 
 */

/**
 * 需求：
 * 		search并遍历所有customer下的invoice，如果存在invoice中的字段daysoverdue>=15天
 * 		则custentity1的值设置为true。如果所有的invoice中的字段daysoverdue全都<15天，则custentity1
 * 		的值设置为false。每天上午2点更新一次，执行一次脚本。
 * @param recType
 * @param recId
 */
function scheduleUpdate() {
	// 加载search
	var search = nlapiLoadSearch(null, 487);

	var searchResults = search.runSearch();
	var resultIndex = 0;
	var resultStep = 1000;
	var result;
	//超过1000条的更新
	do {
		result = searchResults.getResults(resultIndex, resultStep);
		resultIndex = resultIndex + resultStep;
		var searchLength = result.length;
		if (result != null && searchLength > 0) {
			for (var i = 0; i < searchLength; i++) {
				var cols = result[i].getAllColumns();
				var day = result[i].getValue(cols[3]);
              	nlapiLogExecution('debug', 'day', day);
				var recId = result[i].getValue(cols[0]);
				nlapiLogExecution('debug', 'recId', recId);
				//加载记录	
				var record = nlapiLoadRecord('customer', recId);
				var stop = record.getFieldValue('custentity1');
				//当天数为小于15天的时候将字段设置为F
				if ((day < 15 || !day) && stop != 'F'){
					record.setFieldValue('custentity1', 'F');
					nlapiSubmitRecord(record);
				}
				//当天数大于等于15天时，将字段值设置为T
				else if (day >= 15 && stop != 'T'){
					record.setFieldValue('custentity1', 'T');
					nlapiSubmitRecord(record);
				}
				// 提交记录
			}
		}
		//当条件为假时，不再执行do，跳出循环
	} while (result != null && result.length > 0);
}
