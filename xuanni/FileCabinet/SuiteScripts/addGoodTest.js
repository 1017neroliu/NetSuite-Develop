/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       18 Mar 2019     Nero
 *	惰性载入，第一次执行代码后，用函数代码内部的方法覆盖原有代码，代码如下
 *	（惰性载入可以提高代码性能）
 */

function addEvents(type,element,fun){
	if(element.addEventListener){
		element.addEventListener(type,fun,false);
	}else if(element.attachEvent){
		element.attachEvent('on'+type,fun);
	}else{
		element['on'+type]=fun;
	}
}
//惰性载入，第一次执行代码后，用函数代码内部的方法覆盖原有代码，代码如下
	var addEvents = (function() {
	if (document.addEventListener) {
		return function(type, element, fun) {
			element.addEventListener(type, fun, false);
		}
	} else if (document.attachEvent) {
		return function(type, element, fun) {
			element.attachEvent('on' + type, fun);
		}
	} else {
		return function(type, element, fun) {
			element['on' + type] = fun;
		}
	}
})

var name = 'world';
(function (){
	if(typeof name === 'undefined'){
		var name = 'jack';
		console.log('GoodBye'+name);
	}else{
		console.log('hello'+name);
	}
})();