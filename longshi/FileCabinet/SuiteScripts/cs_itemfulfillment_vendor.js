/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Sep 2018     Nero
 *	不采用！！
 */
//fulfill的时候，如果SO的明细行上存在CREATE PO,就是直运订单，就把PO VENDOR传到item fulfillment的明细行上面
function pageInit(){
	//获取SO的id
	var soId = nlapiGetFieldValue('createdfrom');
	//拿到SO的id，根据id去search，判断这个是否是SO的id
	var search = nlapiSearchRecord(null, soId);
	//search出来的record的类型
	var searchType = search.getRecordType();
	nlapiLogExecution('debug', 'searchType', searchType);
	//id存在并且类型是SO
	if(soId && searchType == 'salesorder'){
		var so = nlapiLoadRecord('salesorder', soId);
		var num = so.getLineItemCount('item');
		for (var i = 1; i <= num; i++) {
			var po_vendor = so.getLineItemValue('item', 'povendor', i);
			nlapiLogExecution('debug', 'po_vendor', po_vendor);
			var createdpo = so.getLineItemValue('item', 'createdpo', i);
			nlapiLogExecution('debug', 'createdpo', createdpo);
			//如果是直运订单
			if(createdpo){
			nlapiSelectLineItem('item',i);
			nlapiSetCurrentLineItemValue('item','custcol_dropship_vendor',po_vendor,i);
			nlapiCommitLineItem('item');
			}
		}
	}
}
