const moment = require('moment');

exports.logger = () =>{
   const now = moment().format('LLLL');
   console.log(now)
   return `${now}`;
}