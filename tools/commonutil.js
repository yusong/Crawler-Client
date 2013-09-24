define([], function(){

  var CommUtil=function() {};

  CommUtil.prototype.standardizingJSONst =function (nonstandardJSONst){
    var JSONst="";
    // console.log(nonstandardJSONst);
    nonstandardJSONst=nonstandardJSONst.replace(/[\n\t]/g,"");
    nonstandardJSONst=nonstandardJSONst.replace(/[\‘\’]/g,"\'");
    nonstandardJSONst=nonstandardJSONst.replace(/[\“\”]/g,"\"");
    nonstandardJSONst=nonstandardJSONst.replace(/\'/g,"\"");
    var regNonstandardKey1 = /[{,\]][^,\{\}\[\]\"\']+?:/g;//这里值是非标准的数字key,字符串key一般都是标准的
    var arrMactches1 = nonstandardJSONst.match(regNonstandardKey1)
    var temKey1="";
    var startst1="";
    if(arrMactches1){
      for (var i=0;i < arrMactches1.length ; i++)
        {
          startst1=arrMactches1[i].substring(0,1);
          temKey1=arrMactches1[i].substring(1,arrMactches1[i].length-1);
          var regReplace1=new RegExp(arrMactches1[i].substring(1,arrMactches1[i].length),"g"); //创建正则RegExp对象  
          nonstandardJSONst=nonstandardJSONst.replace(regReplace1,"\""+temKey1+"\":");//结果存在这里，还没筛取,有价格，月销量，运费
        } 
    }
    nonstandardJSONst=nonstandardJSONst.replace(/:\"(\d+.\d+)\"/g,function(a,b){return ":"+b});//结果存在这里，还没筛取,有价格，月销量，运费
    var regNonstandardKey2=/(,\/\/.+?)\n/img;
    var arrMactches2 = nonstandardJSONst.match(regNonstandardKey2);
    if(arrMactches2){
      for (var i=0;i < arrMactches2.length ; i++)
        {
          console.log(arrMactches2[i]);
          nonstandardJSONst=nonstandardJSONst.replace(arrMactches2[i],",");
        }
    }
    nonstandardJSONst=nonstandardJSONst.replace(/:\"(\d+.\d+)\"/g,function(a,b){return ":"+b});//结果存在这里，还没筛取,有价格，月销量，运费
    JSONst=nonstandardJSONst;
    return JSONst;
  
    // var regNonstandardKey = /[{,](\'(.+?)\'):/g;//这里值是非标准的数字key,字符串key一般都是标准的
    // var arrMactches = nonstandardJSONst.match(regNonstandardKey)
    // var newst="";
    // if(arrMactches){
    //   for (var i=0;i < arrMactches.length ; i++)
    //   {
    //     newst=arrMactches[i].replace(/\'/g,"\"");
    //     var regReplace=new RegExp(arrMactches[i],"g"); //创建正则RegExp对象   
    //     nonstandardJSONst=nonstandardJSONst.replace(regReplace,newst);//结果存在这里，还没筛取,有价格，月销量，运费
    //   }
    // }
  }

  CommUtil.prototype.get = function(obj, prop) {
    var arr = prop.split('.');
    if( arr.length > 0 ) {
      var iter = obj;
      for( var i in arr ) {
        if( iter[arr[i]] ) { iter = iter[arr[i]]; }
        else { return ''; }
      }
      return iter;
    } else {
      return '';
    }
  }

  return new CommUtil();
});