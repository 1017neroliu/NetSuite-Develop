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
	
	// 当请求不为空时
	if (datain != null && datain != " ") {
		var vip;
		var responer;
		var jsondata = [];
		// 新建vip记录
		var vipRec = nlapiCreateRecord('customrecord81');
		// 给字段设置值
		vipRec.setFieldValue('altname', datain.vipName);//vip姓名
		vipRec.setFieldValue('custrecord7', datain.vipGender);//vip性别
		vipRec.setFieldValue('custrecord8', datain.vipPhone);//vip手机号
		vipRec.setFieldValue('custrecordcust_age', datain.vipAge);//vip年龄
		vipRec.setFieldValue('custrecordcust_card_number',datain.vipCardNumber);//vip银行卡号
		vipRec.setFieldValue('custrecordcust_store', datain.vipStore);//vip所属商铺
		vipRec.setFieldValue('custrecordcust_vip_level', datain.vipLevel);//vip等级
		// 提交记录到数据库，返回的是记录的id
		var internalId = nlapiSubmitRecord(vipRec);

		var vipName = vipRec.getFieldValue('altname');
		var vipGender = vipRec.getFieldValue('custrecord7');
		var vipPhone = vipRec.getFieldValue('custrecord8');
		var vipAge = vipRec.getFieldValue('custrecordcust_age');
		var vipCardNumber = vipRec.getFieldValue('custrecordcust_card_number');
		var vipStore = vipRec.getFieldValue('custrecordcust_store');
		var vipLevel = vipRec.getFieldValue('custrecordcust_vip_level');
		if (internalId) {	//判断vip记录是否创建成功，并打印日志，返回信息
			vip = {
				"vipName" : vipName,
				"vipGender" : vipGender,
				"vipPhone" : vipPhone,
				"vipAge" : vipAge,
				"vipCardNumber" : vipCardNumber,
				"vipStore" : vipStore,
				"vipLevel" : vipLevel
			}
			jsondata.push(vip);
			var responer = {
				"status" : "success",
				"message" : jsondata,
				"internalId" : internalId
			}
			
			writeLog('新建vip'+''+vipName,
					'vip is created',
					user,
					scriptId,
					'OK',
					JSON.stringify(datain),
					JSON.stringify(vip));
			
			return JSON.stringify(responer);

		} else {
			return {
				"status" : "failure",
				"message" : "创建vip失败!"
			};
		}
	}
}
// 修改vip资料
function updateVIP(datain) {
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
			if (datain.vipStore) {
				vipRec.setFieldValue('custrecordcust_store', datain.vipStore);
			}
			if (datain.vipLevel) {
				vipRec.setFieldValue('custrecordcust_vip_level',
						datain.vipLevel);
			}

			var id = nlapiSubmitRecord(vipRec);
			
			var vipName = vipRec.getFieldValue('altname');
			var vipGender = vipRec.getFieldValue('custrecord7');
			var vipPhone = vipRec.getFieldValue('custrecord8');
			var vipAge = vipRec.getFieldValue('custrecordcust_age');
			var vipCardNumber = vipRec.getFieldValue('custrecordcust_card_number');
			var vipStore = vipRec.getFieldValue('custrecordcust_store');
			var vipLevel = vipRec.getFieldValue('custrecordcust_vip_level');
			
			if (id) {
				vip = {
						"vipName" : vipName,
						"vipGender" : vipGender,
						"vipPhone" : vipPhone,
						"vipAge" : vipAge,
						"vipCardNumber" : vipCardNumber,
						"vipStore" : vipStore,
						"vipLevel" : vipLevel
					}
				
				writeLog('更新vip'+''+vipName,
						'vip is created',
						user,
						scriptId,
						'OK',
						JSON.stringify(datain),
						JSON.stringify(vip)
						);
				
				return {
					"status" : "success",
					"message" : "更新vip信息成功！"
				};

			} else {
				
				writeLog('更新vip'+''+vipName,
						'vip creation failed',
						user,
						scriptId,
						'OK',
						JSON.stringify(datain)
						);
				
				return {
					"status" : "failure",
					"message" : "更新vip信息失败!"
			};
		}
	}
}
