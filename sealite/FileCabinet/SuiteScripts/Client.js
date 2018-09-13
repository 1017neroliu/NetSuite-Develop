function beforeSubmit(type) {

	// PPS表单内部ID：customrecord227
	// 拼接框内部ID：custrecord_specification
	if (type == 'create' || type == 'edit') {
		// 创建字典，在字典中取值
		var dic = {
			'custrecord_display_input_voltage' : nlapiGetFieldValue('custrecord_input_voltage'),
			'custrecord_display_total_wattage' : nlapiGetFieldValue('custrecord_total_wattage'),
			'custrecord_display_lumen' : nlapiGetFieldValue('custrecord_lumen'),
			'custrecord_display_cct' : nlapiGetFieldValue('custrecord_cct'),
			'custrecord_display_cri' : nlapiGetFieldValue('custrecord_cri'),
			'custrecord_display_safety_class' : nlapiGetFieldValue('custrecord_safety_class'),
			'custrecord_display_ingress_protection' : nlapiGetFieldValue('custrecord_ingress_protection'),
			'custrecord_display_led_chip' : nlapiGetFieldValue('custrecord_led_chip'),
			'custrecord_display_led_driver' : nlapiGetFieldValue('custrecord_led_driver'),
			'custrecord_display_led_converter' : nlapiGetFieldValue('custrecord_led_converter'),
			'custrecord_display_battery' : nlapiGetFieldValue('custrecord_battery'),
			'custrecord_display_beam_angle' : nlapiGetFieldValue('custrecord_beam_angle'),
			'custrecord_display_macadam' : nlapiGetFieldValue('custrecord_macadam'),
			'custrecord_display_power_factor' : nlapiGetFieldValue('custrecord_power_factor'),
			'custrecord_display_lumen_efficency' : nlapiGetFieldValue('custrecord_lumen_efficency'),
			'custrecord_display_mechanical_impacts' : nlapiGetFieldValue('custrecord_mechanical_impacts'),
			'custrecord_display_housing_material' : nlapiGetFieldValue('custrecord_housing_material'),
			'custrecord_display_lgp_material' : nlapiGetFieldValue('custrecord_lgp_material'),
			'custrecord_display_diffuser_material' : nlapiGetFieldValue('custrecord_diffuser_material'),
			'custrecord_display_finishral_color' : nlapiGetFieldValue('custrecord_finishral_color'),
			'custrecord_display_dimension' : nlapiGetFieldValue('custrecord_dimension'),
			'custrecord_display_working_temp' : nlapiGetFieldValue('custrecord_working_temp'),
			'custrecord_display_accessory' : nlapiGetFieldValue('custrecord_accessory'),
			'custrecord_display_selling_feature' : nlapiGetFieldValue('custrecord_selling_feature'),
			'custrecord_display_certification' : nlapiGetFieldValue('custrecord_certification'),
			'custrecord_display_warranty' : nlapiGetFieldValue('custrecord_warranty'),
			'custrecord_display_memo' : nlapiGetFieldValue('custrecord_memo')
		}
		// 定义拼接的字符串
		var str = '';
		// 遍历字典中的key
		for ( var key in dic) {
			// 勾选中的
			if (nlapiGetFieldValue(key) == 'T') {
				str += dic[key] + ', ';
			}
		}
		// 如果是最后一个，去掉分隔符
		if (str.length > 0) {
			str = str.substr(0, str.length - 2);
		}
		nlapiLogExecution('debug', 'test', str.length);
		nlapiSetFieldValue('custrecord_specification', str);
	}
}
