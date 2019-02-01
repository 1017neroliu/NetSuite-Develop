/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       13 Dec 2018     Nero
 *	Asia/Hong_Kong
 *	时区转换可以用NS系统中封装好的API--nlapiGetDateTimeValue(fieldId, timeZone)
 */
//ue无法通过明细行关闭订单，也无法直接指定orderstatus == ‘H’来关闭订单，舍弃！
function beforeLoad(type, form, request){
	var createDate = nlapiGetFieldValue('trandate');
	nlapiLogExecution('debug', '最初', nlapiGetFieldValue('trandate'));
	
	nlapiGetDateTimeValue(fieldId, 'Asia/Hong_Kong');
	
	var now = new Date();//当前日期
	var tmp = now.getHours();
	var zone = now.getTimezoneOffset()/60;//getTimezoneOffset，与0时区的时差，单位分钟，除60，zone为-8
	zone = Math.abs(zone) + 8;	//美国是西区，西区的时区的绝对值+8就是东八区
	now.setHours(tmp + zone);
	var time = nlapiDateToString(now);
	var n = time.split('/').reverse().join('/');	//17,12,2018
	var two = new Date(n);
	nlapiLogExecution('debug', 'time', time);//  14/12/2018
	nlapiLogExecution('debug', 'n', n);
	nlapiLogExecution('debug', 'two', two);
	
	createDate = createDate.replace(/([^\s]+)\s.*/,"$1");
//	const o =createDate.replace(/\//g, '').replace(/^(\d{2})(\d{2})(\d{4})$/,"$3/$2/$1");//  \:转义，g:全局匹配
	var o = createDate.split('/').reverse().join('/');
  	var one = new Date(o);
	nlapiLogExecution('debug', 'one', one);
  	nlapiLogExecution('debug', 'createDate', createDate);// 26/7/2017
  	nlapiLogExecution('debug', 'o', o);
  	
  	var day = parseInt((two.getTime() - one.getTime())/(1000*60*60*24));
	nlapiLogExecution('debug', '当前日期', two.getTime());
	nlapiLogExecution('debug', '创建日期', one.getTime());
	nlapiLogExecution('debug', 'day', day);
	
	
//	nlapiLogExecution('debug', '1', '1');
//	var so = nlapiLoadRecord('salesorder', '111769');
//	var num = so.getLineItemCount('item');
//	for (var i = 1; i <= num; i++) {
//		so.setLineItemValue('item','isclosed', i,'T')
//	}
//	nlapiSubmitRecord(so);	
}
