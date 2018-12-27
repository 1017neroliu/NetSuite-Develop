/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       17 Sep 2018     Nero
 *
 */
//从估价单Estimate上点击SalesOrder按钮，新建一张SalesOrder的时候，设置ExchangeRate的值
function pageInit(type){
	   try {
           // 获取SO上的值
           var primaryCurrency = nlapiGetFieldValue('custbody_so_primary_currency');
           var currency = nlapiGetFieldValue('currency');
           var date = nlapiGetFieldValue('trandate');
           nlapiLogExecution('debug', 'primaryCurrency', primaryCurrency);
           nlapiLogExecution('debug', 'currency', currency);
           nlapiLogExecution('debug', 'date', date);
           if (primaryCurrency != null && currency != null) {
               // search汇率转换
               var search = nlapiSearchRecord(null, 92, 
                       [new nlobjSearchFilter('basecurrency', null, 'is',primaryCurrency),
                       new nlobjSearchFilter('transactioncurrency', null,'is', currency),
                       //日期过滤器，在这个日期之前的，就是notafter
                       new nlobjSearchFilter('effectivedate', null, 'notafter',date)], 
                       [new nlobjSearchColumn('exchangerate'),
                       new nlobjSearchColumn('effectivedate').setSort(true)]);
               
               if (search != null) {
                   var exchangeRate = search[0].getValue('exchangerate');
                   var effectiveDate = search[0].getValue('effectivedate');
                   
                   nlapiLogExecution('debug', 'exchangeRate', exchangeRate);
                   nlapiSetFieldValue('custbody_est_exchange_rate',exchangeRate);
               }
           }
       } catch (e) {
       }
}
