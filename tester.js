const url = require('url');
const http = require('http');

let queryUrl = 'http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=%7B"Normalized"%3Afalse%2C"EndOffsetDays"%3A360%2C"NumberOfDays"%3A4%2C"DataPeriod"%3A"Day"%2C"Elements"%3A%5B%7B"Symbol"%3A"ABAX"%2C"Type"%3A"price"%2C"Params"%3A%5B"c"%5D%7D%5D%7D';
console.log(JSON.stringify(url.parse(queryUrl)));
