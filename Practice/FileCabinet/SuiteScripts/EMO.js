/*****************************************************
 *This function is a module to implement at end of
 * month(last 5 days of month) promotion for sales
 * orders. It is meant to be deployed on the before
 * load event of the sales order record.
 */
function customizeUI_SalesOrderBeforeLoad(type, form)
{
  var currentContext = nlapiGetContext();
   
  //只有在使用浏览器UI创建销售订单时才执行逻辑
  if (type == 'create' && currentContext.getExecutionContext() == 'userinterface')
  {
    var fieldId = 'custpage_eom_promotion';
    var fieldLabel = 'Eligible EOM promotion';
    var today = new Date();
    var month = today.getMonth();
    var date = today.getDate();
    nlapiLogExecution('DEBUG', 'month date', month + ' ' + date);
      
    //February
    if (month==1)
    {
      if (date==24 | date==25 | date==26 | date==27 | date==28 | date==29)
      form.addField(fieldId, 'checkbox', fieldLabel);
    }
    //31-day months
    else if (month==0 | month==2 | month ==4 | month==6 | month==7 | month==9 | month==11)
    {
      if ( date==27 | date==28 | date==29 | date==30 | date==31)
      form.addField(fieldId, 'checkbox', fieldLabel);
    
    //30-day months
    else
    {
      if ( date==26 | date==27 | date==28 | date==29 | date==30)
      form.addField(fieldId, 'checkbox', fieldLabel);
       }
     }
   }
}
