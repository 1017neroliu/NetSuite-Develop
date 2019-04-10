// Define search filters
var filters = new Array();
filters[0] = new nlobjSearchFilter( 'trandate', null, 'onOrAfter', 'daysAgo90' );
//参数：type，id，filters，column
filters[1] = new nlobjSearchFilter( 'projectedamount', null, 'between', 1000, 100000 );
filters[2] = new nlobjSearchFilter( 'salesrep', 'customer', 'anyOf', -5, null );
// Define search columns
var columns = new Array();
columns[0] = new nlobjSearchColumn( 'salesrep' );
columns[1] = new nlobjSearchColumn( 'expectedclosedate' );
columns[2] = new nlobjSearchColumn( 'entity' );
columns[3] = new nlobjSearchColumn( 'projectedamount' );
columns[4] = new nlobjSearchColumn( 'probability' );
columns[5] = new nlobjSearchColumn( 'email', 'customer' );
columns[6] = new nlobjSearchColumn( 'email', 'salesrep' );
//参数：列名，列的连接id
// Create the saved search
var search = nlapiCreateSearch( 'opportunity', filters, columns );
var searchId = search.saveSearch('My Opportunities in Last 90 Days', 'customsearch_kr');

//--------------------------------------------------------------------------------


var search = nlapiLoadSearch('opportunity', 'customsearch_blackfriday');
var newSearch = nlapiCreateSearch(search.getSearchType(), search.getFilters(),
      search.getColumns());
newSearch.addFilter(new nlobjSearchFilter()); //Specify your own criteria here to add as a filter
newSearch.setIsPublic(true);
newSearch.saveSearch('My new opp search', 'customsearch_blacksaturday');

//--------------------------------------------------------------------------------

//Define search filter expression
var filterExpression = [ [ 'trandate', 'onOrAfter', 'daysAgo90' ],
               'and',
               [ 'projectedamount', 'between', 1000, 100000 ],
               'and',
               [ 'customer.salesrep', 'anyOf', -5 ] ];

//Define search columns
var columns = new Array();
columns[0] = new nlobjSearchColumn('salesrep');
columns[1] = new nlobjSearchColumn('expectedclosedate');
columns[2] = new nlobjSearchColumn('entity');
columns[3] = new nlobjSearchColumn('projectedamount');
columns[4] = new nlobjSearchColumn('probability');
columns[5] = new nlobjSearchColumn('email', 'customer');
columns[6] = new nlobjSearchColumn('email', 'salesrep');

//Create the saved search
var search = nlapiCreateSearch('opportunity', filterExpression, columns);
var searchId = search.saveSearch('My Opportunities in Last 90 Days', 'customsearch_kr');

//--------------------------------------------------------------------------------

var search = nlapiLoadSearch('opportunity', 'customsearch_blackfriday');
var newSearch = nlapiCreateSearch(search.getSearchType(), search.getFilterExpression(), search.getColumns());
newSearch.addFilter (new nlobjSearchFilter()); //Specify your own criteria here to add as a filter
newSearch.setIsPublic(true);
newSearch.saveSearch('My new opp search', 'customsearch_blacksaturday');





