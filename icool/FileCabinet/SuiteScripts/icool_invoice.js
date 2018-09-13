/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       03 Aug 2018     Nero
 *
 */
function beforeLoad(type, form, request){
	
	//隐藏记录上的字段，设置为‘hidden’
	nlapiGetField('total').setDisplayType('hidden');
	//隐藏子列表前四个字段,account和amount是系统的必填字段，所以要隐藏需要给其设置默认值，设置默认值在73-74行
	nlapiGetLineItemField('line','account').setDisplayType('hidden');
	nlapiGetLineItemField('line','amount').setDisplayType('hidden');
	nlapiGetLineItemField('line','memo').setDisplayType('hidden');
	nlapiGetLineItemField('line','entity').setDisplayType('hidden');
	
	if(type == 'create' || type == 'edit' || type == 'view'){
	//获得销售订单id
	var so = nlapiGetFieldValue('custbody_field_in_col_so');
	nlapiLogExecution('debug', '查看so',so);
	//加载销售订单记录
	var soRecord = nlapiLoadRecord('salesorder', so);
	//获得子公司的id
	var sub = soRecord.getFieldValue('subsidiary');
	nlapiLogExecution('debug', '查看sub',sub);
	//加载子公司记录
	var subRecord = nlapiLoadRecord('subsidiary',sub);
	//获取销售订单item的行数
	var linenum = soRecord.getLineItemCount('item');
	var totalVol = 0;
	var totalPrice = 0;
	//遍历so的item行
	for (var i = 1; i <= linenum; i++) {
		//获得item每行的id
		var item = soRecord.getLineItemValue('item', 'item', i);
		//获取item行的每行item的类型？如何获得？saved searches
		var search = nlapiSearchRecord('item', null, 
				new nlobjSearchFilter('internalid', null, 'is',item),
				[new nlobjSearchColumn('custitem_field_item_long'),
				 new nlobjSearchColumn('custitem_field_item_wide'),
				 new nlobjSearchColumn('custitem_field_item_high'),
				 new nlobjSearchColumn('custitem_custom_code')
				 ]);
		if(search != null){
			var long = search[0].getValue('custitem_field_item_long');
			var width = search[0].getValue('custitem_field_item_wide');
			var height = search[0].getValue('custitem_field_item_high');
			var code = search[0].getValue('custitem_custom_code');
		}
		//加载每行的记录（前提是item的类型都是‘lotnumberedinventoryitem’）
//		var itemRec = nlapiLoadRecord('lotnumberedinventoryitem', item);
		//获取每行对应的数据
//		var long = itemRec.getFieldValue('custitem_field_item_long');
//		var width = itemRec.getFieldValue('custitem_field_item_wide');
//		var height = itemRec.getFieldValue('custitem_field_item_high');
//		var code = itemRec.getFieldValue('custitem_custom_code');
		
		nlapiLogExecution('debug', 'long', long);
		
		var quantity = parseInt(soRecord.getLineItemValue('item','quantity',i));
		var top = parseFloat(soRecord.getLineItemValue('item','custcol_field_so_line_delivery',i));
		var huopin = soRecord.getLineItemValue('item','item',i);
		var rate = soRecord.getLineItemValue('item','rate',i);
		var kaipiao = parseFloat(soRecord.getLineItemValue('item','custcol_fileld_so_line_cum_billed_qua',i));
		if(!kaipiao){
			kaipiao = 0;
		}
		var total = rate*quantity;
		
		nlapiLogExecution('debug', 'quantity', quantity);
		nlapiLogExecution('debug', 'width', width);
		nlapiLogExecution('debug', 'height', height);
		
		//设置值需要新建一个LineItem
		nlapiSelectNewLineItem('line');
		//给隐藏的必填字段设置默认值
		nlapiSetCurrentLineItemValue('line', 'account',830);
		nlapiSetCurrentLineItemValue('line', 'amount',0);
		//将需要从其他页面带过来的值设置值
		nlapiSetCurrentLineItemValue('line','custcol_line_in_col_hs_code',code);
		nlapiSetCurrentLineItemValue('line','custcol_line_in_col_item',huopin);
		nlapiSetCurrentLineItemValue('line','custcol_line_in_col_rate',rate);
		nlapiSetCurrentLineItemValue('line','custcol_line_in_col_grossamt',total);
		//单位体积
		var sVol = long*width*height;
		//计算总体积
		var vol = long*width*height*quantity;
		//本次最大开单数量
		var max = top - kaipiao;
		nlapiSetCurrentLineItemValue('line','custcol_field_in_col_line_max_qua',max);
		nlapiSetCurrentLineItemValue('line','custcol_line_in_col_quantity',max);
		nlapiSetCurrentLineItemValue('line','custcol_field_in_col_line_delivery',top);
		nlapiSetCurrentLineItemValue('line','custcol_field_line_per_vol',sVol);
		nlapiSetCurrentLineItemValue('line','custcol_field_line_in_col_vol',vol);
		//新建的值需要提交到数据库
		nlapiCommitLineItem('line');
		
		totalVol += vol;
		nlapiLogExecution('debug', '总体积', totalVol);
		totalPrice += total;
		nlapiLogExecution('debug', '总价', totalPrice);
	}
	
	//获取销售订单的字段值
	var subName = soRecord.getFieldValue('subsidiary');
	var subAdd = subRecord.getFieldValue('addrtext');
	
	nlapiLogExecution('debug', '子公司',subName);
	nlapiLogExecution('debug', '地址',subAdd);
	
	nlapiSetFieldValue('subsidiary', subName);
	nlapiSetFieldValue('custbody_field_in_col_sub_add', subAdd);
	nlapiSetFieldValue('custbody_field_in_col_volume', totalVol);
	nlapiSetFieldValue('custbody_field_in_col_amt', totalPrice);
	}
}

