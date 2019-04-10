function checkRolePermissionsTBA() {
    
 /* Obtain the role ID of currently logged in user */

 var currentUserRole = nlapiGetRole(); 
 nlapiLogExecution('DEBUG','Current User Role', currentUserRole);
 
 var adminRoleID = 3;
 
 /* if the role ID of the currently logged in user is Administrator, then state Administrator role
 has all permissions. Otherwise, for a Non-Administrator role use a saved search to verify permissions */
 
 /* Do logging (optional) */
 
 if (currentUserRole != adminRoleID) {
 
  /* Search Filters */
  var searchFilters = new Array();
  searchFilters[0] = new nlobjSearchFilter('internalid', null, 'anyof', currentUserRole);
  nlapiLogExecution('DEBUG','Filters', 'OK');
 
  /* Search Result Columns */
  var searchColumns = new Array();
  searchColumns[0] = new nlobjSearchColumn('permission');
  nlapiLogExecution('DEBUG','Columns', 'OK');
 
  /* Use the existing saved search to obtain permissions list for the role. Pass the filters and
  ccolumns defined above */
  
  var searchResults = nlapiSearchRecord('Role','customsearch117', searchFilters, searchColumns);
  nlapiLogExecution('DEBUG','Searched Records', 'OK');
 
  /* Display results on the suitelet page */
  response.write('Current Role = ' + currentUserRole + '\n\n');
  response.write('Search Results Array Length = ' + searchResults.length + '\n\n');
 
  /* Create an array to hold the permission values returned from the search */
  var tempPermissions = new Array();
 
  /* Loop through search results to push permission values in the temporary array defined above 
  and display the values on the page (optional). Notice getText() function is used. For getValue()
  the resulting permission values are different. */
  
  for (var i = 0; i < searchResults.length; i++) {
   
   /* pushing the permissions into temporary array */
   tempPermissions.push(searchResults[i].getText(searchColumns[0]));
   response.write(searchResults[i].getText(searchColumns[0]) + '\n');
 
  }
 
  nlapiLogExecution('DEBUG','Search Results Array Length', searchResults.length);
 
  /* Array to hold the set of 3 specific permissions related to TBA */
  var requiredPermissionsTBA = new Array();
  requiredPermissionsTBA[0] = 'Access Token Management'; 
  requiredPermissionsTBA[1] = 'Log in using Access Tokens';
  requiredPermissionsTBA[2] = 'User Access Tokens';
 
  /* Index variable with value -1 to indicate that permission is not found in the array */
  var idx = -1;
 
  /* Checking if the role has ALL 3 permissions and display message accordingly */
  if  ((tempPermissions.indexOf(requiredPermissionsTBA[0]) != idx) &&
   (tempPermissions.indexOf(requiredPermissionsTBA[1]) != idx) &&
   (tempPermissions.indexOf(requiredPermissionsTBA[2]) != idx)) {
  
   response.write('\n\nThis user has all required permissions for TBA\n\n');
  }
 
  else {
  
   response.write('\n\nThis user does not have permissions for TBA\n\n');
  
  }
 
  nlapiLogExecution('DEBUG','Status', 'Completed');
 }
 
 else {
  
  response.write('You have logged in with the Administrator role. So, you have all permissions');
  
 }
}