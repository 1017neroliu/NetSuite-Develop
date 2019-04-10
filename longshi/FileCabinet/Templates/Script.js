/**
 * Module Description
 * 
 * Version 		Date 		Author 		Remarks 
 * 1.00  	14 Jan 2019 	Nero
 * arr.forEach(function(line) {})
 */
//龙石打印，按单位分类汇总打印qgpl和bgpl
function totalUnits(CN,CNU,QTY,QTYU,GW,GWU,NW,NWU,MEAS,MEASU) {
	var arr = [[CN,CNU,QTY,QTYU,GW,GWU,NW,NWU,MEAS,MEASU]];

	var group = ['RollS','Roll','PKGS','PKG','CTNS','CTN'];
	arr.forEach(function(line) {

		var roll = line[1];

		if (group.hasOwnProperty(roll)) {
			group[roll] = group[roll].push(line);
		} else {
			group[roll] = [line];	
		}
	})
}

function group(arr,units,num){
	var flag = "F"
	//arr = [[单位1,数量1],[单位2,数量2],[单位3,数量3]]
	var length = arr.length;
	for (var i = 0; i < length; i++) {
		if (arr[i][0] == units) {
			arr[i][1] == arr[i][1] + num;
			flag = "T";
		}
	}
	if (flag == "F") {
		arr.push([nuits,num]);
	}
	return arr;
}

/**
 * =================================JS数组去重=================================================
 */
//简单去重：	1.新建新数组,遍历旧数组传入新数组,值不在新数组就传入新数组
function uniq(array){
    var temp = []; //一个新的临时数组
    for(var i = 0; i < array.length; i++){
        if(temp.indexOf(array[i]) == -1){//indexOf(str)检索该元素是首次出现的位置，没有出现，返回-1，对大小写敏感
            temp.push(array[i]);
        }
    }
    return temp;
}

var aa = [1,2,2,4,9,6,7,5,2,3,5,6,5];
console.log(uniq(aa));//[1, 2, 4, 9, 6, 7, 5, 3]

/**
 * 对象键值去重
 * 2.新建JS对象和新数组，遍历旧数组传入新数组，判断值是否为JS对象的键，不是的话给对象新增该键并放入新数组(速度最快， 占空间最多（空间换时间）)
 * 注意：
 * 		在判断是否为JS对象键时，会自动对传入的键执行“toString()”操作比如，2和“2”，就会被认为是同一个对象，解决此问题用indexOf()
 */
function uniq(array){
//	var temp = {};定义对象
//	var r = [];定义数组
    var temp = {}, r = [], len = array.length, val, type;
    for (var i = 0; i < len; i++) {
        val = array[i];
        type = typeof val;//获取数组中元素的类型
        if (!temp[val]) {
            temp[val] = [type];
            console.log(val);
            console.log(temp);
            console.log(temp[val]);
            r.push(val);
        } else if (temp[val].indexOf(type) < 0) {
            temp[val].push(type);
            r.push(val);
        }
    }
    return r;
}

var aa = [1,2,"2",4,9,"a","a",2,3,5,6,5];//[1, 2, "2", 4, 9, "a", 3, 5, 6]
console.log(uniq(aa));

/**
 * 排序后相邻去重(这个有问题，有重复的)
 * 3.给传入数组排序，排序后相同值相邻，然后遍历时,新数组只加入不与前一值重复的值。会打乱原来数组的顺序
 */
function uniq(array){
    array.sort();
    var temp=[array[0]];
    for(var i = 1; i < array.length; i++){
        if( array[i] !== temp[temp.length-1]){
            temp.push(array[i]);
        }
    }
    return temp;
}

var aa = [1,2,"2",4,9,"a","a",2,3,5,6,5];
console.log(uniq(aa));

/**
 * 数组下标去重
 * 4.还是得调用“indexOf”性能跟方法1差不多
 * 实现思路：如果当前数组的第i项在当前数组中第一次出现的位置不是i，那么表示第i项是重复的，忽略掉。否则存入结果数组。
 */
function uniq(array){
    var temp = [];
    for(var i = 0; i < array.length; i++) {
        //如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
        if(array.indexOf(array[i]) == i){
            temp.push(array[i])
        }
    }
    return temp;
}

var aa = [1,2,"2",4,9,"a","a",2,3,5,6,5];
console.log(uniq(aa));

/**
 * 优化遍历数组法去重
 * 5.实现思路：获取没重复的最右一值放入新数组。检测到有重复值时终止当前循环同时进入顶层循环的下一轮判断
 */
function uniq(array){
    var temp = [];
    var index = [];
    var len = array.length;
    for(var i = 0; i < len; i++) {
        for(var j = i + 1; j < len; j++){
            if (array[i] === array[j]){
                i++;
                j = i;
            }
        }
        temp.push(array[i]);
        index.push(i);
    }
    console.log(index);
    return temp;
}

var aa = [1,2,2,3,5,3,6,5];
console.log(uniq(aa));

/**
 * set集合去重
 */
let arr = [1,2,3,2,1]
arr = Array.from(new Set(arr)) // [1,2,3]








