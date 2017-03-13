'use strict';

const React = require('React');
const d3 = {
  request: require('d3-request')
};
const querystring = require('querystring');
// const Chart = require('chart.js');
const GraphButtons = require('../components/GraphButtons.js');    // eslint-disable-line
const Graph = require('../components/Graph.js');                  // eslint-disable-line
const CompanyHolder = require('../components/CompanyHolder.js');  // eslint-disable-line
const AddButton = require('../components/AddButton.js');          // eslint-disable-line

class MainBody extends React.Component {
  constructor(props) {
    super();
    this.state = {
      companies: this.getCompanies(),
      EndOffsetDays: 0,   //default to last 90 days
      NumberOfDays: 90,
      dates: null,         // this is tricky because we skip holidays and weekends
      chart: null,
      chartPending: null,
      ctx: null
    };
    console.log('retrieve data');
    this.retrieveData();
  }
  setCtx() {
    this.setState({ ctx: document.getElementById('stock-graph') });
  }
  setChart(chart) {
    console.log('setting chart');
    this.setState({ chart: chart });
    this.setState({ chartPending: false });
  }
  shouldMakeNewChart() {
    console.log(this);
    console.log('state before');
    console.log(this.state);
    if (this.state.chart) {
      console.log('skipping out early');
      return false;
    }
    if (this.state.chartPending) {
      console.log('skipping out early 2');
      return false;
    }
    this.setState({ chartPending: true });
    console.log('returning true');
    return true;
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
      console.log('getting data for ' + oneCompany);
      if (this.state.companies[oneCompany]) return;
      //convert dates to offsets & build query string
      let queryString = querystring.stringify({
        Symbol: oneCompany,
        EndOffsetDays: this.state.EndOffsetDays,
        NumberOfDays: this.state.NumberOfDays
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
        if (!this.state.dates) { 
          console.log('setting dates');
          this.setState({dates: data.Dates}); 
        }
        let thisData = data.Elements[0].DataSeries.close.values;
        let newCompanies = Object.assign({}, this.state.companies);
        newCompanies[oneCompany] = thisData || "ERROR";
        console.log('new companies:');
        console.log(newCompanies);
        this.setState({companies: newCompanies});
      });
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('should we update?');
    console.log(nextState);
    // wait until we have all the company data to render
    if (nextState.chartPending) {
      console.log('no - pending');
      console.log(nextState);
      return false;
    }
    let keys = Object.keys(nextState.companies);
    for (let i=0; i<keys.length; i++) {
      if (!nextState.companies[keys[i]]) {
        console.log('no');
        console.log(nextState.companies);
        return false;
      }
    }
    console.log('yes');
    return true;
  }
  render() {
    console.log('rendering');
    console.log(this.state);
    return (
      <div id='main-body'>
        <GraphButtons />
        <Graph 
          companies={this.state.companies}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          dates={this.state.dates}
          ctx={this.state.ctx}
          chart={this.state.chart}
          fnSetCtx={() => this.setCtx()}
          fnSetChart={(chart) => this.setChart(chart)}
          fnShouldMakeNewChart={() => this.shouldMakeNewChart()}
        />
        <CompanyHolder />
        <AddButton />
      </div>
    );
  }
}

module.exports = MainBody;