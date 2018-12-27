/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       22 Oct 2018     Nero
 *
 */
//创建一个存放丽晶日志的脚本
function writeLog(name, detils, user, scriptId, status, request, response) {
	
    var logRec = nlapiCreateRecord('customrecord_lijing_api_log');
    logRec.setFieldValue('name', name);//调用接口目的
    logRec.setFieldValue('custrecord_log_transaction_detils', detils);//调用接口详情
    logRec.setFieldValue('custrecord_log_transaction_user', user);//修改record的ID

//    number = parseInt(number);
//    if (!isNaN(number)) {
//        logRec.setFieldValue('custrecord_log_linked_danju', number);
//    }
    logRec.setFieldValue('custrecord_log_scriptid', scriptId);//执行接口脚本ID
    logRec.setFieldValue('custrecord_log_status', status);//执行的状态，手动

    if (request) {
    	//请求的数据
        logRec.setFieldValue('custrecord_log_request', request);
    }

    if (response) {
    	//响应的数据
        logRec.setFieldValue('custrecord_log_response', response);
    }

    nlapiSubmitRecord(logRec);
}