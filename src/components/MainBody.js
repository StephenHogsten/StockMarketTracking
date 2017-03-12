'use strict';

const React = require('React');
const d3 = {
  request: require('d3-request')
};
const GraphButtons = require('../components/GraphButtons.js');    // eslint-disable-line
const Graph = require('../components/Graph.js');                  // eslint-disable-line
const CompanyHolder = require('../components/CompanyHolder.js');  // eslint-disable-line
const AddButton = require('../components/AddButton.js');          // eslint-disable-line
const querystring = require('querystring');

class MainBody extends React.Component {
  constructor(props) {
    super();
    this.state = {
      companies: this.getCompanies(),
      startDate: props.startDate,
      endDate: props.endDate
    };
  }
  componentDidMount() {
    this.retrieveData();
  }
  getCompanies() {
    // eventually we'll get this from web sockets
    // for now just take it from the props
    return {
      "ABAX": null,
      "MSFT": null,
      "ABCB": null
    };
  }
  retrieveData() {
    // go through all the symbols
    Object.keys(this.state.companies).forEach((oneCompany) => {
      if (this.state.companies[oneCompany]) return;
      //convert dates to offsets & build query string
      let today = new Date();
      let msPerDay = 86400000;
      let queryString = querystring.stringify({
        Symbol: oneCompany,
        EndOffsetDays: Math.floor((this.state.endDate - today) / msPerDay),
        NumberOfDays: Math.floor((this.state.endDate+1 - this.state.startDate) / msPerDay)
      });
      // request internal API info
      d3.request.json('/api/companyData?' + queryString, (err, data) => {
        if (err) throw err;
        // check for error
        // NEEDS TO BE BETTER
        if (data.hasOwnProperty('ExceptionType')) {
          console.log('error retrieving stock data for ' + oneCompany + ': ' + data.Message); // eslint-disable-line
          return;
        }
        // use React api to return a new state
        this.setState( (lastState) => {
          let thisData = data.Elements[0].DataSeries.close.values;
          lastState.companies[oneCompany] = thisData | "ERROR";
          return lastState;
        });
      });
    });
  }
  render() {
    return (
      <div id='main-body'>
        <GraphButtons />
        <Graph />
        <CompanyHolder />
        <AddButton />
      </div>
    );
  }
}

module.exports = MainBody;