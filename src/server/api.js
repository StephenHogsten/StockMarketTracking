'use strict';

const express = require('express');

const apiHelper = require('./apiHelper.js');

let apiRouter = express.Router();
// expects query parameters (case sensitive) of:
//  Symbol - symbol of company to query
//  EndOffsetDays - number of days to look backwards (for the last day in our range)
//  NumberOfDays - how many days are in our range
apiRouter.get('/companyData', (req, res) => {
  if (!req.query.Symbol) { res.json({ error: 'no symbol given'}); }
  // build external API url based on internal query parameters
  let baseApiUrl = "http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=";
  let requestParams = JSON.stringify({
    Normalized: false,
    EndOffsetDays: req.query.EndOffsetDays || 0,
    NumberOfDays: req.query.NumberOfDays || 90,
    DataPeriod: "Day",
    Elements: [
      {
        Symbol: req.query.Symbol,
        Type: "price",
        Params: ["c"]
      }
    ]
  });
  apiHelper.get(baseApiUrl + encodeURIComponent(requestParams), (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
    res.end();
  });
});

apiRouter.get('/tester', (req, res) => {
  res.send('success' + req.query.paa);
});

module.exports = apiRouter;