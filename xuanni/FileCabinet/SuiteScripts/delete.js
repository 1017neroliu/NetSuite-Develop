function scheduleDelete(type)

{
nlapiLogExecution('error', '测试', '23');
  var searchresults = nlapiSearchRecord(null, 'customsearch304');

  for ( var z = 0; searchresults != null && z < searchresults.length; z++ )

  {

   var id = searchresults[z].getId();

   nlapiDeleteRecord('invoice', id);

  }

}