/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       02 Jul 2018     Nero
 *
 */

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function getRESTlet(dataIn) {
	var o = new Object();

	return o;
}

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function postRESTlet(dataIn) {

	return {};
}

//创建一个标准的NetSuite的记录
function createRecord(datain) {
	var err = new Object();

	// 验证是否在请求中设置了强制性记录类型
	if (!datain.recordtype)//非datain的记录类型
	{
		err.status = "failed";
		err.message = "missing recordtype";
		return err;
	}

	var record = nlapiCreateRecord(datain.recordtype);//创建datatin的记录类型的记录

	for ( var fieldname in datain)//遍历datain中的字段名
	{
		if (datain.hasOwnProperty(fieldname))//如果datain中有字段名为。。
		{
			if (fieldname != 'recordtype' && fieldname != 'id')//如果字段名不等于记录类型并且字段名不等于id
			{
				var value = datain[fieldname];//将datain的字段名赋值给value
				if (value && typeof value != 'object') // 忽略其他类型的参数（如果值为value并且value不等于object）
				{
					record.setFieldValue(fieldname, value);//将记录的字段的值设置为value
				}
			}
		}
	}
	var recordId = nlapiSubmitRecord(record);//提交记录
	nlapiLogExecution('DEBUG', 'id=' + recordId);

	var nlobj = nlapiLoadRecord(datain.recordtype, recordId);//加载记录
	return nlobj;//返回记录的确切值
}

function sayhi() {
	var o = new Object();
	o.sayhi = 'Hello World';
	return JSON.stringify(o);
}
