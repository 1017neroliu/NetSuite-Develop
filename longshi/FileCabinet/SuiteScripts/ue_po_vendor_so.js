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
	var currentPO = nlapiGetRecordId();
	var soId = nlapiGetFieldValue('createdfrom');
	nlapiLogExecution('error', 'soId', soId);
	
//	var search = nlapiSearchRecord(null, soId);
//	nlapiLogExecution('error', 'search', search);
//	var searchType = search.getRecordType();
//	nlapiLogExecution('error', 'searchType', searchType);
//	if(soId && searchType == 'salesorder'){
//	var soRec = nlapiLoadRecord('salesorder', soId);
//}
	if(soId != null && soId != " "){
	//判断createdfrom是否为SO的ID！
	var soRec = nlapiLoadRecord('salesorder', soId);
	if(soRec){
	//获取SO的item行
	var soNum = soRec.getLineItemCount('item');
//	nlapiLogExecution('debug', 'soNum', soNum);
	//遍历SO的item行
	for (var i = 1; i <= soNum; i++) {
		//获取PO vendor
		var po_vendor = soRec.getLineItemValue('item', 'povendor', i);
		var so_rate = soRec.getLineItemValue('item', 'rate', i);
		
		nlapiLogExecution('error', 'so_rate', so_rate+'=='+i);
//		nlapiLogExecution('error', 'po_vendor', po_vendor+i);
		//获取PO ID
		var poId = soRec.getLineItemValue('item', 'createdpo', i);	
		//如果PO ID存在
		if(poId && poId == currentPO){
			//加载PO
			var poRec = nlapiLoadRecord('purchaseorder', poId);
			//获取SO上的item
			var soItem = soRec.getLineItemValue('item', 'item', i);
//			nlapiLogExecution('error', 'soItem', soItem);
			var poNum = poRec.getLineItemCount('item');
//			nlapiLogExecution('error', 'poNum', poNum);
			for (var j = 1; j <= poNum; j++) {
				//获取PO上的item
				var poItem = poRec.getLineItemValue('item', 'item', j);
//				nlapiLogExecution('error', 'poItem', poItem);
				//如果SO上的item和PO上的item相同，获取PO上对应的item的数据
				if(soItem == poItem){
				//获取
				var rate = parseFloat(poRec.getLineItemValue('item', 'rate', j));
				var taxRate = parseFloat(poRec.getLineItemValue('item', 'taxrate1', j))/100;
				//计算报关单价
				var bgPrice = rate * (1+taxRate);
				var grossamount = poRec.getLineItemValue('item', 'grossamt', j);
//				nlapiLogExecution('error', 'bgPrice', bgPrice);
//				nlapiLogExecution('error', 'grossamount', grossamount);
				//报关单价赋值
				soRec.setLineItemValue('item', 'custcol_bill_rate', i, bgPrice);
				//报关总价赋值
				soRec.setLineItemValue('item', 'custcol_bill_amount', i, grossamount);
				}
			}
		}
		//赋值
		soRec.setLineItemValue('item', 'custcol_dropship_vendor',i,po_vendor);
		soRec.setLineItemValue('item', 'custcolso_price',i,so_rate);
			}
	nlapiSubmitRecord(soRec);
		}
	}
}
