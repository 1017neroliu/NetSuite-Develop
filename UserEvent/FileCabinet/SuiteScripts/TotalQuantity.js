function beforeSubmit(type){
	if(type == 'create' || type == 'edit'){
		//custbody_total_quantity
		//获取item的所有的值
		nlapiGetLineItemValue('items', fldnam, linenum);
	}
}
