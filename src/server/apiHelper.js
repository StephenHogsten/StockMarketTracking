'use strict';

const url = require('url');
const http = require('http');

function get(reqUrl, cb) {
  let resp = [];
  let queryUrl = url.parse(reqUrl);
  let options = {
    protocol: queryUrl.protocol,
    hostname: queryUrl.hostname,
    path: queryUrl.path,
    method: 'GET'
  };
  let req = http.request(options, (res) => {
    res.on('data', (chunk) => {
      resp.push(chunk.toString());
    });
    res.on('end', () => {
      cb(null, resp.join(''));
    });
  });
  req.end();
}

module.exports = {
  get: get
};