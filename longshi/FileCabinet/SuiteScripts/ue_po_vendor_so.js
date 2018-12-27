/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Sep 2018     Nero
 * 保存PO后，到PO对应的SO的明细行上，获取明细行上的PO vendor，将其值赋值给drop ship vendor
 */
//PO保存后，把PO上的vendor字段值带到SO的item上
function afterSubmit(type){
	//获取SO的id
	var soId = nlapiGetFieldValue('createdfrom');
	if(soId){
	//判断createdfrom是否为SO的ID！
	var search = nlapiLoadRecord('salesorder', soId);
	if(search){
	//获取PO对应的SO
	var soRec = nlapiLoadRecord('salesorder', soId);
	//获取SO的item行
	var soNum = soRec.getLineItemCount('item');
	nlapiLogExecution('debug', 'soNum', soNum);
	//遍历SO的item行
	for (var i = 1; i <= soNum; i++) {
		//获取PO vendor
		var po_vendor = soRec.getLineItemValue('item', 'povendor', i);
		nlapiLogExecution('debug', 'po_vendor', po_vendor+i);
		//赋值
		soRec.setLineItemValue('item', 'custcol_dropship_vendor',i,po_vendor);
		}
	nlapiSubmitRecord(soRec);
		}
	}
}
