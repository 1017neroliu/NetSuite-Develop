/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       19 Feb 2019     Nero
 * 货品资料，更新大货货品资料
 * 大货：衣服里面有样衣和大货，均9位数，3开头。区别是样衣最后一位是字母，大货为数字
 */
String.prototype.endWith=function(endStr){
      var d=this.length-endStr.length;
      return (d>=0&&this.lastIndexOf(endStr)==d)
    }

//获取context
var context = nlapiGetContext();
//获取当前用户名，用于后面写入日志record
var user = context.getName();
//获取当前操作的脚本的id
var scriptId = context.getScriptId();

function addUpdateItem(type){
	nlapiLogExecution('error', 'type', type);
	//判断大货
//	var search = nlapiSearchRecord('item', null, [
//                  new nlobjSearchFilter('itemid', null, 'startswith', 3)]);
//	if(search != null){
//		for (var j = 0; j < search.length; j++) {
//			//获取数字
//			var number = search[j].getValue('itemid');
//			var str = number.charAt(number.length-1);
//			//判断是否以字母结尾，并且长度为9位的字符串
//			if ((str >= 'A' && str <= 'Z' || str >= 'a' && str <= 'z') && number.length == 9) {
//				number = number;
//			     }
//		}
//	}
	if(type == 'create'){
	var itemType = nlapiGetRecordType();
	var itemId = nlapiGetRecordId();
	var number = nlapiGetFieldValue('itemid');
	nlapiLogExecution('error', 'number', number);
	var sign = nlapiGetFieldValue('custitem_item_upload');
	var goods_no = 	nlapiGetFieldText('parent');//货号
	if(number[0] == '3' && goods_no != null && goods_no != "" && sign == 'F'){
	//截取前9位
	number = number.substring(0, 9);
	var str = number.charAt(number.length-1);//获取最后一个字符
	var p = /[0-9]/;
	var b = p.test(str);//判断str是否是数字
	//货品为大货才执行以下操作
	if(b == true && number.length == 9){
	
	var colorId = nlapiGetFieldValue('custitem7');//颜色id
	var color = nlapiGetFieldText('custitem7');//颜色名称
//	var goods_no = 	nlapiGetFieldText('parent');//货号
	var goods_name = nlapiGetFieldText('custitem11');//货品名称
	var brand = 'soirdolce';//品牌
	var category = nlapiGetFieldText('class');//类别
	var range = nlapiGetFieldText('custitem9');//系列
//	var pattern = nlapiGetFieldValue('custitem11');//款型取什么？？？？
	var year = nlapiGetFieldText('custitem2');//年份
	var season = nlapiGetFieldText('custitem3');//季节
//	var sex = nlapiGetFieldValue('custitem11');//性别取什么？？？？
	var size_class = "成人";//尺码类别
	var unitPrice = nlapiGetFieldValue('custitem15');//吊牌价
	var goodsRemark = nlapiGetFieldValue('description');//货品备注

	var colorCode = nlapiGetFieldValue('custitem7');//颜色id
	var sizeCode = nlapiGetFieldText('custitem8');//尺码
	var longId = '0';//内长默认值是‘0’
	var barcode = nlapiGetFieldValue('itemid');//条形码
	var matrixmachobj = [];
	matrixmachobj.push({"colorCode" : colorCode,
						"sizeCode": sizeCode,
						"longId": longId,
						"barcode": barcode})
	
	var addGoodsUrl = "http://116.62.219.119:8089/api/AddEditGoods";
	var accessTokenUrl = "http://116.62.219.119:8089/api/AccessToken?AppKey=xuanni01&AppSecret=xuanni01";
//=====================================调用添加货品接口==========================================================	
	var accessToken = nlapiRequestURL(accessTokenUrl);
	//body里面是json字符串
	var jsonstr = accessToken.body;
	var ljdata =  eval('(' + jsonstr + ')').data;
	
	//请求头信息
	var headers = {'Content-Type' : 'application/json',
				   'Authorization' : ljdata};
	
	var goodJsonobj = {
			"goods_no" : goods_no,
			"goods_name" : goods_name,
			"brand" : brand,
			"category" : category,
			"range" : range,
			"year" : year,
			"season" : season,
			"size_class" : size_class,
			"unitPrice" : unitPrice,
			"goodsRemark" : goodsRemark,
			"barcodes" : matrixmachobj
	}
	
	var goodJsonStr = JSON.stringify(goodJsonobj);
	nlapiLogExecution('error', 'goodJsonStr', goodJsonStr);
	var addGood = nlapiRequestURL(addGoodsUrl, goodJsonStr, headers);
	var bodystr = addGood.getBody();
	nlapiLogExecution('error', 'bodystr', bodystr);
	//eval('(' + bodystr + ')')==== 将bodystrjson字符串转成json对象
	var flag = eval('(' + bodystr + ')').flag;
	var message = eval('(' + bodystr + ')').message;
	nlapiLogExecution('error', 'flag', flag);
	if(flag == '1'){
		//在item单据上记录该货品是否上传成功接口
		var itemRec = nlapiLoadRecord(itemType, itemId);
		itemRec.setFieldValue('custitem_item_upload', 'T');
		nlapiSubmitRecord(itemRec);
		writeLog('上传货品资料', 
				message, 
				user, 
				scriptId, 
				'OK', 
				goodJsonStr, 
				bodystr);
		}else{
			writeLog('上传货品资料', 
					message, 
					user, 
					scriptId, 
					'ERROR', 
					goodJsonStr, 
					bodystr);
				}
			}
		}
	}
	if(type == 'edit'){
		var itemType = nlapiGetRecordType();
		var itemId = nlapiGetRecordId();
		var number = nlapiGetFieldValue('itemid');
		nlapiLogExecution('error', 'number', number);
//		var sign = nlapiGetFieldValue('custitem_item_upload');
		var goods_no = 	nlapiGetFieldText('parent');//货号
		if(number[0] == '3' && goods_no != null && goods_no != ""){
		//截取前9位
		number = number.substring(0, 9);
		var str = number.charAt(number.length-1);//获取最后一个字符
		var p = /[0-9]/;
		var b = p.test(str);//判断str是否是数字
		//货品为大货才执行以下操作
		if(b == true && number.length == 9){
		
		var colorId = nlapiGetFieldValue('custitem7');//颜色id
		var color = nlapiGetFieldText('custitem7');//颜色名称
//		var goods_no = 	nlapiGetFieldText('parent');//货号
		var goods_name = nlapiGetFieldText('custitem11');//货品名称
		var brand = 'soirdolce';//品牌
		var category = nlapiGetFieldText('class');//类别
		var range = nlapiGetFieldText('custitem9');//系列
//		var pattern = nlapiGetFieldValue('custitem11');//款型取什么？？？？
		var year = nlapiGetFieldText('custitem2');//年份
		var season = nlapiGetFieldText('custitem3');//季节
//		var sex = nlapiGetFieldValue('custitem11');//性别取什么？？？？
		var size_class = "成人";//尺码类别
		var unitPrice = nlapiGetFieldValue('custitem15');//吊牌价
		var goodsRemark = nlapiGetFieldValue('description');//货品备注

		var colorCode = nlapiGetFieldValue('custitem7');//颜色id
		var sizeCode = nlapiGetFieldText('custitem8');//尺码
		var longId = '0';//内长默认值是‘0’
		var barcode = nlapiGetFieldValue('itemid');//条形码
		var matrixmachobj = [];
		matrixmachobj.push({"colorCode" : colorCode,
							"sizeCode": sizeCode,
							"longId": longId,
							"barcode": barcode})
		
		var addGoodsUrl = "http://116.62.219.119:8089/api/AddEditGoods";
		var accessTokenUrl = "http://116.62.219.119:8089/api/AccessToken?AppKey=xuanni01&AppSecret=xuanni01";
	//=====================================调用添加货品接口==========================================================	
		var accessToken = nlapiRequestURL(accessTokenUrl);
		//body里面是json字符串
		var jsonstr = accessToken.body;
		var ljdata =  eval('(' + jsonstr + ')').data;
		
		//请求头信息
		var headers = {'Content-Type' : 'application/json',
					   'Authorization' : ljdata};
		
		var goodJsonobj = {
				"goods_no" : goods_no,
				"goods_name" : goods_name,
				"brand" : brand,
				"category" : category,
				"range" : range,
				"year" : year,
				"season" : season,
				"size_class" : size_class,
				"unitPrice" : unitPrice,
				"goodsRemark" : goodsRemark,
				"barcodes" : matrixmachobj
		}
		
		var goodJsonStr = JSON.stringify(goodJsonobj);
		nlapiLogExecution('error', 'goodJsonStr', goodJsonStr);
		var addGood = nlapiRequestURL(addGoodsUrl, goodJsonStr, headers);
		var bodystr = addGood.getBody();
		nlapiLogExecution('error', 'bodystr', bodystr);
		//eval('(' + bodystr + ')')==== 将bodystrjson字符串转成json对象
		var flag = eval('(' + bodystr + ')').flag;
		var message = eval('(' + bodystr + ')').message;
		nlapiLogExecution('error', 'flag', flag);
		if(flag == '1'){
			//在item单据上记录该货品是否上传成功接口
			var itemRec = nlapiLoadRecord(itemType, itemId);
			itemRec.setFieldValue('custitem_item_upload', 'T');
			nlapiSubmitRecord(itemRec);
			writeLog('上传货品资料', 
					message, 
					user, 
					scriptId, 
					'OK', 
					goodJsonStr, 
					bodystr);
			}else{
				writeLog('上传货品资料', 
						message, 
						user, 
						scriptId, 
						'ERROR', 
						goodJsonStr, 
						bodystr);
					}
				}
			}
	}
}
