/**
 * RESTlet例子
 * @param datain
 * @returns
 */ 

function getItemsDetails(datain) {
     var responer;	
   nlapiLogExecution('debug','recordtype',datain.recordtype);
	if (datain.recordtype=='item')
      responer=itemdetail() ;
  	else if (datain.recordtype=='customer')
      responer=customerdetail() ;
    else if (datain.recordtype=='location')
      responer=locationdetail() ;
	return JSON.stringify(responer);

}



function itemdetail() {
	
 	    var itemFilters = new Array();
       //     itemFilters[0] = new nlobjSearchFilter('internalid', null, 'is', id);
  	    var strclass="5,6,43";
	    var classarray=strclass.split(",");
	        itemFilters[0] = new nlobjSearchFilter('class', null, 'anyof', classarray);
        var itemColumns = new Array();
          itemColumns[0] = new nlobjSearchColumn('internalid', null, null);
          itemColumns[1] = new nlobjSearchColumn('itemid', null, null);    
          itemColumns[2] = new nlobjSearchColumn('displayname', null, null);
          itemColumns[3] = new nlobjSearchColumn('stockunit', null, null); 
     var itemsearchresults = nlapiCreateSearch( 'item', itemFilters, itemColumns );
	 var runSearch = itemsearchresults.runSearch();
    var jsondata = []; 
	var resultIndex = 0; 
	var resultStep = 1000; 
	var resultSet;
    var itemrow=0;
	 do 
	 {
		 resultSet = runSearch.getResults(resultIndex, resultIndex + resultStep);
		resultIndex = resultIndex + resultStep;
       var  searchlength=resultSet.length;
	   itemrow+=searchlength;
		if(resultSet != null && searchlength > 0)
	    {   
			for(var f = 0; f < searchlength; f++)
			{
		    var internalid = resultSet[f].getValue('internalid');						
		    var itemid = resultSet[f].getValue('itemid');		
		    var displayname = resultSet[f].getValue('displayname');		
		    var stockunit = resultSet[f].getValue('stockunit');					
		var item = {
         "internalid": internalid,
         "itemid": itemid,
		 "displayname": displayname,
		 "stockunit": stockunit 
		};

		jsondata.push(item);			
				
			}
 	    }	
 } while (resultSet != null && resultSet.length > 0) 
		
 nlapiLogExecution('debug','searchlength',itemrow);
     var responer ={
       "response":jsondata
     }
    return 	 responer;
 }
 
 
 function customerdetail() {
	
 	    var itemFilters = new Array();
            itemFilters[0] = new nlobjSearchFilter('stage', null, 'is', 'CUSTOMER');
        var itemColumns = new Array();
          itemColumns[0] = new nlobjSearchColumn('internalid', null, null);
          itemColumns[1] = new nlobjSearchColumn('entityid', null, null);    
          itemColumns[2] = new nlobjSearchColumn('altname', null, null);
          itemColumns[3] = new nlobjSearchColumn('companyname', null, null); 
          itemColumns[4] = new nlobjSearchColumn('address', null, null); 
          itemColumns[5] = new nlobjSearchColumn('contact', null, null); 
          itemColumns[6] = new nlobjSearchColumn('phone', null, null); 		
          itemColumns[7] = new nlobjSearchColumn('isdefaultbilling', null, null); 		
          itemColumns[8] = new nlobjSearchColumn('stage', null, null); 			  
     var itemsearchresults = nlapiCreateSearch( 'customer', itemFilters, itemColumns );
	 var runSearch = itemsearchresults.runSearch();
    var jsondata = []; 
	var resultIndex = 0; 
	var resultStep = 1000; 
	var resultSet;
    var itemrow=0;
	 do 
	 {
		 resultSet = runSearch.getResults(resultIndex, resultIndex + resultStep);
		resultIndex = resultIndex + resultStep;
       var  searchlength=resultSet.length;
	 //  itemrow+=searchlength;
		if(resultSet != null && searchlength > 0)
	    {   
			for(var f = 0; f < searchlength; f++)
			{
		    var internalid = resultSet[f].getValue('internalid');						
		    var entityid = resultSet[f].getValue('entityid');		
		    var altname = resultSet[f].getValue('altname');		
		    var companyname = resultSet[f].getValue('companyname');		
		    var address = resultSet[f].getValue('address');		
		    var contact = resultSet[f].getValue('contact');		
		    var phone = resultSet[f].getValue('phone');		
		    var isdefaultbilling = resultSet[f].getValue('isdefaultbilling');		
  nlapiLogExecution('debug','isdefaultbilling',isdefaultbilling);
        if 	((isdefaultbilling=='T')	 || ((isdefaultbilling=='F')	&& address==''))
		{
	    var item = {
         "internalid": internalid,
         "entityid": entityid,
		 "altname": altname,
		 "companyname": companyname,
		 "address": address,
		 "contact": contact,
		 "phone": phone 
		};

		jsondata.push(item);
        itemrow++;		
		}		
		 }
 	    }	
 } while (resultSet != null && resultSet.length > 0) 
		
 nlapiLogExecution('debug','searchlength',itemrow);
     var responer ={
       "response":jsondata
     }
    return 	 responer;
 }
 
 
 

function locationdetail() {
	
 	    var itemFilters = new Array();
       //     itemFilters[0] = new nlobjSearchFilter('internalid', null, 'is', id);
        var itemColumns = new Array();
          itemColumns[0] = new nlobjSearchColumn('internalid', null, null);
          itemColumns[1] = new nlobjSearchColumn('name', null, null);    
          itemColumns[2] = new nlobjSearchColumn('locationtype', null, null);
 
     var itemsearchresults = nlapiCreateSearch( 'location', itemFilters, itemColumns );
	 var runSearch = itemsearchresults.runSearch();
    var jsondata = []; 
	var resultIndex = 0; 
	var resultStep = 1000; 
	var resultSet;
    var itemrow=0;
	 do 
	 {
		 resultSet = runSearch.getResults(resultIndex, resultIndex + resultStep);
		resultIndex = resultIndex + resultStep;
       var  searchlength=resultSet.length;
	   itemrow+=searchlength;
		if(resultSet != null && searchlength > 0)
	    {   
			for(var f = 0; f < searchlength; f++)
			{
		    var internalid = resultSet[f].getValue('internalid');						
		    var name = resultSet[f].getValue('name');		
		    var locationtype = resultSet[f].getValue('locationtype');		
 				
		var item = {
         "internalid": internalid,
         "name": name,
		 "locationtype": locationtype 
		};

		jsondata.push(item);			
				
			}
 	    }	
 } while (resultSet != null && resultSet.length > 0) 
		
 nlapiLogExecution('debug','searchlength',itemrow);
     var responer ={
       "response":jsondata
     }
    return 	 responer;
 }
 