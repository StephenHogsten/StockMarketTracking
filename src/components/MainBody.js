'use strict';

const React = require('React');
const querystring = require('querystring');
const socketio = require('socket.io-client');
const d3 = {
  request: require('d3-request')
};
// const Chart = require('chart.js');
const GraphButtons = require('../components/GraphButtons.js');    // eslint-disable-line
const Graph = require('../components/Graph.js');                  // eslint-disable-line
const CompanyHolder = require('../components/CompanyHolder.js');  // eslint-disable-line
const AddButton = require('../components/AddButton.js');          // eslint-disable-line

class MainBody extends React.Component {
  constructor() {
    super();
    this.state = {
      companies: {},
      EndOffsetDays: 0,   //default to last 90 days
      NumberOfDays: 90,
      dates: null,         // this is tricky because we skip holidays and weekends
      chart: null,
      chartPending: null,
      ctx: null,
      socket: socketio()
    };
    this.getCompanies();
    this.state.socket.on('addCompanyServer', (data) => this.addCompany(data));
    this.state.socket.on('removeCompanyServer', (data) => this.removeCompany(data));
  }
  addCompany(newSymbol) {
    console.log('adding new symbol');
    let tempCompanies = Object.assign({}, this.state.companies);
    tempCompanies[newSymbol] = null;
    this.retrieveOneDatum(newSymbol);
    this.setState({ companies: tempCompanies });
  }
  removeCompany(symbol) {
    console.log('removing symbol');
    let tempCompanies = Object.assign({}, this.state.companies);
    delete tempCompanies[symbol];
    this.setState({ companies: tempCompanies });
  }
  setCtx() {
    this.setState({ ctx: document.getElementById('stock-graph') });
  }
  setChart(chart) {
    this.setState({ chart: chart });
    this.setState({ chartPending: false });
  }
  shouldMakeNewChart() {
    if (this.state.chart) {
      return false;
    }
    if (this.state.chartPending) {
      return false;
    }
    this.setState({ chartPending: true });
    return true;
  }
  getCompanies() {
    d3.request.json('/api/allSymbols', (err, data) => {
      if (err) throw err;
      this.setState({ companies: data });
      Object.keys(data).forEach( (val) => this.retrieveOneDatum(val) );
    });
    // return {
    //   'ABAX': null,
    //   'MSFT': null,
    //   'ABCB': null
    // };
  }
  retrieveOneDatum(oneCompany) {
    console.log('retrieving one datum: ' + oneCompany);	
    if (this.state.companies[oneCompany]) return;
    //build internal query string
    let queryString = querystring.stringify({
      Symbol: oneCompany,
      EndOffsetDays: this.state.EndOffsetDays,
      NumberOfDays: this.state.NumberOfDays
    });
    // request internal API info
    d3.request.json('/api/companyData?' + queryString, (err, data) => {
      if (err) throw err;
      // check for error - NEEDS IMPROVEMENT
      if (data.hasOwnProperty('ExceptionType')) {
        console.log('error retrieving stock data for ' + oneCompany + ': ' + data.Message); // eslint-disable-line
        return;
      }
      // use React api to return a new state
      if (!this.state.dates) { 
        this.setState({dates: data.Dates}); 
      }
      let thisData = data.Elements[0].DataSeries.close.values;
      let newCompanies = Object.assign({}, this.state.companies);
      newCompanies[oneCompany] = thisData || "ERROR";
      this.setState({companies: newCompanies});
    });
  }
  retrieveAllData() {
    // go through all the symbols
    console.log(this.state.companies);	
    Object.keys(this.state.companies).forEach((symbol) => this.retrieveOneDatum(symbol));
  }
  shouldComponentUpdate(nextProps, nextState) {
    // wait until we have all the company data to render
    if (nextState.chartPending) {
      return false;
    }
    let keys = Object.keys(nextState.companies);
    for (let i=0; i<keys.length; i++) {
      if (!nextState.companies[keys[i]]) {
        return false;
      }
    }
    return true;
  }
  render() {
    return (
      <div id='main-body'>
        <GraphButtons 
          socket={this.state.socket}
        />
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