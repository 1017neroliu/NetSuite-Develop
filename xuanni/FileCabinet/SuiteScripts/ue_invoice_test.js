/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       26 Mar 2019     Nero
 *	测试脚本
 */

function userEventAfterSubmit(type){
	var search = nlapiLoadSearch(null, 'customsearch_mass_update_item');
	var searchResults = search.runSearch();
	var resultIndex = 0;
	var resultStep = 1000;
	var result;
	var recType = 'assemblyitem';
	// 超过1000条的更新，每1000条1000条的更新
	do {
		result = searchResults.getResults(resultIndex, resultStep);
		resultIndex = resultIndex + resultStep;
		var searchLength = result.length;
		nlapiLogExecution('error', 'search长度', searchLength);

		if (result != null && searchLength > 0) {
			for (var i = 0; i < searchLength; i++) {
//				var cols = result[i].getAllColumns();
				var recId = result[i].getId();
				nlapiLogExecution('error', 'recId', recId);
				var record = nlapiLoadRecord(recType, recId);
				var number = record.getFieldValue('itemid');
				nlapiLogExecution('error', 'number', number);

//				if (number && number.length >= 9) {
//					var sign = record.getFieldValue('custitem_item_upload');
//					var goods_no = record.getFieldText('parent');// 货号
//					if (number[0] == '3' && goods_no != null && sign == 'F') {
//						// 截取前9位
//						number = number.substring(0, 9);
//						var str = number.charAt(number.length - 1);// 获取最后一个字符
//						var p = /[0-9]/;
//						var b = p.test(str);// 判断str是否是数字
//						// 货品为大货才执行以下操作
//						if (b == true && number.length == 9) {
//
//							var colorId = record.getFieldValue('custitem7');// 颜色id
//							var color = record.getFieldText('custitem7');// 颜色名称
//							// var goods_no = nlapiGetFieldText('parent');//货号
//							var goods_name = record.getFieldText('custitem11');// 货品名称
//							var brand = 'soirdolce';// 品牌
//							var category = record.getFieldText('class');// 类别
//							var range = record.getFieldText('custitem9');// 系列
//							// var pattern =
//							// nlapiGetFieldValue('custitem11');//款型取什么？？？？
//							var year = record.getFieldText('custitem2');// 年份
//							var season = record.getFieldText('custitem3');// 季节
//							// var sex =
//							// nlapiGetFieldValue('custitem11');//性别取什么？？？？
//							var size_class = "成人";// 尺码类别
//							var unitPrice = record.getFieldText('custitem15');// 吊牌价
//							var goodsRemark = record
//									.getFieldText('description');// 货品备注
//
//							var colorCode = record.getFieldValue('custitem7');// 颜色id
//							var sizeCode = record.getFieldText('custitem8');// 尺码
//							var longId = '0';// 内长默认值是‘0’
//							var barcode = record.getFieldText('itemid');// 条形码
//							var matrixmachobj = [];
//							matrixmachobj.push({
//								"colorCode" : colorCode,
//								"sizeCode" : sizeCode,
//								"longId" : longId,
//								"barcode" : barcode
//							})
//
//							var addGoodsUrl = "http://116.62.219.119:8089/api/AddEditGoods";
//							var accessTokenUrl = "http://116.62.219.119:8089/api/AccessToken?AppKey=xuanni01&AppSecret=xuanni01";
//							// =====================================调用添加货品接口==========================================================
//							var accessToken = nlapiRequestURL(accessTokenUrl);
//							// body里面是json字符串
//							var jsonstr = accessToken.body;
//							var ljdata = eval('(' + jsonstr + ')').data;
//
//							// 请求头信息
//							var headers = {
//								'Content-Type' : 'application/json',
//								'Authorization' : ljdata
//							};
//
//							var goodJsonobj = {
//								"goods_no" : goods_no,
//								"goods_name" : goods_name,
//								"brand" : brand,
//								"category" : category,
//								"range" : range,
//								"year" : year,
//								"season" : season,
//								"size_class" : size_class,
//								"unitPrice" : unitPrice,
//								"goodsRemark" : goodsRemark,
//								"barcodes" : matrixmachobj
//							}
//
//							var goodJsonStr = JSON.stringify(goodJsonobj);
//							nlapiLogExecution('error', 'goodJsonStr',
//									goodJsonStr);
//							var addGood = nlapiRequestURL(addGoodsUrl,
//									goodJsonStr, headers);
//							var bodystr = addGood.getBody();
//							nlapiLogExecution('error', 'bodystr', bodystr);
//							// eval('(' + bodystr + ')')====
//							// 将bodystrjson字符串转成json对象
//							var flag = eval('(' + bodystr + ')').flag;
//							var message = eval('(' + bodystr + ')').message;
//							nlapiLogExecution('error', 'flag', flag);
//							if (flag == '1') {
//								// 在item单据上记录该货品是否上传成功接口
//								var itemRec = nlapiLoadRecord(recType, recId);
//								itemRec.setFieldValue('custitem_item_upload',
//										'T');
//								nlapiSubmitRecord(itemRec);
//								writeLog('上传货品资料', message, user, scriptId,
//										'OK', goodJsonStr, bodystr);
//							} else {
//								writeLog('上传货品资料', message, user, scriptId,
//										'ERROR', goodJsonStr, bodystr);
//							}
//						}
//					}
//				}
			}
		}
	} while (result != null && result.length > 0);
}
