/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       03 Aug 2018     Nero
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
	if(so){
		nlapiLogExecution('debug', '查看so',so);
		//加载销售订单记录
		var soRecord = nlapiLoadRecord('salesorder', so);
		//获得子公司的id
		var sub = soRecord.getFieldValue('subsidiary');
	if(sub){
		nlapiLogExecution('debug', '查看sub',sub);
		//加载子公司记录
		var subRecord = nlapiLoadRecord('subsidiary',sub);
		var subAdd = subRecord.getFieldValue('addrtext');
		nlapiLogExecution('debug', '地址',subAdd);
		nlapiSetFieldValue('custbody_field_in_col_sub_add', subAdd);
		//获取销售订单item的行数
		var linenum = soRecord.getLineItemCount('item');
		var totalVol = 0;
		var totalPrice = 0;
		//遍历so的item行
	for (var i = 1; i <= linenum; i++) {
		//获得item每行的id
		var item = soRecord.getLineItemValue('item', 'item', i);
		//获取item行的每行item的类型？如何获得？saved searches
//		var search = nlapiSearchRecord('item', null, 
//				new nlobjSearchFilter('internalid', null, 'is',item),
//				[new nlobjSearchColumn('custitem_field_item_long'),
//				 new nlobjSearchColumn('custitem_field_item_wide'),
//				 new nlobjSearchColumn('custitem_field_item_high'),
//				 new nlobjSearchColumn('custitem_custom_code')
//				 ]);
//		if(search != null){
//			var long = search[0].getValue('custitem_field_item_long');
//			var width = search[0].getValue('custitem_field_item_wide');
//			var height = search[0].getValue('custitem_field_item_high');
//			var code = search[0].getValue('custitem_custom_code');
//		}
		//加载每行的记录（前提是item的类型都是‘lotnumberedinventoryitem’）
//		var itemRec = nlapiLoadRecord('lotnumberedinventoryitem', item);
		//获取每行对应的数据
//		var long = itemRec.getFieldValue('custitem_field_item_long');
//		var width = itemRec.getFieldValue('custitem_field_item_wide');
//		var height = itemRec.getFieldValue('custitem_field_item_high');
//		var code = itemRec.getFieldValue('custitem_custom_code');
		
//		nlapiLogExecution('debug', 'long', long);
		var long = parseFloat(soRecord.getLineItemValue('item', 'custcol_so_length', i));
		var width = parseFloat(soRecord.getLineItemValue('item', 'custcol_so_width', i));
		var height = parseFloat(soRecord.getLineItemValue('item', 'custcol_so_hight', i));
		var code = soRecord.getLineItemValue('item', 'custcol_line_in_col_hs_code', i);
		
		var quantity = parseFloat(soRecord.getLineItemValue('item','custcol_field_so_line_delivery',i));
		var huopin = soRecord.getLineItemValue('item','item',i);
		var rate = soRecord.getLineItemValue('item','rate',i);
		var kaipiao = parseFloat(soRecord.getLineItemValue('item','custcol_fileld_so_line_cum_billed_qua',i));
		if(!kaipiao){
			kaipiao = 0;
		}
		
		nlapiLogExecution('debug', 'quantity', quantity);
		nlapiLogExecution('debug', 'width', width);
		nlapiLogExecution('debug', 'height', height);
		nlapiLogExecution('debug', 'long', long);
		
		//设置值需要新建一个LineItem
		nlapiSelectNewLineItem('line');
		//给隐藏的必填字段设置默认值
		nlapiSetCurrentLineItemValue('line', 'account',830);
		nlapiSetCurrentLineItemValue('line', 'amount',0);
		//将需要从其他页面带过来的值设置值
		nlapiSetCurrentLineItemValue('line','custcol_line_in_col_hs_code',code);
		nlapiSetCurrentLineItemValue('line','custcol_so_length',long);
		nlapiSetCurrentLineItemValue('line','custcol_so_width',width);
		nlapiSetCurrentLineItemValue('line','custcol_so_hight',height);
		nlapiSetCurrentLineItemValue('line','custcol_line_in_col_item',huopin);
		nlapiSetCurrentLineItemValue('line','custcol_line_in_col_rate',rate);
		
		//单位体积
		var sVol = parseFloat((long*width*height/1000000).toFixed(2));
		nlapiLogExecution('debug', 'sVol', sVol);
		//计算行总体积
		var vol = parseFloat((long*width*height*quantity/1000000).toFixed(2));
		nlapiLogExecution('debug', 'vol', vol);
		//本次最大开单数量
		var max = quantity - kaipiao;
		var total = rate*max;
		nlapiSetCurrentLineItemValue('line','custcol_field_in_col_line_max_qua',max);
		nlapiSetCurrentLineItemValue('line','custcol_line_in_col_quantity',max);
		nlapiSetCurrentLineItemValue('line','custcol_field_in_col_line_delivery',quantity);
		nlapiSetCurrentLineItemValue('line','custcol_field_line_per_vol',sVol);
		nlapiSetCurrentLineItemValue('line','custcol_field_line_in_col_vol',vol);
		nlapiSetCurrentLineItemValue('line','custcol_line_in_col_grossamt',total);
		//新建的值需要提交到数据库
		nlapiCommitLineItem('line');
		
		totalVol += vol;
		nlapiLogExecution('debug', '总体积', totalVol);
		totalPrice += total;
		nlapiLogExecution('debug', '总价', totalPrice);
	}
	//获取销售订单的字段值
	var subName = soRecord.getFieldValue('subsidiary');
	nlapiLogExecution('debug', '子公司',subName);
	
	nlapiSetFieldValue('subsidiary', subName);
	nlapiSetFieldValue('custbody_field_in_col_volume', totalVol);
	nlapiSetFieldValue('custbody_field_in_col_amt', totalPrice);
			}
		}
	}
}
