//闭包
function returnCSVFile(){

    function escapeCSV(val){
        if(!val) return '';
        if(!(/[",\s]/).test(val)) return val;//  ",\s 匹配"、,、和空白字符
        val = val.replace(/"/g, '""');
        return '"'+ val + '"';//返回，外部可以访问局部变量
    }


    function makeHeader(firstLine){//firstLine =>search结果
        var cols = firstLine.getAllColumns();
        var hdr = [];
        cols.forEach(function(c){//JS forEach用法
            var lbl = c.getLabel(); // column must have a custom label to be included.
            if(lbl){
                hdr.push(escapeCSV(lbl));
            }
        });
        return hdr.join(",");
    }

    function makeLine(srchRow){
        var cols = srchRow.getAllColumns();
        var line = [];
        cols.forEach(function(c){
            if(c.getLabel()){
                line.push(escapeCSV(srchRow.getText(c) || srchRow.getValue(c)));
            }
        });
        return line.join(",");
    }

    function getDLFileName(prefix){
        function pad(v){ if(v >= 10) return v; return "0"+v;}
        var now = new Date();
        return prefix + '-'+    now.getFullYear() + pad(now.getMonth()+1)+ pad(now.getDate()) + pad( now.getHours())    +pad(now.getMinutes()) + ".csv";
    }


    var srchRows = getItems('item', 'customsearch219729'); //function that returns your saved search results

    if(!srchRows)   throw nlapiCreateError("SRCH_RESULT", "No results from search");


    var fileLines = [makeHeader(srchRows[0])];

    srchRows.forEach(function(soLine){
        fileLines.push(makeLine(soLine));
    });


//创建csv文件，并邮件发送
var file = nlapiCreateFile('InventoryUpdate.csv', 'CSV', fileLines.join('\r\n'));//fileLines.join('\r\n')文件内容
nlapiSendEmail(768, 5, 'Test csv Mail','csv', null, null, null, file);
}

function getItems(recordType, searchId) {
    var savedSearch = nlapiLoadSearch(recordType, searchId);
    var resultset = savedSearch.runSearch();
    var returnSearchResults = [];
    var searchid = 0;
    do {
        var resultslice = resultset.getResults(searchid, searchid + 1000);
        for ( var rs in resultslice) {
            returnSearchResults.push(resultslice[rs]);
            searchid++;
        }
    } while (resultslice.length >= 1000);

    return returnSearchResults;//返回的是search的结果数组对象
}