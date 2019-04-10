/**
 * 
 */
function opportunity(internalid, title, probability, amount, customer, salesrep)
{
   this.id = internalid;
   this.title = title;
   this.probability = probability;
   this.amount = amount;
   this.customer = customer;
   this.salesrep = salesrep;
}
 
// RESTlet Get NetSuite record data
function getRecords(datain)
{
    var filters = new Array();
    var daterange = 'daysAgo90';
    var projectedamount = 0;
    var probability = 0;
    if (datain.daterange) {
        daterange = datain.daterange;
    }
    if (datain.projectedamount) {
        projectedamount = datain.projectedamount;
    }
    if (datain.probability) {
        probability = datain.probability;
    }
    
    filters[0] = new nlobjSearchFilter( 'trandate', null, 'onOrAfter', daterange ); // like daysAgo90
    filters[1] = new nlobjSearchFilter( 'projectedamount', null, 'greaterthanorequalto', projectedamount);
    filters[2] = new nlobjSearchFilter( 'probability', null, 'greaterthanorequalto', probability );
    
    // Define search columns
    var columns = new Array();
    columns[0] = new nlobjSearchColumn( 'salesrep' );
    columns[1] = new nlobjSearchColumn( 'expectedclosedate' );
    columns[2] = new nlobjSearchColumn( 'entity' );
    columns[3] = new nlobjSearchColumn( 'projectedamount' );
    columns[4] = new nlobjSearchColumn( 'probability' );
    columns[5] = new nlobjSearchColumn( 'email', 'customer' );
    columns[6] = new nlobjSearchColumn( 'email', 'salesrep' );
    columns[7] = new nlobjSearchColumn( 'title' );
    
    // Execute the search and return results
 
    var opps = new Array();
    var searchresults = nlapiSearchRecord( 'opportunity', null, filters, columns );
    
    // Loop through all search results. When the results are returned, use methods
    // on the nlobjSearchResult object to get values for specific fields.
    for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
    {
        var searchresult = searchresults[ i ];
        var record = searchresult.getId( );
        var salesrep = searchresult.getValue( 'salesrep' );
        var salesrep_display = searchresult.getText( 'salesrep' );
        var salesrep_email = searchresult.getValue( 'email', 'salesrep' );
        var customer = searchresult.getValue( 'entity' );
        var customer_display = searchresult.getText( 'entity' );
        var customer_email = searchresult.getValue( 'email', 'customer' );
        var expectedclose = searchresult.getValue( 'expectedclosedate' );
        var projectedamount = searchresult.getValue( 'projectedamount' );
        var probability = searchresult.getValue( 'probability' );
        var title = searchresult.getValue( 'title' );
 
        opps[opps.length++] = new opportunity( record,
               title,
               probability,
               projectedamount,
               customer_display,
               salesrep_display);
    }
   
    var returnme = new Object();
    returnme.nssearchresult = opps;
    return returnme;
}