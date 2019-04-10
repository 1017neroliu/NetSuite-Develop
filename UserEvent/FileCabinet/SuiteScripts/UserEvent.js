/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       27 Jun 2018     Nero
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Operation types: create, edit, view, copy, print, email
 * @param {nlobjForm} form Current form
 * @param {nlobjRequest} request Request object
 * @returns {Void}
 */
/**
 * 获得销售订单上的关联单子上的相应信息，在提交此单子时将信息一块随着单子保存进去
 */

function beforeLoad(type, form, request) {
    try {
        var id = nlapiGetRecordId(), recType = nlapiGetRecordType();
        nlapiLogExecution("debug", "beforeLoad____________ id: " + id, "recType: " + recType + " type: " + type);

        nlapiLogExecution("debug", "beforeLoad____________end");
    } catch (e) {
        processException(e);
    }
}


function afterSubmit(type) {

    var id = nlapiGetRecordId(), recType = nlapiGetRecordType();
    nlapiLogExecution("debug", "afterSubmit id: " + id, "recType: " + recType + " type: " + type);

    // Subsidiary 子公司
    // CN: 4,
    // HK: 2,
    // UK: 3
    try {

        if (type == 'create' || type == 'edit') {
            var subs = nlapiGetFieldValue('subsidiary');
            _log('subs', subs);
            if (subs == 2 || subs == 3) {
                //  var intercotransaction = nlapiGetFieldValue('intercotransaction');
                var intercotransaction = nlapiLookupField('salesorder', id, 'intercotransaction');
                _log('intercotransaction', intercotransaction);
                if (intercotransaction) {	
                    var info = nlapiLookupField('purchaseorder', intercotransaction, [
                        'custbody_magentoordno',
                        'custbody_number',
                        'custbody_customeremail',
                        'custbody_customerphonenumber',
                        'custbody_deliveryaddress',
                        'custbody_customer'
                    ]);

                    var soRec = nlapiLoadRecord('salesorder', nlapiGetRecordId());
                    for (var name in info) {
                        soRec.setFieldValue(name, info[name]);
                    }
                    nlapiSubmitRecord(soRec, true);
                }
            }
        }
    } catch (e) {
        processException(e)
    }

}
