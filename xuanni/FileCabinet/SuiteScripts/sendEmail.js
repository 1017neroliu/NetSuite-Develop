/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Mar 2019     Nero
 *
 */

function sendEmail(type){
	nlapiLogExecution('ERROR', '测试', '123');
	var subject2 = "销售订单七天后关闭";
	var body2 = "销售订单将于七天后关闭！";
	nlapiSendEmail(1792, 'nero.liu@tctchina.com.cn', subject2, body2);	
}
