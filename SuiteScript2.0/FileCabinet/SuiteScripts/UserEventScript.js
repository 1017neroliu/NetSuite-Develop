/** 
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 */
// Load two standard modules.
define([ 'N/record', 'N/ui/serverWidget' ],

// Add the callback function.

function(record, serverWidget) {

	// In the beforeLoad function, disable the Notes field.

	function myBeforeLoad(context) {

		if (context.type !== context.UserEventType.CREATE)
			return;

		var form = context.form;

		var notesField = form.getField({
			id : 'comments'
		});

		notesField.updateDisplayType({
			displayType : serverWidget.FieldDisplayType.DISABLED
		});
	}

	// In the beforeSubmit function, add test to the Notes field.

	function myBeforeSubmit(context) {

		if (context.type !== context.UserEventType.CREATE)
			return;

		var newEmployeeRecord = context.newRecord;

		newEmployeeRecord.setValue({
			fieldId : 'comments',
			value : 'Orientation date TBD.'
		});

	}
	// In the afterSubmit function, begin creating a task record.

	function myAfterSubmit(context) {

		if (context.type !== context.UserEventType.CREATE)
			return;

		var newEmployeeRecord = context.newRecord;

		var newEmployeeFirstName = newEmployeeRecord.getValue({
			fieldId : 'firstname'
		});

		var newEmployeeLastName = newEmployeeRecord.getValue({
			fieldId : 'lastname'
		});

		var newEmployeeSupervisor = newEmployeeRecord.getValue({
			fieldId : 'supervisor'
		});

		if (newEmployeeSupervisor) {

			var newTask = record.create({
				type : record.Type.TASK,
				isDynamic : true
			});

			newTask.setValue({
				fieldId : 'title',
				value : 'Schedule orientation session for '
						+ newEmployeeFirstName + ' ' + newEmployeeLastName
			});

			newTask.setValue({
				fieldId : 'assigned',
				value : newEmployeeSupervisor
			});

			try {

				var newTaskId = newTask.save();

				log.debug({
					title : 'Task record created successfully',
					details : 'New task record ID:  ' + newTaskId
				});

			} catch (e) {
				log.error({
					title : e.name,
					details : e.message
				});
			}
		}
	}

	// Add the return statement that identifies the entry point funtions.

	return {
		beforeLoad : myBeforeLoad,
		beforeSubmit : myBeforeSubmit,
		afterSubmit : myAfterSubmit
	};
});