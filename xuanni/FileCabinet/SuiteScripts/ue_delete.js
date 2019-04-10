/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Mar 2019     Nero
 *	删除和丽晶对接时产生的测试单据
 */

function deleteInventoryTransfer(type){
	
	try {
		var searchresults = nlapiSearchRecord(null, 'customsearch288');
		for (var z = 0; searchresults != null && z < searchresults.length; z++)

		{

			var id = searchresults[z].getId();

			nlapiDeleteRecord('inventorytransfer', id);

		}
	} catch (e) {
		checkGovernance(e);
	}
}
