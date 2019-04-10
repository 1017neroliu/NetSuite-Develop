function pageInit()
{
   //On page init display the currently logged in User's profile information.

   // Set variables
   var userName = nlapiGetUser();        // entity id of the current user 
   var userRole = nlapiGetRole();        // id of the current user's role 
   var userDept = nlapiGetDepartment();  // id of the current user's department 
   var userLoc = nlapiGetLocation();     // id of the current user's location 
   
   //获取employee的record以便操作employee表单，获取当前登录用户的用户名id对应的用户名和其他信息
   var record = nlapiLoadRecord('employee', userName);
   //获取用户id对应的名字
   var name = record.getFieldValue("firstname");

   //  Display information
   alert("Current User Information" + "\n\n" +
       "Name: " + name + "\n" +
       "Role: " + userRole + "\n" +
       "Dept: " + userDept + "\n" +
       "Loc: " + userLoc
       );
}
