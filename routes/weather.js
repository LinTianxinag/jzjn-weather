var express = require('express');
var router = express.Router();

/* GET users listing. */

Date.prototype.format = function(fmt) {
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt)) {
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }
  for(var k in o) {
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    }
  }
  return fmt;
}

router.get('/', function(req, res, next) {
  console.log(req.query.userkey);
  console.log(req.query.data);
  console.log(req.query.date);

  let userkey = req.query.userkey;
  // let projectId = userkey?((userkey == '18125752001')?'5d7f6926d4135f0011188ffd':''):'';
  let projectId = userkey?((userkey == '18125752001')?'5d6cd030a59c7200126be563':''):'';
  let data = req.query.data?req.query.data.split(','):null;
  let data2 = [];
  let date = req.query.date;
  if(data&&data.length>0){
    data.forEach(y => data2.push(parseFloat(y)))
  }
  console.log(data2);
  console.log('----'+new Date().format("yyyy-MM-dd"));
  var time1 = new Date().format("yyyy-MM-dd hh:mm:ss");
  console.log(time1);
  // //获取需要发送的用户
  //time.format('YYYY/MM/DD HH:mm:ss')
  // let query = `insert into weather
  //  values (null,${userkey},${data2[0]},${data2[1]},${data2[2]},${data2[3]},${data2[4]},${data2[5]},${data2[6]},${date},'${Date.now()}';`;
  // let query = `insert into weather  values (null,\'5db0236e74a04b0011cd88d3\',\'${userkey}\',${data2[0]},${data2[1]},${data2[2]},${data2[3]},${data2[4]},${data2[5]},${data2[6]},${parseInt(date)},'${new Date().format("yyyy-MM-dd hh:mm:ss")}')`;
  let query = `insert into weather  values (null,\'${projectId}\',\'${userkey}\',${data2[0]},${data2[1]},${data2[2]},${data2[3]},${data2[4]},${data2[5]},${data2[6]},${parseInt(date)},'${new Date().format("yyyy-MM-dd hh:mm:ss")}')`;
  // let query = `insert into weather values (null,\'1\',,1.11,1.11,1.11,1.11,1.11,1.11,1.11,123456789012,\'2019-01-01 00:00:00\'`;
  MySQL.Exec(query).then(
      users=>{
        _.each(users, function (user) {
          console.log(user);
        })
      },
      err=>{
        console.log(req.session, err);

      }
  );
  res.send('respond with a weather');
});

module.exports = router;
