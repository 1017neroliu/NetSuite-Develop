/**
 * Module Description
 * 
 * Version 		Date 		Author 		Remarks 
 * 	1.00 	17 Oct 2018 	Nero		
 * 
 * VIP资料
 */
// 云合提供NS中新增和更新VIP接口，在NS中只保留VIP资料的查看权限。新增：post，更新：put
	var context = nlapiGetContext();
	var user = context.getName();
	var scriptId = context.getScriptId();
function createVIP(datain) {
	
//	var context = nlapiGetContext();
//	var user = context.getName();
//	var scriptId = context.getScriptId();
	nlapiLogExecution('error', 'datain', JSON.stringify(datain));
		try {
			// 当请求不为空时
			if (datain != null && datain != " ") {
				var vip;
				var responer;
				var jsondata = [];
				
				// 新建vip记录
				var vipRec = nlapiCreateRecord('customrecord81');
				// 给字段设置值
//				var Csearch = nlapiSearchRecord('customer', null,
//						[new nlobjSearchFilter('entityid', null, 'is',datain.customerCode)]);
//				
//				if (Csearch != null) {
//					var customerId2 = Csearch[0].getId();
//				}
				vipRec.setFieldValue('altname', datain.vipName);//vip姓名
				vipRec.setFieldValue('custrecord7', datain.vipGender);//vip性别
				vipRec.setFieldValue('custrecord8', datain.vipPhone);//vip手机号
				vipRec.setFieldValue('custrecordcust_age', datain.vipAge);//vip年龄
				vipRec.setFieldValue('custrecordcust_card_number',datain.vipCardNumber);//vip银行卡号
				vipRec.setFieldValue('custrecordcust_store', datain.customerCode);//vip所属商铺id
				vipRec.setFieldValue('custrecordcust_vip_level',datain.vipLevel);//vip等级
				vipRec.setFieldValue('custrecord_birthday',datain.vipBirthday);//vip生日
				// 提交记录到数据库，返回的是记录的id
				var internalId = nlapiSubmitRecord(vipRec);
				
				var vipName = vipRec.getFieldValue('altname');
				var vipGender = vipRec.getFieldValue('custrecord7');
				var vipPhone = vipRec.getFieldValue('custrecord8');
				var vipAge = vipRec.getFieldValue('custrecordcust_age');
				var vipCardNumber = vipRec.getFieldValue('custrecordcust_card_number');
				var vipStore = vipRec.getFieldValue('custrecordcust_store');
				var vipLevel = vipRec.getFieldValue('custrecordcust_vip_level');
				var vipBirthday = vipRec.getFieldValue('custrecord_birthday');
				if (internalId) { //判断vip记录是否创建成功，并打印日志，返回信息
					vip = {
						"vipName" : vipName,
						"vipGender" : vipGender,
						"vipPhone" : vipPhone,
						"vipAge" : vipAge,
						"vipCardNumber" : vipCardNumber,
						"vipStore" : vipStore,
						"vipLevel" : vipLevel,
						"vipBirthday" : vipBirthday,
						"internalId" : internalId
					}
					jsondata.push(vip);
					var responer = {
						"status" : "success",
						"message" : jsondata
					}

					writeLog('新建vip' + '' + vipName, 
							'vip is created', 
							user,
							scriptId, 
							'OK', 
							JSON.stringify(datain), 
							JSON.stringify(vip));

					return JSON.stringify(responer);

				}
			}
		} catch (e) {
			
			writeLog('新建vip' + '' + datain.vipName, 
					e.message, 
					user,
					scriptId, 
					'ERROR', 
					JSON.stringify(datain));

			return {
				"status" : "failure",
				"message" : "创建vip失败!",
				"reason" : e.message
			};
		}
}
// 修改vip资料
function updateVIP(datain) {
	try {
		//	var context = nlapiGetContext();
		//	var user = context.getName();
		//	var scriptId = context.getScriptId();
		if (datain != null && datain != " " && datain.internalId) {
			var vip;
			var vipRec = nlapiLoadRecord('customrecord81', datain.internalId);
			if (datain.vipName) {
				vipRec.setFieldValue('altname', datain.vipName);
			}
			if (datain.vipGender) {
				vipRec.setFieldValue('custrecord7', datain.vipGender);
			}
			if (datain.vipPhone) {
				vipRec.setFieldValue('custrecord8', datain.vipPhone);
			}
			if (datain.vipAge) {
				vipRec.setFieldValue('custrecordcust_age', datain.vipAge);
			}
			if (datain.vipCardNumber) {
				vipRec.setFieldValue('custrecordcust_card_number',
						datain.vipCardNumber);
			}
			if (datain.customerCode) {
//				var Csearch = nlapiSearchRecord('customer', null,
//						[new nlobjSearchFilter('entityid', null, 'is',datain.customerCode)]);
//				
//				if (Csearch != null) {
//					var customerId2 = Csearch[0].getId();
//				}
				vipRec.setFieldValue('custrecordcust_store', datain.customerCode);
			}
			if (datain.vipLevel) {
				vipRec.setFieldValue('custrecordcust_vip_level',datain.vipLevel);
			}
			if (datain.vipBirthday) {
				vipRec.setFieldValue('custrecord_birthday',datain.vipBirthday);
			}
			var id = nlapiSubmitRecord(vipRec);

			var vipName = vipRec.getFieldValue('altname');
			var vipGender = vipRec.getFieldValue('custrecord7');
			var vipPhone = vipRec.getFieldValue('custrecord8');
			var vipAge = vipRec.getFieldValue('custrecordcust_age');
			var vipCardNumber = vipRec.getFieldValue('custrecordcust_card_number');
			var vipStore = vipRec.getFieldValue('custrecordcust_store');
			var vipLevel = vipRec.getFieldValue('custrecordcust_vip_level');
			var vipBirthday = vipRec.getFieldValue('custrecord_birthday');

			if (id) {
				vip = {
					"vipName" : vipName,
					"vipGender" : vipGender,
					"vipPhone" : vipPhone,
					"vipAge" : vipAge,
					"vipCardNumber" : vipCardNumber,
					"vipStore" : vipStore,
					"vipLevel" : vipLevel,
					"vipBirthday" : vipBirthday
				}

				writeLog('更新vip' + '' + vipName, 
						'vip is created', 
						user,
						scriptId, 
						'OK', 
						JSON.stringify(datain), 
						JSON.stringify(vip));

				return {
					"status" : "success",
					"message" : "更新vip信息成功！"
				};
			}
		}
	} catch (e) {
		
		writeLog('更新vip' + '' + datain.vipName, 
				e.message, 
				user,
				scriptId, 
				'ERROR', 
				JSON.stringify(datain));

		return {
			"status" : "failure",
			"message" : "更新vip信息失败!",
			"reason" : e.message
		};
	}
}
