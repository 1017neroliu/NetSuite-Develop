/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       19 Feb 2019     Nero
 *	
 * 采购入库
 * 云合在NS中提供一个批量汇总【配件创建】的页面，用户提交后调用丽晶提供的采购订单接口；丽晶入库后调用云合提供的库存转移接口。
 * 用户选择工单，保存后，调用丽晶采购订单接口，然后丽晶会返回POID，记录下POID，配件创建即工单汇总
 * 
 * 上传过后的工单不能够再上传，目前想法是，在工单上自定义一个字段，记录是否上传成功过，（是否上传成功需要看丽晶返回的信息）
 * 下次筛选工单大货的时候，根据这个判断是否上传过
 */
//	var truthBeTold = window.confirm("确定上传？\r\n单击“确定”继续。单击“取消”停止。")
//	if(truthBeTold){
//		alert('已上传！');
//	}else{
//		alert('see you!');
//	}
/**
 * {"code":401,"body":"{\"flag\":\"0\",\"message\":\"Token为空\",\"data\":null }",
 * "headers":[],
 * "headerNames":["date","server","content-length","cache-control","content-type",
 * "x-aspnet-version","x-powered-by","code","www-authenticate","via"],
 * "error":null,"contentType":null}
 */
function poin(type){
	//丽晶接口地址
	var addPurchaseUrl = "http://116.62.219.119:8089/api/AddPurchase";
	var accessTokenUrl = "http://116.62.219.119:8089/api/AccessToken?AppKey=xuanni01&AppSecret=xuanni01";
	var accessToken = nlapiRequestURL(accessTokenUrl);
//	alert('==============='+JSON.stringify(accessToken));
	//body里面是json字符串
	var jsonstr = accessToken.body;
//	alert(jsonstr);
	//json字符串转json对象
	var ljdata =  eval('(' + jsonstr + ')').data;
//	alert(typeof(ljdata));
	//请求头信息
	var headers = {'Content-Type' : 'application/json',
				   'Authorization' : ljdata};
	var array1 = [];
	var array2 = [];
	var linenum = nlapiGetLineItemCount('custpage_list');
	for (var i = 1; i <= linenum; i++) {
		var select = nlapiGetLineItemValue('custpage_list', 'custpage_select', i);
		//选中的工单上传
		if(select == 'T'){
		var internalid = nlapiGetLineItemValue('custpage_list', 'custpage_internalid', i);
		var Manual_ID = nlapiGetLineItemValue('custpage_list', 'custpage_poid', i);
		var supply_no = nlapiGetLineItemValue('custpage_list', 'custpage_vendorid', i);
		var purch_date = nlapiGetLineItemValue('custpage_list', 'custpage_podate', i);
		var remark = nlapiGetLineItemValue('custpage_list', 'custpage_memo', i);
		var barcode = nlapiGetLineItemValue('custpage_list', 'custpage_barcode', i);
		var warehouse_no = nlapiGetLineItemValue('custpage_list', 'custpage_warehouseid', i);
		var price = nlapiGetLineItemValue('custpage_list', 'custpage_price', i);
		var quantity = nlapiGetLineItemValue('custpage_list', 'custpage_quantity', i);
			//需要传递的数据
		var	purchaseJsonobj = {
			"Manual_ID" : Manual_ID,
			"supply_no" : supply_no,
			"purch_date" : purch_date,
			"remark" : remark,
			"purchaseGoodsList" : [{"barcode" : barcode,
									"warehouse_no" : warehouse_no,
									"price" : price,
									"quantity" : quantity}]};
		var purchaseJsonStr = JSON.stringify(purchaseJsonobj);
				
		alert(JSON.stringify(purchaseJsonobj));
			//调用采购订单接口
			var addPurchase = nlapiRequestURL(addPurchaseUrl, purchaseJsonStr, headers);
			alert(JSON.stringify(addPurchase));
			//获取响应体的body
			var bodystr = addPurchase.body;
			//字符串转json对象
			var flag = eval('(' + bodystr + ')').flag;
			var message = eval('(' + bodystr + ')').message;
			//当响应成功时，将成功的数据放到array1中，并把工单上的是否上传接口的字段勾选中
			if(flag == "1"){
				array1.push(purchaseJsonobj);
				var workorderRec = nlapiLoadRecord('workorder', internalid);
				workorderRec.setFieldValue('custbody_workorder_jk', 'T');//工单上的字段添加好之后，把那个字段的内部id放进去即可
				nlapiSubmitRecord(workorderRec);
			}else{
				
				alert(message);
				array2.push(purchaseJsonobj);
			}
		}
	}
	alert('上传完毕！成功：'+array1.length+'条，失败'+array2.length+'条。');
}
