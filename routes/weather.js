var express = require('express');
var router = express.Router();
var moment = require('moment');
const DecodeGB2312 = function (val) {
    var iconv = require('iconv-lite');
    return iconv.decode(new Buffer(val, 'binary'), 'GB2312');
};
const {cacheOr,readCache} = require('../libs/cache')
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

const defaultLogic = type => {
    return type === 'month' ?
        {from: moment().subtract(1, 'month'), to: moment()} :
        {from: moment().subtract(1, 'd'), to: moment()}
}

const parseDate = type => {
    return type === 'month' ?
        t => moment(t, 'YYYYMM') :
        t => moment(t, 'YYYYMMDD')
}
const rangeCheck = (startDay, endDay) => {
    const duration = moment.duration(
        endDay.clone().endOf('month').diff(startDay.clone().startOf('month')))
    return duration.asDays() <= 365
}

router.get('/oldData', function(req, res, next) {


  //--- start ----  mysql
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
  }else{
    return;
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
    //--- end ----  mysql

//   --- start mssql ---

//    --- end mssql ---
});
const cacheOrNOUse = () => async provider => {
    const cachedValue = 0;
    return cachedValue ? cachedValue : provider()
}
router.post('/oldData', function(req, res, next) {
    // //获取需要发送的用户
    const {project,sector='all',from: sourceFrom, to: sourceTo,node=0,page=1,size=10} = req.body;
    console.log('get');
    console.log(page);
    const {from: defaultFrom, to: defaultTo} = defaultLogic('month');
    const from = sourceFrom ? parseDate('day')(sourceFrom) : defaultFrom;
    const to = sourceTo ? parseDate('day')(sourceTo) : defaultTo;
    const skip = (page -1 )*size;
    if (from > to) {
        return res.send({error:'the sector is not commit'})
        // return res.send(400, 'the sector is not commit')
    }

    // if (!rangeCheck(from, to)) {
    //     // return res.send( 'error :the date range exceeds 365 days')
    //     return res.send({error:'the date range exceeds 365 days'})
    // }
    // if (!sector) {
    //     return res.send(400, 'the sector is not commit')
    // }
    // return res.send(400, 'stop now')
    const fromStr = from.format('YYYYMMDD')
    const toStr = to.format('YYYYMMDD')
    const cacheKey = `_/api/v4/energy/oldData/${project}/from=${fromStr}&to=${toStr}/node=${node}`
    cacheOrNOUse()(async () => {
        // let query = `insert into weather  values (null,\'${projectId}\',\'${userkey}\',${data2[0]},${data2[1]},${data2[2]},${data2[3]},${data2[4]},${data2[5]},${data2[6]},${parseInt(date)},'${new Date().format("yyyy-MM-dd hh:mm:ss")}')`;
        let query = `select  b.DivisionID,b.BuildCode,b.BuildName,b.shortedName,b.Address,b.BuildArea,b.ColdArea,b.HeatArea,
    b.UsedPerson,b.online,b.ID,b.Longitude,b.Latitude,
    d.CollectionTime,d.EquipmentID,d.EquipmentSort,d.EnergyCode,d.Qty
    from testgbk.tbBuildInfor b
    left join testgbk.tbEnergyCollection_ByDay d on b.BuildCode = d.DivisionID
    where d.CollectionTime>${fromStr} and d.CollectionTime<${toStr}
    and b.BuildCode in (select project from testgbk.socities where id = ${node} or parent = ${node})
     limit ${skip},${size} 
    `;
        let countQuery = `select  count(1) total
    from testgbk.tbBuildInfor b
    left join testgbk.tbEnergyCollection_ByDay d on b.BuildCode = d.DivisionID
    where d.CollectionTime>${fromStr} and d.CollectionTime<${toStr}
    and b.BuildCode in (select project from testgbk.socities where id = ${node} or parent = ${node})`;
        // let query = '   select * from tbBuildInfor';
        // let query = `insert into weather values (null,\'1\',,1.11,1.11,1.11,1.11,1.11,1.11,1.11,123456789012,\'2019-01-01 00:00:00\'`;
     const [count,res] = await  Promise.all([MySQL.Exec(countQuery).then(
         data=>{
             // _.each(data, function (item) {
             //     console.log(item);
             // })
             return data;
         },
         err=>{
             console.log(req.session, err);
             return 'error with query';
         }

     ),MySQL.Exec(query).then(
         data=>{
             // _.each(data, function (item) {
             //     console.log(item);
             // })
             return data;
         },
         err=>{
             console.log(req.session, err);
             return 'error with query';
         }

     )]) ;
        console.log('return');
        console.log(page);
    return {count:count,res:res,page:page,size:size};
    }).then(x => res.send(x))



    //--- end ----  mysql

//   --- start mssql ---

//    --- end mssql ---
});

router.post('/info', function(req, res, next) {
    // //获取需要发送的用户
    const {project,} = req.body;
    const cacheKey = `_/api/v4/energy/info/${project}`
    cacheOr(cacheKey, 0.1)(async () => {
        // let query = `insert into weather  values (null,\'${projectId}\',\'${userkey}\',${data2[0]},${data2[1]},${data2[2]},${data2[3]},${data2[4]},${data2[5]},${data2[6]},${parseInt(date)},'${new Date().format("yyyy-MM-dd hh:mm:ss")}')`;
        let query = "select * from socities";
        // let query = '   select * from tbBuildInfor';
        // let query = `insert into weather values (null,\'1\',,1.11,1.11,1.11,1.11,1.11,1.11,1.11,123456789012,\'2019-01-01 00:00:00\'`;
     const res = await   MySQL.Exec(query).then(
            data=>{
                // _.each(data, function (item) {
                //     console.log(item);
                // })
                return data;
            },
            err=>{
                console.log(req.session, err);
                return 'error with query';
            }

        );
    return res;
    }).then(x => res.send(x))



    //--- end ----  mysql

//   --- start mssql ---

//    --- end mssql ---
});

module.exports = router;

//push test
