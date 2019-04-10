function beforeSubmit(type){
	
//	PPS表单内部ID：customrecord227
//	拼接框内部ID：custrecord_specification
	if(type == 'create' || type == 'edit'){
//		var str = '';
//		//判断哪些字段被勾选中并获取选中的对应的字段中的值，然后拼接
//		if(nlapiGetFieldValue('custrecord_display_input_voltage') == 'T'){
//			var value1 = nlapiGetFieldValue('custrecord_input_voltage')+', ';
//			str += value1;
//		}
//		if(nlapiGetFieldValue('custrecord_display_total_wattage') == 'T'){
//			var value2 = nlapiGetFieldValue('custrecord_total_wattage')+', ';
//			str += value2;
//		} 
//		if(nlapiGetFieldValue('custrecord_display_lumen') == 'T'){
//			var value3 = nlapiGetFieldValue('custrecord_lumen')+', ';
//			str += value3;
//		}
//		if(nlapiGetFieldValue('custrecord_display_cct') == 'T'){
//			var value4 = nlapiGetFieldValue('custrecord_cct')+', ';
//			str += value4;
//		}
//		if(nlapiGetFieldValue('custrecord_display_cri') == 'T'){
//			var value5 = nlapiGetFieldValue('custrecord_cri')+', ';
//			str += value5;
//		}
//		if(nlapiGetFieldValue('custrecord_display_safety_class') == 'T'){
//			var value6 = nlapiGetFieldValue('custrecord_safety_class')+', ';
//			str += value6;
//		}
//		if(nlapiGetFieldValue('custrecord_display_ingress_protection') == 'T'){
//			var value7 = nlapiGetFieldValue('custrecord_ingress_protection')+', ';
//			str += value7;
//		}
//		if(nlapiGetFieldValue('custrecord_display_led_chip') == 'T'){
//			var value8 = nlapiGetFieldValue('custrecord_led_chip')+', ';
//			str += value8;
//		}
//		if(nlapiGetFieldValue('custrecord_display_led_driver') == 'T'){
//			var value9 = nlapiGetFieldValue('custrecord_led_driver')+', ';
//			str += value9;
//		}
//		if(nlapiGetFieldValue('custrecord_display_led_converter') == 'T'){
//			var value10 = nlapiGetFieldValue('custrecord_led_converter')+', ';
//			str += value10;
//		}
//		if(nlapiGetFieldValue('custrecord_display_battery') == 'T'){
//			var value11 = nlapiGetFieldValue('custrecord_battery')+', ';
//			str += value11;
//		}
//		if(nlapiGetFieldValue('custrecord_display_beam_angle') == 'T'){
//			var value12 = nlapiGetFieldValue('custrecord_beam_angle')+', ';
//			str += value12;
//		}
//		if(nlapiGetFieldValue('custrecord_display_macadam') == 'T'){
//			var value13 = nlapiGetFieldValue('custrecord_macadam')+', ';
//			str += value13;
//		}
//		if(nlapiGetFieldValue('custrecord_display_power_factor') == 'T'){
//			var value14 = nlapiGetFieldValue('custrecord_power_factor')+', ';
//			str += value14;
//		}
//		if(nlapiGetFieldValue('custrecord_display_lumen_efficency') == 'T'){
//			var value15 = nlapiGetFieldValue('custrecord_lumen_efficency')+', ';
//			str += value15;
//		}
//		if(nlapiGetFieldValue('custrecord_display_mechanical_impacts') == 'T'){
//			var value16 = nlapiGetFieldValue('custrecord_mechanical_impacts')+', ';
//			str += value16;
//		}
//		if(nlapiGetFieldValue('custrecord_display_housing_material') == 'T'){
//			var value17 = nlapiGetFieldValue('custrecord_housing_material')+', ';
//			str += value17;
//		}
//		if(nlapiGetFieldValue('custrecord_display_lgp_material') == 'T'){
//			var value18 = nlapiGetFieldValue('custrecord_lgp_material')+', ';
//			str += value18;
//		}
//		if(nlapiGetFieldValue('custrecord_display_diffuser_material') == 'T'){
//			var value19 = nlapiGetFieldValue('custrecord_diffuser_material')+', ';
//			str += value19;
//		}
//		if(nlapiGetFieldValue('custrecord_display_finishral_color') == 'T'){
//			var value20 = nlapiGetFieldValue('custrecord_finishral_color')+', ';
//			str += value20;
//		}
//		if(nlapiGetFieldValue('custrecord_display_dimension') == 'T'){
//			var value21 = nlapiGetFieldValue('custrecord_dimension')+', ';
//			str += value21;
//		}
//		if(nlapiGetFieldValue('custrecord_display_working_temp') == 'T'){
//			var value22 = nlapiGetFieldValue('custrecord_working_temp')+', ';
//			str += value22;
//		}
//		if(nlapiGetFieldValue('custrecord_display_accessory') == 'T'){
//			var value23 = nlapiGetFieldValue('custrecord_accessory')+', ';
//			str += value23;
//		}
//		if(nlapiGetFieldValue('custrecord_display_selling_feature') == 'T'){
//			var value24 = nlapiGetFieldValue('custrecord_selling_feature')+', ';
//			str += value24;
//		}
//		if(nlapiGetFieldValue('custrecord_display_certification') == 'T'){
//			var value25 = nlapiGetFieldValue('custrecord_certification')+', ';
//			str += value25;
//		}
//		if(nlapiGetFieldValue('custrecord_display_warranty') == 'T'){
//			var value26 = nlapiGetFieldValue('custrecord_warranty')+', ';
//			str += value26;
//		}
//		if(nlapiGetFieldValue('custrecord_display_memo') == 'T'){
//			var value27 = nlapiGetFieldValue('custrecord_memo')+', ';
//			str += value27;
//		}
//		//将最后一个分隔符去掉
//		str = str.substring(0, str.lastIndexOf(', '));
//		//点击save后将选中的字段的值按照上下左右顺序在custrecord_specification中拼接
//		nlapiSetFieldValue('custrecord_specification', str);
//	}
	
	//创建字典，在字典中取值
	var dic = {
			'custrecord_display_input_voltage':nlapiGetFieldValue('custrecord_input_voltage'),
			'custrecord_display_total_wattage':nlapiGetFieldValue('custrecord_total_wattage'),
			'custrecord_display_lumen':nlapiGetFieldValue('custrecord_lumen')
	}
//	var obj = eval(dictionary);
//	alert(obj[0].name1);
	//定义拼接的字符串
	var str = '';
	//遍历字典中的key
	for (var key in dic) {
		//勾选中的
		if(nlapiGetFieldValue(key) == 'T'){
			str += dic[key]+', ';
//			//将字典中的值获取出来放入数组中
//			var arr = new array();
//			arr.add(dic[key]);
//			//遍历数组进行拼接
//			for (var i = 0; i < arr.length; i++) {
//				str += arr[i]+', ';
//			}
		}
	}
	//如果是最后一个，去掉分隔符
	if(str.length > 0){
		str = str.substring(0, str.length - 1);
	}
	nlapiSetFieldValue('custrecord_specification', str);
	}
}
