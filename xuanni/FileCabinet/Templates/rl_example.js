//Edit | View	7	B类品
//Edit | View	8	C类品
//Edit | View	10	促销品
//Edit | View	1	常规品
//Edit | View	9	报废品
//Edit | View	3	样品
//Edit | View	5	破箱品
function post(datain) {

	nlapiLogExecution('debug', 'datain', JSON.stringify(datain));

	if (datain.orderType == 'OUT') { // 创建出库单
		// 写日志到自定义的日志记录中，关联写日志脚本，writeLog是这个脚本的方法
		writeLog('Restlet datain: ' + datain.orderType, _cutText(JSON
				.stringify(datain)), datain.orders[0].DOID, "收到datain",
				'Restlet', JSON.stringify(datain));

		// Orders 数组总是一个
		var DOTypeID = datain.orders[0].DOTypeID;
		var ourate_items = datain.orders[0].items;

		// writeLog('Restlet Request: ' + datain.orderType, datain.orderType,
		// DOTypeID, 'OK', 'Restlet');

		try {

			if (DOTypeID == 10) { // //10 销售出库 发货
				return out_salesorder(datain, DOTypeID, ourate_items);
			} else if (DOTypeID == 40) { // 40 客户自提 发货 这个API 不会自动的请求NS 接口

			} else if (DOTypeID == 30) { // 30 其他出库 发货

				var DOID = datain.orders[0].DOID;
				DOID = DOID.replace('_OUT', '').trim();

				var search = nlapiSearchRecord('transaction', null,
						[
								new nlobjSearchFilter('mainline', null, 'is',
										'T'),
								new nlobjSearchFilter('internalid', null, 'is',
										DOID) ],
						[ new nlobjSearchColumn('type') ]);

				// console.log(JSON.stringify(search));
				nlapiLogExecution('debug', search[0].getValue('type'),
						search[0].getText('type'));

				if (search[0].getText('type') == '其他出入库申请') {
					// nlapiSubmitField('inventoryadjustment', DOID,
					// 'custbody_ourate_status', 3);
					createInventoryAdjustment(DOID, null, 3, datain.orderType);
					var response_obj = {
						"Items" : [ {
							"DOID" : datain.orders[0].DOID,
							"WmsDOID" : DOID,
							"DOTypeID" : DOTypeID,
							"Result" : 'T',
							"Reason" : ""
						} ]
					};
					writeLog(
							'Restlet End: ' + search[0].getText('type')
									+ ' | 3',
							'inventoryadjustment of customtransactioninventoryio is created',
							DOID, 'OK', 'Restlet', JSON.stringify(datain), JSON
									.stringify(response_obj));
					return response_obj;
				} else {
					var itemfulfillment = nlapiTransformRecord(
							'vendorreturnauthorization', DOID,
							'itemfulfillment');
					itemfulfillment.setFieldValue('shipstatus', 'C');
					createItemInventoryDetail(itemfulfillment, ourate_items);
					var itemfulfillmentId = nlapiSubmitRecord(itemfulfillment,
							true);

					nlapiSubmitField('vendorreturnauthorization', DOID,
							'custbody_ourate_status', 3);

					var response_obj = {
						"Items" : [ {
							"DOID" : datain.orders[0].DOID,
							"WmsDOID" : itemfulfillmentId,
							"DOTypeID" : DOTypeID,
							"Result" : 'T',
							"Reason" : ""
						} ]
					};
					writeLog('Restlet End', 'vendorreturnauthorization', DOID,
							'OK', 'Restlet', JSON.stringify(datain), JSON
									.stringify(response_obj));
					return response_obj;
				}

			} else if (DOTypeID == 20) { // 20 调拨出库 发货
				var DOID = datain.orders[0].DOID;
				DOID = DOID.replace('_OUT', '').trim();

				if (nlapiLookupField('transferorder', DOID, 'status') == 'pendingReceipt') {
					var response_obj = {
						"Items" : [ {
							"DOID" : datain.orders[0].DOID,
							"WmsDOID" : DOID + '_FULFILLED',
							"DOTypeID" : DOTypeID,
							"Result" : 'T',
							"Reason" : ""
						} ]
					};

					nlapiSubmitField('transferorder', DOID, 'custbody_to_out',
							3);
					writeLog('Restlet End', 'transferorder', DOID, 'OK',
							'Restlet', JSON.stringify(datain), JSON
									.stringify(response_obj));
					return response_obj;
				}

				var itemfulfillment = nlapiTransformRecord('transferorder',
						DOID, 'itemfulfillment');
				itemfulfillment.setFieldValue('shipstatus', 'C');
				createItemInventoryDetail(itemfulfillment, ourate_items);
				var itemfulfillmentId = nlapiSubmitRecord(itemfulfillment, true);

				nlapiSubmitField('transferorder', DOID, 'custbody_to_out', 3);

				var response_obj = {
					"Items" : [ {
						"DOID" : datain.orders[0].DOID,
						"WmsDOID" : itemfulfillmentId,
						"DOTypeID" : DOTypeID,
						"Result" : 'T',
						"Reason" : ""
					} ]
				};
				writeLog('Restlet End', 'transferorder', DOID, 'OK', 'Restlet',
						JSON.stringify(datain), JSON.stringify(response_obj));
				return response_obj;
			}

			writeLog('Restlet Exception', '', DOID, 'ERROR', 'Restlet');
			return {
				"Items" : [ {
					"DOID" : datain.orders[0].DOID,
					"WmsDOID" : '',
					"DOTypeID" : DOTypeID,
					"Result" : 'F',
					"Reason" : "没有DOTypeID控制的逻辑 | " + 'DOTypeID: ' + DOTypeID
				} ]
			};

		} catch (e) {

			e = processException(e);

			var response_obj = {
				"Items" : [ {
					"DOID" : datain.orders[0].DOID,
					"WmsDOID" : '',
					"DOTypeID" : DOTypeID,
					"Result" : 'F',
					"Reason" : e.userMessage + ' | orderType: '
							+ datain.orderType
				} ]
			};

			writeLog('Restlet Exception - OUT', e.code, DOID,
					_cutText(e.message),
					_cutText(JSON.stringify(response_obj)), JSON
							.stringify(datain), e.message);

			return response_obj;
		}

	}

	else if (datain.orderType == 'IN') { // 创建入库单

		var transaction = datain.items[0];
		var ourate_items = datain.items;
		var DOID = datain.items[0].POID;

		writeLog('Restlet datain: ' + datain.orderType, _cutText(JSON
				.stringify(datain)), DOID, "收到datain", 'Restlet', JSON
				.stringify(datain));

		try {

			if (transaction.POTypeID == 'Return') {

				var reload = false;
				var returnauthorization = nlapiLoadRecord(
						'returnauthorization', DOID);
				var orderstatus = returnauthorization
						.getFieldValue('orderstatus');
				if (orderstatus == 'B' || orderstatus == 'D'
						|| orderstatus == 'E') {
					var itemreceiptId = createItemReceipt(
							'returnauthorization', DOID, ourate_items,
							nlapiLookupField('returnauthorization', DOID,
									'location'), datain);
					reload = true;
				} else {
					var irSearch = nlapiSearchRecord('itemreceipt', null,
							[
									new nlobjSearchFilter('createdfrom', null,
											'is', DOID),
									new nlobjSearchFilter('mainline', null,
											'is', 'T') ]);
					if (irSearch != null) {
						//map() 方法返回一个由原数组中的每个元素调用一个指定方法后的返回值组成的新数组，其中function(sr) {}是一个回调函数
						//map() 基本用法跟forEach方法类似
						var itemreceiptId = irSearch.map(function(sr) {//sr代表irSearch中的每一个元素
							return sr.getId();
						}).join('-');
					} else {
						throw nlapiCreateError('Return_IN_ERROR',
								'Return入库有问题.' + DOID);
					}
				}
				if (reload === true) {
					returnauthorization = nlapiLoadRecord(
							'returnauthorization', DOID);
				}
				orderstatus = returnauthorization.getFieldValue('orderstatus');
				if (orderstatus == 'F' || orderstatus == 'G') {
					returnauthorization.setFieldValue('custbody_ourate_status',
							6);
					nlapiSubmitRecord(returnauthorization);
				}

				var response_obj = {
					"Items" : [ {
						"POID" : transaction.POID,
						"WmsPOID" : itemreceiptId,
						"Result" : "T",
						"Reason" : ""
					} ]
				};

				writeLog('Restlet End', 'returnauthorization', DOID, 'OK for '
						+ itemreceiptId, 'Restlet', JSON.stringify(datain),
						JSON.stringify(response_obj));

				return response_obj;
			}

			else if (transaction.POTypeID == 'PO') {

				var reload = false;
				var purchaseorder = nlapiLoadRecord('purchaseorder', DOID);
				var orderstatus = purchaseorder.getFieldValue('orderstatus');
				if (orderstatus == 'B' || orderstatus == 'D'
						|| orderstatus == 'E') {
					var itemreceiptId = createItemReceipt('purchaseorder',
							DOID, ourate_items, purchaseorder
									.getFieldValue('location'), datain);
					reload = true;
				} else {
					var irSearch = nlapiSearchRecord('itemreceipt', null,
							[
									new nlobjSearchFilter('createdfrom', null,
											'is', DOID),
									new nlobjSearchFilter('mainline', null,
											'is', 'T') ]);
					if (irSearch != null) {
						var itemreceiptId = irSearch.map(function(sr) {
							return sr.getId();
						}).join('-');
					} else {
						throw nlapiCreateError('PO_IN_ERROR', 'PO入库有问题.' + DOID);
					}
				}

				if (reload === true) {
					purchaseorder = nlapiLoadRecord('purchaseorder', DOID);
				}

				orderstatus = purchaseorder.getFieldValue('orderstatus');
				if (orderstatus == 'F' || orderstatus == 'G') {
					purchaseorder.setFieldValue('custbody_ourate_status', 6);
					nlapiSubmitRecord(purchaseorder);

				}

				var response_obj = {
					"Items" : [ {
						"POID" : transaction.POID,
						"WmsPOID" : itemreceiptId,
						"Result" : "T",
						"Reason" : ""
					} ]
				};
				writeLog('Restlet End', 'purchaseorder', DOID, 'OK for '
						+ itemreceiptId, 'Restlet', JSON.stringify(datain),
						JSON.stringify(response_obj));
				return response_obj;
			}

			else if (transaction.POTypeID == 'Other') {
				// DOID = DOID.replace('_IN', '');
				// nlapiSubmitField('inventoryadjustment', DOID,
				// 'custbody_to_in', 6);
				createInventoryAdjustment(DOID, ourate_items, 6);

				var response_obj = {
					"Items" : [ {
						"POID" : transaction.POID,
						"WmsPOID" : DOID,
						"Result" : "T",
						"Reason" : ""
					} ]
				};
				writeLog('Restlet End',
						'inventoryadjustment and otheradjustment', DOID, 'OK',
						'Restlet', JSON.stringify(datain), JSON
								.stringify(response_obj));
				return response_obj;
			}

			else if (transaction.POTypeID == 'TR'
					|| transaction.POTypeID == 'IN_PURCHASE') {
				var DOID = datain.items[0].POID;
				DOID = DOID.replace('_IN', '');

				var reload = false;
				var transferorder = nlapiLoadRecord('transferorder', DOID);
				var orderstatus = transferorder.getFieldValue('orderstatus');
				if (orderstatus == 'E' || orderstatus == 'F') {
					var itemreceiptId = createItemReceipt('transferorder',
							DOID, ourate_items, nlapiLookupField(
									'transferorder', DOID, 'transferlocation'),
							datain);
					reload = true;
				} else {
					var irSearch = nlapiSearchRecord('itemreceipt', null,
							[
									new nlobjSearchFilter('createdfrom', null,
											'is', DOID),
									new nlobjSearchFilter('mainline', null,
											'is', 'T') ]);
					if (irSearch != null) {
						//下面的操作做了什么事呢？原search的结果数组映射为一个新的数组，这个数组用"-"分隔
						var itemreceiptId = irSearch.map(function(sr) {//array.map(callback,[ thisObject]);
							return sr.getId();//callback的参数：[].map(function(value, index, array) { // ...});
						}).join('-');//方法作为参数，sr就是search的结果的数组中的每一个元素
					} else {
						throw nlapiCreateError('TR_IN_ERROR', 'TO入库有问题.' + DOID);
					}
				}

				if (reload === true) {
					transferorder = nlapiLoadRecord('transferorder', DOID);
				}
				orderstatus = transferorder.getFieldValue('orderstatus');
				if (orderstatus == 'H' || orderstatus == 'G') {
					transferorder.setFieldValue('custbody_to_in', 6);
					nlapiSubmitRecord(transferorder);

				}

				var response_obj = {
					"Items" : [ {
						"POID" : transaction.POID,
						"WmsPOID" : itemreceiptId,
						"Result" : "T",
						"Reason" : ""
					} ]
				};
				writeLog('Restlet End', 'transferorder', DOID, 'OK', 'Restlet',
						JSON.stringify(datain), JSON.stringify(response_obj));
				return response_obj
			}

		} catch (e) {
			e = processException(e);

			var response_obj = {
				"Items" : [ {
					"POID" : transaction.POID,
					"WmsPOID" : itemreceiptId,
					"Result" : 'F',
					"Reason" : e.userMessage + ' | orderType: '
							+ datain.orderType
				} ]
			};

			writeLog('Restlet Exception - IN', e.code, DOID, 'ERROR',
					'Restlet', JSON.stringify(response_obj), e.message);

			return response_obj;
		}

	} else {
		writeLog('Restlet Exception', 'Unknown error', "", 'ERROR', 'Restlet');
		return {
			"Items" : [ {
				"POID" : "",
				"WmsPOID" : "",
				"Result" : "F",
				"Reason" : "Unknown error as there no order type! Please check!"
			} ]
		};
	}

}

function out_salesorder(datain, DOTypeID, ourate_items) {

	var DOID = datain.orders[0].DOID;

	var orderSearch = nlapiSearchRecord('salesorder', null, [
			new nlobjSearchFilter('internalid', null, 'is', DOID),
			new nlobjSearchFilter('mainline', null, 'is', 'T')
	// new nlobjSearchFilter('status', null, 'anyof', [
	// 'SalesOrd:B' // Pending Fulfillment
	// ]),
	// new nlobjSearchFilter('custbody_ourate_status', null, 'is', 2)
	], [ new nlobjSearchColumn('status'),
			new nlobjSearchColumn('custbody_ourate_status') ]);

	var WmsDOID = '';
	var Result = 'F';
	var Reason = '';

	if (orderSearch != null && orderSearch.length == 1) {

		var soId = orderSearch[0].getId();
		if (orderSearch[0].getValue('status') == 'pendingFulfillment'
				&& orderSearch[0].getValue('custbody_ourate_status') == 2) {

			var itemfulfillment = nlapiTransformRecord('salesorder', soId,
					'itemfulfillment', {
						recordmode : 'dynamic'
					});

			itemfulfillment.setFieldValue('shipstatus', 'C');
			createItemInventoryDetail(itemfulfillment, ourate_items);

			var ffId = nlapiSubmitRecord(itemfulfillment, true);

			WmsDOID = ffId;
			Result = 'T';

			nlapiSubmitField('salesorder', soId, 'custbody_ourate_status', 3);
		} else {
			Reason = 'SO不是 Pending Fulfillment Status 或者 Ourate Status Code 不对！';
		}

	} else {
		Reason = '没找到这个SO， 或者SO的数量多于1';
		_log_email('DOID: ' + DOID, '没找到这个SO， 或者SO的数量多于1');
	}

	var response_obj = {
		"Items" : [ {
			"DOID" : datain.orders[0].DOID,
			"WmsDOID" : WmsDOID,
			"DOTypeID" : DOTypeID,
			"Result" : Result,
			"Reason" : Reason
		} ]
	};
	writeLog('Restlet End', 'salesorder', soId, 'OK', 'Restlet | ' + Reason,
			JSON.stringify(datain), JSON.stringify(response_obj));

	return response_obj;
}

// TODO: 这里没有按照ourate 实际的出库数量来做IA 调整 ， 一般不会有问题， 比较麻烦 等以后调整
function createInventoryAdjustment(otherAdjustmentId, ourate_items,
		ourateStatusCode, orderType) {

	var customtransactioninventoryio = nlapiLoadRecord(
			'customtransactioninventoryio', otherAdjustmentId);
	var readyStatus;
	if (ourateStatusCode == 3) {
		readyStatus = 2
	} else if (ourateStatusCode == 6) {
		readyStatus = 5
	}
	nlapiLogExecution('debug', 'readyStatus', readyStatus);
	if (customtransactioninventoryio.getFieldValue('custbody_ourate_status') == readyStatus) {

		var custbody_inventory_adjustment_category = customtransactioninventoryio
				.getFieldValue('custbody_inventory_adjustment_category');
		var formLinked = nlapiLookupField(
				'customrecord_inventory_adjustment_catego',
				custbody_inventory_adjustment_category,
				'custrecord_form_linked');

		var location = customtransactioninventoryio.getFieldValue('location');

		var inventoryadjustment = nlapiCreateRecord('inventoryadjustment', {
			recordmode : 'dynamic'
		});
		// inventoryadjustment.setFieldValue('customform', '537');
		inventoryadjustment.setFieldValue('subsidiary',
				customtransactioninventoryio.getFieldValue('subsidiary'));
		inventoryadjustment.setFieldValue('account', 472); // Inventory
		// Adjustments
		inventoryadjustment.setFieldValue('adjlocation', location);

		var count_commit = 0;
		var linecount = customtransactioninventoryio.getLineItemCount('line');
		for (var linenum = 1; linenum <= linecount; linenum++) {

			var custcol_item = customtransactioninventoryio.getLineItemValue(
					'line', 'custcol_item', linenum);
			var adjustqtyby = customtransactioninventoryio.getLineItemValue(
					'line', 'custcol_quantity', linenum);
			adjustqtyby = Math.abs(adjustqtyby);
			// adjustqtyby = parseFloat(adjustqtyby);

			if (formLinked == 125) { // 出库
				adjustqtyby = 0 - adjustqtyby;
			} else if (formLinked == 129) { // 入库
				// ...
			} else {
				throw nlapiCreateError('NO_FORM_LINKED',
						custbody_inventory_adjustment_category
								+ ' is no form linked for the category.');
			}

			// 每个Inventory 行的设置
			inventoryadjustment.selectNewLineItem('inventory');
			inventoryadjustment.setCurrentLineItemValue('inventory', 'item',
					custcol_item);
			inventoryadjustment.setCurrentLineItemValue('inventory',
					'location', location);

			// var bin = nlapiSearchRecord('bin', null, [
			// new nlobjSearchFilter('location', null, 'is',
			// otheradjustment.getLineItemValue('line',
			// 'custcol_adjust_item_location', linenum)),
			// new nlobjSearchFilter('custrecord_item_grade', null, 'is',
			// ourate_item.proBatchID) // :
			// ])[0].getId();
			var bin = customtransactioninventoryio.getLineItemValue('line',
					'custcol_bin_ns', linenum);

			inventoryadjustment.setCurrentLineItemValue('inventory',
					'custcol_bin_ns', bin);
			inventoryadjustment.setCurrentLineItemValue('inventory',
					'adjustqtyby', adjustqtyby);

			var inventorydetail = inventoryadjustment
					.createCurrentLineItemSubrecord('inventory',
							'inventorydetail');
			inventorydetail.selectNewLineItem('inventoryassignment');
			inventorydetail.setCurrentLineItemValue('inventoryassignment',
					'quantity', adjustqtyby);
			inventorydetail.setCurrentLineItemValue('inventoryassignment',
					'binnumber', bin);
			inventorydetail.commitLineItem('inventoryassignment');
			inventorydetail.commit();

			inventoryadjustment.commitLineItem('inventory');

			count_commit++;
		}

		inventoryadjustment.setFieldValue('custbody_danju_linked',
				customtransactioninventoryio.getId());
		inventoryadjustment.setFieldValue('custbody_wms_system',
				customtransactioninventoryio
						.getFieldValue('custbody_wms_system'));

		// if (count_commit > 0) {
		//
		// }

		var inventoryadjustmentId = nlapiSubmitRecord(inventoryadjustment, true);
		customtransactioninventoryio.setFieldValue('custbody_ourate_status',
				ourateStatusCode);
		customtransactioninventoryio.setFieldValue('custbody_danju_linked',
				inventoryadjustmentId);
		nlapiSubmitRecord(customtransactioninventoryio);

		return inventoryadjustmentId;

	}

	return null;

}

// SO 上面 items 不会相同的 item 分布到不同的line
function createItemInventoryDetail(fulfillment, ourate_items) {

	nlapiLogExecution('debug', 'ourate_items', JSON.stringify(ourate_items));
	var bin_holding = {};

	var linecount = fulfillment.getLineItemCount('item');
	for (var linenum = 1; linenum <= linecount; linenum++) {

		var item = fulfillment.getLineItemValue('item', 'item', linenum);
		var sku = fulfillment.getLineItemText('item', 'item', linenum);
		var quantity = fulfillment
				.getLineItemValue('item', 'quantity', linenum);

		var ourate_item = ourate_items.find(function(o_item) {
			return o_item.proID == sku;
		});
		nlapiLogExecution('debug', 'ourate_item for location'
				+ fulfillment.getLineItemText('item', 'location', linenum),
				JSON.stringify(ourate_item));

		if (ourate_item) {

			var _quantity = ourate_item.proQty;
			nlapiLogExecution('debug', 'sku: ' + sku, 'fulfill quantity: '
					+ _quantity);

			var location = fulfillment.getLineItemValue('item', 'location',
					linenum);

			var key = location + 'AND' + ourate_item.proBatchID;

			if (bin_holding.hasOwnProperty(key)) {
				var bin = bin_holding[key];
			} else {
				var bin = nlapiSearchRecord('bin', null,
						[
								new nlobjSearchFilter('location', null, 'is',
										location),
								new nlobjSearchFilter('custrecord_item_grade',
										null, 'is', ourate_item.proBatchID) ],
						[ new nlobjSearchColumn('internalid').setSort() ])[0]
						.getId();
				nlapiLogExecution('debug', 'IF quantity bin', bin);
				bin_holding[key] = bin;
			}

			fulfillment.selectLineItem('item', linenum);
			fulfillment.setCurrentLineItemValue('item', 'itemreceive', 'T');
			fulfillment.setCurrentLineItemValue('item', 'quantity', _quantity);
			fulfillment.setCurrentLineItemValue('item',
					'custcol_ourate_api_quantity', _quantity);

			var ifDetail = fulfillment.createCurrentLineItemSubrecord('item',
					'inventorydetail');
			ifDetail.selectNewLineItem('inventoryassignment');
			ifDetail.setCurrentLineItemValue('inventoryassignment',
					'binnumber', bin); // bin number's Internal ID
			ifDetail.setCurrentLineItemValue('inventoryassignment', 'quantity',
					_quantity);
			ifDetail.commitLineItem('inventoryassignment');

			nlapiLogExecution('debug', 'detail count', ifDetail
					.getLineItemCount('inventoryassignment'));
			if (parseInt(ifDetail.getLineItemCount('inventoryassignment'), 10) == 1) {
				ifDetail.commit();
			} else {
				ifDetail.cancel();
			}

			fulfillment.commitLineItem('item');
		} else {
			fulfillment.selectLineItem('item', linenum);
			fulfillment.setCurrentLineItemValue('item', 'itemreceive', 'F');
			fulfillment.commitLineItem('item');
		}

	}
}

// 货品等级
// Edit | View 7 B类品
// Edit | View 8 C类品
// Edit | View 10 促销品
// Edit | View 1 常规品
// Edit | View 16 待检品
// Edit | View 9 报废品
// Edit | View 3 样品
// Edit | View 15 特价品
// Edit | View 5 破箱品

// PO 可能 上面 items 会相同的 item 分布到不同的line
function createItemReceipt(fromType, ns_id, ourate_items, location, datain) {

	var BINNUMBERS = nlapiSearchRecord(
			'bin',
			null,
			null,
			[ new nlobjSearchColumn('internalid').setSort(),
					new nlobjSearchColumn('binnumber'),
					new nlobjSearchColumn('location'),
					new nlobjSearchColumn('custrecord_item_grade') ]).map(
			function(sr) {
				return {
					id : sr.getId(),
					location : sr.getValue('location'),
					grade : sr.getValue('custrecord_item_grade')
				};
			});

	nlapiLogExecution('debug', 'create for ItemReceipt for location', location);

	// : 设置 OUrate反馈的一个唯一ID， 来保证 NS IR 的唯一性
	// 放在ProReMark字段。
	var ourate_ir_id = ourate_items[0].proReMark;
	if (ourate_ir_id) {
		var irSearch = nlapiSearchRecord('itemreceipt', null, [
				new nlobjSearchFilter('createdfrom', null, 'is', ns_id),
				new nlobjSearchFilter('mainline', null, 'is', 'T'),
				new nlobjSearchFilter('custbody_ourate_transaction_id', null,
						'is', ourate_ir_id) ]);
		if (irSearch != null) {
			return irSearch.map(function(sr) {
				return sr.getId();
			}).join('-');
		}
	}

	var itemreceipt = nlapiTransformRecord(fromType, ns_id, 'itemreceipt', {
		recordmode : 'dynamic'
	});

	var commit = 0;

	itemreceipt.setFieldValue('custbody_ourate_transaction_id', ourate_ir_id);

	var linecount = itemreceipt.getLineItemCount('item');

	var bin_holding = {};

	// var ex1 = [], ex2 = [];
	for (var linenum = 1; linenum <= linecount; linenum++) {

		// 默认 都是选择的
		nlapiLogExecution('debug', 'itemreceive line' + linenum, itemreceipt
				.getLineItemValue('item', 'itemreceive', linenum));

		// var item = itemreceipt.getLineItemValue('item', 'item', linenum);
		var sku = itemreceipt.getLineItemText('item', 'item', linenum);
		// var quantity = itemreceipt.getLineItemValue('item', 'quantity',
		// linenum);
		// var itemtype = itemreceipt.getLineItemValue('item', 'itemtype',
		// linenum);
		var custcol_bin_ns = itemreceipt.getLineItemValue('item',
				'custcol_bin_ns', linenum);
		var itemBinGrade = BINNUMBERS.find(function(bin) {
			return bin.id == custcol_bin_ns;
		}).grade;

		nlapiLogExecution('debug', 'sku', sku + ' | itemBinGrade: '
				+ itemBinGrade);
		var ourate_item = ourate_items.filter(function(item) {
			return item.proID == sku && item.proBatchID == itemBinGrade;
		});

		if (ourate_item.length) {

			if (ourate_item.length == 1) {
				var key = location + 'AND' + ourate_item[0].proBatchID;
				if (bin_holding.hasOwnProperty(key)) {
					var bin = bin_holding[key];
				} else {
					var bin = nlapiSearchRecord('bin', null, [
							new nlobjSearchFilter('location', null, 'is',
									location),
							new nlobjSearchFilter('custrecord_item_grade',
									null, 'is', ourate_item[0].proBatchID) ],
							[ new nlobjSearchColumn('internalid').setSort() ])[0]
							.getId();
					nlapiLogExecution('debug', 'bin', bin);
					bin_holding[key] = bin;
				}

				itemreceipt.selectLineItem('item', linenum);
				itemreceipt.setCurrentLineItemValue('item', 'itemreceive', 'T');
				itemreceipt.setCurrentLineItemValue('item', 'quantity',
						ourate_item[0].proQty);

				var ifDetail = itemreceipt.createCurrentLineItemSubrecord(
						'item', 'inventorydetail');
				ifDetail.selectNewLineItem('inventoryassignment');
				ifDetail.setCurrentLineItemValue('inventoryassignment',
						'binnumber', bin);
				ifDetail.setCurrentLineItemValue('inventoryassignment',
						'quantity', ourate_item[0].proQty);
				ifDetail.commitLineItem('inventoryassignment');

				nlapiLogExecution('debug', 'detail count', ifDetail
						.getLineItemCount('inventoryassignment'));
				if (parseInt(ifDetail.getLineItemCount('inventoryassignment'),
						10) == 1) {
					ifDetail.commit();
				} else {
					ifDetail.cancel();
				}

				itemreceipt.commitLineItem('item');
				commit++;

			} else {
				_log_email(fromType + ': ' + ns_id + ': ' + sku + ' 有问题！',
						ns_id);
				throw nlapiCreateError('POOK_ERROR', fromType + ': ' + ns_id
						+ ': ' + sku + ' 有问题！');
			}

		} else {
			itemreceipt.selectLineItem('item', linenum);
			itemreceipt.setCurrentLineItemValue('item', 'itemreceive', 'F');
			itemreceipt.commitLineItem('item');
		}

	}

	// if (ex1.length) {
	// itemreceipt.setFieldValue('custbody_script_memo', _cutText(ex1.join(', ')
	// + ' found N results.'));
	// }

	if (commit > 0) {
		var itemreceiptId = nlapiSubmitRecord(itemreceipt, true);

		return itemreceiptId;
	} else {
		return 'IR_ID'
	}

}