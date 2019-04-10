/**
 *  SSUtils.js
 */

// : 回头整理下这个文件， 只保留最最通用的，其他的移动到 每个子文件中， 或者New 子文件的Utils
/**this用法：在方法中，谁调用方法this就指向谁，在构造函数中，new谁，this就指向谁，其他情况this就代表window对象**/
if (typeof this.console == 'function' && !window.console) {// browser and this refer to windows object
    //if (!window.console) { // old browser
    window.console = {
        log: function () {
        } // do nothing
    };
}


// 这个会过渡到 var key in Object 里面 and needs Fix
// Ebay XML return object 使用， 有待进一步测试and 完善
//Object.prototype.map = function (fn) {
//    return [this].map(fn);
//};

function parseException(e) {
    var code, message;

    var userMessage = null;

    if (typeof e == "object") {
    	//判断e属于nlobjError类
        if (e instanceof nlobjError) {
            code = e.getCode() || "nlobjError";
            var st = e.getStackTrace();
            //if (Array.isArray(st)) { // :[Ljava.lang.String;@2aa5060a
            //    st = st.join(", ");
            //}
            //st = st.toString();
            message = "Code: " + e.getCode() + " Detail: " + e.getDetails() + " Trace: " + st.join(', ');
            userMessage = e.getDetails();
        } else if (e instanceof TypeError) {
            code = "TypeError";
            message = "Detail: " + e.message + " line: " + e.lineNumber;
        } else if (e instanceof ReferenceError) {
            code = "ReferenceError";
            message = "Detail: " + e.message + " line: " + e.lineNumber;
        } else {
            code = e.code || "EXCEPTION_ERROR_CODE";
            message = e.message || "Detail: " + e.toString();
        }
    } else {
        code = 'NS_ERROR';
        message = e.toString();
    }

    if (userMessage == null) userMessage = message;

    var context = nlapiGetContext();
    //var sname = context.getCompany() + '@Subsidiary' + context.getSubsidiary() + ': ' +
    //        //context.getName() +
    //    ' ' + context.getEmail() +
    //        //' ScriptId: ' + context.getScriptId() +
    //    ' ' + context.getDeploymentId();

    var sname = [
        context.getDeploymentId(),
        '@Subsidiary' + context.getSubsidiary(),
        context.getEmail()
    ].join(' ');

    return {
        code: '[' + code + '] ' + sname,
        ERROR_CODE: code,
        message: message,
        userMessage: userMessage
    };
}

function processException(e, info, sendEmail) {

    e = parseException(e);
    var code = e.code;
    var message = e.message;
    if (info) {
        if (typeof info == 'object') {
            info = JSON.stringify(info);
        }
        message += '<br/><br/>' + info;
    }

    if (typeof console == "undefined") { // NS
        if (sendEmail != false) {
            _log('nlapiSendEmail', code);
            nlapiSendEmail(-5, 'allan.hou@tctchina.com.cn', code, message);
        }
    } else {
        alert(code + '///' + message);
    }

    //if (typeof this.console == 'function') {
    //    alert(code + '///' + message);
    //} else {
    //
    //
    //
    //}

    _nlapiLogExecution('ERROR', code, message);


    return {
        code: code,
        message: message,
        getMessage: function () {
            return code + ': ' + message;
        },

        getUserMessage: function () {
            return e.userMessage;
        }
    };


}

/**
 * 客户端 and User Event
 * @param fields
 */



// 注意， 这里的 title， detail 需要都是row 的ref， 否则可能影响下一步的var
function _nlapiLogExecution(logType, title, detail) {

    var logSwitch = true, format = false;

    if (logSwitch) {

        if (typeof console == "undefined") { // NS

            if (detail) {
                if (typeof detail == "object") {
                    if (format) {
                        nlapiLogExecution(logType, title, JSON.stringify(detail, undefined, 4));
                    } else {
                        nlapiLogExecution(logType, title, JSON.stringify(detail));
                    }
                } else {
                    nlapiLogExecution(logType, title, detail);
                }
            } else {
                nlapiLogExecution(logType, title, detail);
            }

            //if (__RecordLogFlag) {
            //    if (typeof detail == 'object') {
            //        LogFile.writeLog(title, JSON.stringify(detail, null, 4));
            //    } else {
            //        LogFile.writeLog(title, detail);
            //    }
            //}

        } else { // Page: has console --- 如果是Client Script 还是用 Console 直接用这个比较好
            if (typeof title == 'object') {
                title = JSON.stringify(title, null, 2);
            }

            if (typeof detail == 'object') {
                console.log(title + '///' + JSON.stringify(detail, null, 2))
            } else {
                console.log(title + '///' + detail)
            }

        }
    }
}
function _cutText(text, size) {//超过最大字段长度，NS可存最大字符串长度为300
    // EXCEEDED_MAX_FIELD_LENGTH Detail: The field custbody_script_memo contained more than the maximum number ( 300 )

    size = size || 300;

    if (typeof text != 'string') {
        text = text.toString();
    }
    if (text.length > size) {//如果大于300，截取（0,300），然后接着拼接？
        text = text.substring(0, size);
    }
    return text;

}

// : Big Changes for ALLLLLLL
function _log(title, detail) {
    var logType = 'debug';
    _nlapiLogExecution(logType, title, detail)

}
function _audit(title, detail) {
    _nlapiLogExecution('AUDIT', title, detail);
}


function _log_email(title, detail) {
    _log('[EMAIL] ' + title, detail);
    detail = detail || 'Something is error..';

    // self sending
    nlapiSendEmail(-5, 'allan.hou@tctchina.com.cn', nlapiGetContext().getDeploymentId() + ': ' + title, '<pre>' + detail + '</pre>');
}


//_log('a');
//_log('b');
//_log('c');
////_log('D');
//_log('D2');
//_log('D3');
//console.log(LOGGING.getDetail());

Array.prototype.contains = function (value) {
    var a = this;
    for (var i = 0; i < a.length; i++) {
        if (a[i] == value) { // 而不是===
            return true;
        }
    }
    return false;
};

Array.prototype.remove = function (value) {
    var a = this;
    var index = a.indexOf(value);
    if (index > -1) {
        a.splice(index, 1);
    }
};


Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) < 0;
    });
};

Array.prototype.same = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) >= 0;
    });
};

function _toarray(obj) {
    if (!Array.isArray(obj)) obj = [obj];//对象转数组
    return obj;
}
if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
        if (this === null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;//">>>"无符号右移。无论是正数还是负数，高位通通补0
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}


//////////////////////
//// Examples
//////////////////////
//
//[1,2,3,4,5,6].diff( [3,4,5] );
//// => [1, 2, 6]


// Production steps of ECMA-262, Edition 5, 15.4.4.15
// Reference: http://es5.github.io/#x15.4.4.15
if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function (searchElement /*, fromIndex*/) {
        'use strict';

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        var n, k,
            t = Object(this),
            len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }

        n = len - 1;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) {
                n = 0;
            }
            else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }

        for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}


//function extendFn(Fn) {
//    // Fn.extend = Fn.prototype.extend
//
//    Fn.extend = function () {
//        var source = arguments[0];
//        if (source) {
//            for (var prop in source) {
//                this[prop] = source[prop];
//            }
//        }
//    };
//}

function extend(targetObj) {

    var list = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < list.length; i++) {
        var source = list[i];
        for (var prop in source) {
            targetObj[prop] = source[prop];
        }
    }

    return targetObj;

    // 不用闭包内循环， 怕有麻烦

    //Array.prototype.slice.call(arguments, 1).forEach(function (source) {
    //    if (source) {
    //        for (var prop in source) {
    //            targetObj[prop] = source[prop];
    //        }
    //    }
    //});
    //return targetObj;
}


//console.log(extend({name: 'allan'}));

// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};


function _auditUsage() {
    _audit('getRemainingUsage USAGE', nlapiGetContext().getRemainingUsage());
}

function Profiling() {
    this.startTime = (new Date).getTime();
}
Profiling.prototype = {
    // constructor: Profiling,
    //pfRecord: function (id, fun) {
    //    _log2('debug', '[Profiling] __SalesOrder ID: ' + id + ' Function: ' + fun, (new Date).getTime() - this.startTime);
    //},
    end: function () {
        var spendTime = Math.round(((new Date).getTime() - this.startTime) / 1000) + 's';
        _audit('_audit - [Profiling]', spendTime);
        return spendTime;
    }
};


function _mathround(a) {
    return Math.round(a * 100) / 100;
}

function serializeURL(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

function logparams(request) {
    _log('request.getMethod()----', request.getMethod());

    _log('---logparams---', getparams(request));
}
function getparams(request) {
    var params = request.getAllParameters();
    var paramlist = [];
    for (var param in params) {
        //nlapiLogExecution('DEBUG', 'parameter: '+ param)
        //nlapiLogExecution('DEBUG', 'value: '+params[param])
        paramlist.push({
            parameter: param,
            value: params[param]
        });
    }
    return paramlist;
}
//var params = request.getAllParameters();
//var paramlist = [];
//for (var param in params) {
//    //nlapiLogExecution('DEBUG', 'parameter: '+ param)
//    //nlapiLogExecution('DEBUG', 'value: '+params[param])
//    paramlist.push({
//        parameter: param,
//        value: params[param]
//    });
//}
//_log('list Params', paramlist);

/**
 * Checks current script usage against the GOVERNANCE_LIMIT threshold, and if usage exceeds the
 * threshold, yields the script (which saves current state and reschedules the script). If an error
 * is encountered in rescheduling, and error is thrown.
 * @throws {nlobjError} if rescheduling of the script fails.
 * @governance 0
 */
function checkGovernance() {


    if (nlapiGetContext().getExecutionContext() != 'scheduled') {
        return;
    }
    if (nlapiGetContext().getRemainingUsage() < 500) {

        nlapiLogExecution('AUDIT', 'checkGovernance---', nlapiGetContext().getRemainingUsage());

        var state = nlapiYieldScript();
        _audit('state.status', state.status);

        if (state.status == 'FAILURE') {
            throw nlapiCreateError('YIELD_SCRIPT_ERROR', 'Failed to yield script, exiting<br/>Reason = ' + state.reason + '<br/>Size = ' + state.size + '<br/>Information = ' + state.information);
        } else if (state.status == 'RESUME') {
            nlapiLogExecution('debug', 'checkGovernance-------------', nlapiGetContext().getRemainingUsage());
            nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason + ".  Size = " + state.size);
        }

    } else {
        nlapiGetContext().setPercentComplete((10000 - nlapiGetContext().getRemainingUsage()) / 100);
    }
}

function rescheduled(params) {
    var context = nlapiGetContext();
    if (context.getExecutionContext() != 'scheduled') {
        return false;
    }
    var remainingUsage = nlapiGetContext().getRemainingUsage();

    if (remainingUsage < 500) {
        _audit('remainingUsage', remainingUsage);
        var status = null;
        if (params) {
            status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId(), params);
        } else {
            status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
        }
        _audit('status', status);
        if (status == 'QUEUED') {
            _audit("Reschedule for usage reset ...", remainingUsage);
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

// http://stackoverflow.com/questions/492994/compare-two-dates-with-javascript/497790#497790
var DateCompare = {
    convert: function (d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //   an array     : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp)
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0], d[1], d[2]) :
                    d.constructor === Number ? new Date(d) :
                        d.constructor === String ? new Date(d) :
                            typeof d === "object" ? new Date(d.year, d.month, d.date) :
                                NaN
        );
    },
    compare: function (a, b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a = this.convert(a).valueOf()) &&
            isFinite(b = this.convert(b).valueOf()) ?
            (a > b) - (a < b) :
                NaN
        );
    },
    inRange: function (d, start, end) {//检查是否在某范围内的日期
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(d = this.convert(d).valueOf()) &&
            isFinite(start = this.convert(start).valueOf()) &&
            isFinite(end = this.convert(end).valueOf()) ?
            start <= d && d <= end :
                NaN
        );
    }
};
function arr_to_chunk(arr, chunkSize) {
    var groups = [], i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize)); //slice()返回指定元素，[i,i + chunkSize]数组
    }
    return groups;
}

function _strxml(arr) {
    return arr.map(function (item) {
        return item.trim();
    }).join('');
}
function getWeightGram(weight, weightunit) {
    if (typeof weight == 'string') {
        weight = parseFloat(weight);
    }
    if (weightunit == 'lb') {
        weight = 453.59237 * weight;
    } else if (weightunit == 'kg') {
        weight = weight * 1000;
    } else if (weight == 'oz') {
        weight = 28.3495231 * weight;
    } else if (weight == 'g') {
        //weight = weight;
    }

    return _mathround(weight);
}
