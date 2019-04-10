/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       24 Aug 2018     Nero
 *
 */

function fieldChanged(type, name, linenum){
	//注意：对象名字不能用Date！！
		var D = nlapiDateToString(new Date());
		if(name == 'status'){
			var status = nlapiGetFieldValue('status');
			nlapiLogExecution('debug', '状态', status);	
			if('5' == status){
				nlapiLogExecution('debug', '日期',D);
				nlapiSetFieldValue('custevent_csenddate',D);
			}
		}
}
