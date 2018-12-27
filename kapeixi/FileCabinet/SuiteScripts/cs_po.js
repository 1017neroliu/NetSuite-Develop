function pageInit(){
	var itemCount = nlapiGetLineItemCount("item");
	for (var i = 1; i <=itemCount ; i++) {
		var quantity = parseInt(nlapiGetLineItemValue("item", "quantity", i));
		nlapiLogExecution("debug", "quantity", quantity);
		if (quantity) {
			var num = Math.ceil(quantity*0.05);
			 if (num > 20) {
				nlapiSetLineItemValue("item", "custcol_receive_upline", i, quantity+20);
			}else{
				nlapiSetLineItemValue("item", "custcol_receive_upline", i, quantity+num);
			}
		}
	}
} 

//function pageInit(){
//	var recType = nlapiGetRecordType();
//	var recId = nlapiGetRecordId();
//	var record = nlapiLoadRecord(recType, recId, {recordmode: 'dynamic'})
//	
//	var itemCount = record.getLineItemCount("item");
//	for (var i = 1; i <=itemCount ; i++) {
//		var quantity = parseInt(record.getLineItemValue("item", "quantity", i));
//		nlapiLogExecution("debug", "quantity", quantity);
//		if (quantity) {
//			var num = Math.ceil(quantity*0.05);
//			 if (num > 20) {
//				 record.setLineItemValue("item", "custcol_receive_upline", i, quantity+20);
//			}else{
//				record.setLineItemValue("item", "custcol_receive_upline", i, quantity+num);
//			}
//		}
//		 
//	}
//	nlapiSubmitRecord(record);
//} 



//计算item行中最大数量
function fieldChanged(type,name,linenum){
	 	
	 if (name == "quantity") {
		 var quantity = parseInt(nlapiGetCurrentLineItemValue("item", "quantity"));
		 var num = Math.ceil(quantity*0.05);
		 if (num > 20) {
			nlapiSetCurrentLineItemValue("item", "custcol_receive_upline", quantity+20);
		}else{
			nlapiSetCurrentLineItemValue("item", "custcol_receive_upline", quantity+num);
		}
	 }
	 //===================================NERO=============================================
	 if(name == 'item'){
			var itemId = nlapiGetCurrentLineItemValue('item', 'item');
			nlapiLogExecution('error', 'itemId', itemId);
			var upccode = nlapiLookupField('inventoryitem', itemId, 'upccode');
			nlapiLogExecution('error', 'upccode', upccode);
			nlapiSetCurrentLineItemValue('item', 'description', 'UPC CODE:'+upccode+'.');
//			alert('stop')
//			nlapiSetCurrentLineItemValue('item', 'description', 'UPC CODE:'+upccode+'.');
		}
}
