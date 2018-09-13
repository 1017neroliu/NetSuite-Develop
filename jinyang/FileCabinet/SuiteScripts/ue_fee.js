/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Aug 2018     Nero
 *
 */

function afterSubmit(type){
	//获取CD上的手续费的值
  var fee = nlapiGetFieldValue('custbody_field_fee');
  nlapiLogExecution('debug', 'CD手续费', fee);
  //获取CD上SO的id
  var soId = nlapiGetFieldValue('salesorder');
  nlapiLogExecution('debug', 'soID', soId);
  //加载对应的SO
  var soRec = nlapiLoadRecord('salesorder', soId);	
  //将CD上的手续费传给SO上的手续费
  soRec.setFieldValue('custbody_field_fee', fee);
  nlapiSubmitRecord(soRec);
}
