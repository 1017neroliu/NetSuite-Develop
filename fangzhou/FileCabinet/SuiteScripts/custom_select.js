/**
 * 需求：
 * 		search并遍历所有customer下的invoice，如果存在invoice中的字段daysoverdue>=15天
 * 		则custentity1的值设置为true。如果所有的invoice中的字段daysoverdue全都<15天，则custentity1
 * 		的值设置为false。每天上午5点半更新一次，执行一次脚本。
 * @param recType
 * @param recId
 */
function scheduleUpdate(recType, recId) {
	// 获取当前表单记录的ID和Type
	var record = nlapiLoadRecord(recType, recId);
	nlapiLogExecution('debug', 'test', recId);
	nlapiLogExecution('debug', 'test', recType);
	// 当付钱逾期天数在15天以内或者为空，将Stop的值改为F
	nlapiLogExecution('debug', 'test', record.getFieldValue('daysoverdue'));
	if (record.getFieldValue('daysoverdue') < 15
			|| !record.getFieldValue('daysoverdue')) {
		// 获取当前表单记录
//		var record = nlapiLoadRecord(recType, recId);
		record.setFieldValue('custentity1', 'F');
		// 保存记录
//		nlapiSubmitRecord(record);
	}
	
	// 付钱逾期天数大于等于15天，将Stop的值改为T
	if (record.getFieldValue('daysoverdue') >= 15) {
//		var record = nlapiLoadRecord(recType, recId);
		record.setFieldValue('custentity1', 'T');
//		nlapiSubmitRecord(record);
	}
	nlapiSubmitRecord(record);
}
