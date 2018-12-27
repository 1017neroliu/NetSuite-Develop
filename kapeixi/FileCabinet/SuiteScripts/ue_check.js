/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Oct 2018     Nero
 *
 */
//在检验申请单上，状态为通过，来源订单有的PO，PO上的已检验打上勾，即可隐藏创建发货单按钮
function beforeSubmit(type){
	try {
		//获取检验申请单上的状态以及所选的PO单号
		var status = nlapiGetFieldValue('custrecord_status');
		var resource = nlapiGetFieldValue('custrecord_origion_po');
		nlapiLogExecution('debug', 'status', status);//通过
		nlapiLogExecution('debug', 'resource', resource);//2986229863
		//获取到的PO编号，将中间的分隔符去掉，获取的是一个数组
		resource = resource.split('');
		nlapiLogExecution('debug', 'resource', resource);
		//当PO编号存在，数组的长度不为0，并且当状态为通过的时候，将PO上的已检验勾选上
		if (resource.length && status == '3') {
			nlapiLogExecution('debug', 'resource.length', resource.length);
			for (var i = 0; i < resource.length; i++) {
				var poRec = nlapiLoadRecord('purchaseorder', resource[i]);
				poRec.setFieldValue('custbody_checked', 'T');
				nlapiSubmitRecord(poRec);
			}
		}
	} catch (e) {
	}
}
