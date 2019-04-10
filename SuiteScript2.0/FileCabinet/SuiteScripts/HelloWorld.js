/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
 
define(['N/record'], 
      
    function(record) {
   
        function myAfterSubmit(context) {
      
          
            // Create the purchase order. 

            var rec = record.create({
                type: record.Type.PURCHASE_ORDER,
                isDynamic: false
            });

      
            // Set body fields on the purchase order. Replace both of these
            // hardcoded values with valid values from your NetSuite account.

            rec.setValue({
                fieldId: 'entity',
                value: '2'
            });

            rec.setValue({
                fieldId: 'location',
                value: '2'
            });

   
            // Insert a line in the item sublist.
            
            rec.insertLine({
                sublistId: 'item',
                line: 0
            });
            
            
            // Set the required fields on the line. Replace the hardcoded value
            // for the item field with a valid value from your NetSuite account.

            rec.setSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: 0,
                value: '7'
            });

            rec.setSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                line: 0,
                value: 1
            });


            // Instantiate the subrecord. To use this method, you must 
            // provide the ID of the sublist, the number of the line you want  
            // to interact with, and the ID of the summary field. 

            var subrec = rec.getSublistSubrecord({
                sublistId: 'item',
                line: 0,
                fieldId: 'inventorydetail'
            });


            // Insert a line in the subrecord's inventory assignment sublist.

            subrec.insertLine({
                sublistId: 'inventoryassignment',
                line: 0
            });
            
            subrec.setSublistValue({
                sublistId: 'inventoryassignment',
                fieldId: 'quantity',
                line: 0,
                value: 1
            });


            // Set the lot number for the item. Although this value is
            // hardcoded, you do not have to change it, because it doesn't 
            // reference a record in your account. For the purpose of this 
            // sample, the value can be any string.

            subrec.setSublistValue({
                sublistId: 'inventoryassignment',
                fieldId: 'receiptinventorynumber',
                line: 0,
                value: '01234'
            });

            
            // Save the record. Note that the subrecord object does
            // not have to be explicitly saved.

            try {

                var recId = rec.save();

                log.debug({
                    title: 'Record created successfully',
                    details: 'Id: ' + recId
                });

            } catch (e) {
             
                log.error({
                    title: e.name,
                    details: e.message     
                });
            }
        }
        var x = 3;
        console.log(x);
        
        return {
            afterSubmit: myAfterSubmit
        };
    });            