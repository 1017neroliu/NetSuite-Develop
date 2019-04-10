/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       18 Oct 2018     Nero
 *	
 */

/**
 * www.wix.com对接，通过NS一个定时脚本，每天定时将货品名，货品图片，客户（店铺），库存数量，销售发票，收款
 * 字段上传到wix网站上。
 * 
 * 使用nlapiRequestURL()方法调用接口？
 * 
 */
function credentials() {
	this.email = "nero.liu@tctchina.com.cn";
	this.account = "4804951";
	this.role = "3";
	this.password = "18856152017";
}

function replacer(key, value) {
	if (typeof value == "number" && !isFinite(value)) {
		return String(value);
	}
	return value;
}

//Setting up URL              
var url = "https://4804951.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=114&deploy=1";

//Calling credential function
var cred = new credentials();

//Setting up Headers 
var headers = {
	"User-Agent-x" : "SuiteScript-Call",
	"Authorization" : "NLAuth nlauth_account=" + cred.account
			+ ", nlauth_email=" + cred.email + ", nlauth_signature= "
			+ cred.password + ", nlauth_role=" + cred.role,
	"Content-Type" : "application/json"
};

//Setting up Datainput
var jsonobj = {
	"recordtype" : "customer",
	"entityid" : "John Doe",
	"companyname" : "ABC Company",
	"subsidiary" : "1",
	"email" : "jdoe@email.com"
}

//Stringifying JSON
/**
 * JSON.stringify() 方法是将一个JavaScript值(对象或者数组)转换为一个JSON字符串，
 * 如果指定了replacer是一个函数，则可以替换值，或者如果指定了replacer是一个数组，可选的仅包括指定的属性。
 */
var myJSONText = JSON.stringify(jsonobj, replacer);

var response = nlapiRequestURL(url, myJSONText, headers);

//Below is being used to put a breakpoint in the debugger
var i = 0;

//**************RESTLET Code****************

// Create a standard NetSuite record
function createRecord(datain) {
	var err = new Object();

	// Validate if mandatory record type is set in the request
	if (!datain.recordtype) {
		err.status = "failed";
		err.message = "missing recordtype";
		return err;
	}

	var record = nlapiCreateRecord(datain.recordtype);

	for ( var fieldname in datain) {//遍历拿到的数据，如果某个字段存在这个请求中
		if (datain.hasOwnProperty(fieldname)) {//hasOwnProperty判断对象是否包含自身属性就是datain中是否包含fieldname
			if (fieldname != 'recordtype' && fieldname != 'id') {
				var value = datain[fieldname];
				if (value && typeof value != 'object') // ignore other type of parameters
				{
					record.setFieldValue(fieldname, value);
				}
			}
		}
	}
	var recordId = nlapiSubmitRecord(record);
	nlapiLogExecution('DEBUG', 'id=' + recordId);

	var nlobj = nlapiLoadRecord(datain.recordtype, recordId);
	return nlobj;
}
