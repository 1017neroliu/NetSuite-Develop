/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       12 Oct 2018     Nero
 *	
 *	新建一个record的时候，先做个search，以编号这个字段作为过滤器，截取cp后的数字，然后按升序或降序排列，如果search
 *	不为空，取最大的值的编号，然后给当前record的编号+1，再拼接cp字符串，如果search是如果为空就设置cp20000。设置cp号
 *	的时候判断一下这个cp号是否已经存在，如果存在不允许保存。
 */

function pageInit(type){
	if(type == 'create'){
		var firstValue = 'cp20000';
		var filter = new nlobjSearchFilter('custitem_aa', null, 'startswith','cp2');
		
		var column = new nlobjSearchColumn('custitem_aa').setSort(true);
//		nlapiLogExecution('debug', 'cp', cp);	
//		for (var i = 1; i <= cp.length; i++) {
//			var str = parseInt(cp[i].substring(2,cp[i].length));
//			nlapiLogExecution('debug', 'str', str);
//		}
//		var column = str.setSort(true);//降序排列
		nlapiLogExecution('debug', 'column', column);
		
		/**
		 * 以inventory item上的cp号作为过滤器，如果cp号是以cp开头的，搜索出来cp号的值，将cp号按降序排序，
		 * 取第一个值就是最大值
		 */
		
		var search = nlapiSearchRecord('inventoryitem', null, filter,column);
//				[new nlobjSearchFilter('custitem_aa', null, 'startswith','cp')],
//				[new nlobjSearchColumn('custitem_aa').setSort(true)]);
		//如果search为空，说明是第一个创建的record，设置固定值
		if(search == null){
			nlapiSetFieldValue('itemid', firstValue);
			nlapiSetFieldValue('custitem_aa', firstValue);
		}
		//如果search不为空，取最大值+1并赋值给number和cp号
		if(search != null){
			var maxCP = search[0].getValue('custitem_aa');
			nlapiLogExecution('debug', 'maxCP', maxCP);
			var latestStr = parseInt(maxCP.substring(2,maxCP.length));
			var latestValue = (latestStr + 1).toString();
			nlapiLogExecution('debug', 'latestValue', latestValue);
			
			nlapiSetFieldValue('itemid', 'cp'+latestValue);
			nlapiSetFieldValue('custitem_aa', 'cp'+latestValue);
		}
	}
}
