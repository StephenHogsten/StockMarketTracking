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
  getCompanies() {
    d3.request.json('/api/allSymbols', (err, data) => {
      if (err) throw err;
      this.setState({ companies: data });
      Object.keys(data).forEach( (val) => this.retrieveOneCompanyData(val) );
    });
  }
  retrieveOneCompanyData(oneCompany) {
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
    Object.keys(this.state.companies).forEach((symbol) => this.retrieveOneCompanyData(symbol));
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
  addCompany(newSymbol) {
    newSymbol = newSymbol.toUpperCase();
    if (this.state.companies.hasOwnProperty(newSymbol)) return;
    let tempCompanies = Object.assign({}, this.state.companies);
    tempCompanies[newSymbol] = null;
    this.retrieveOneCompanyData(newSymbol);
    this.setState({ companies: tempCompanies });
  }
  removeCompany(symbol, emit) {
    if (emit) this.state.socket.emit('removeCompanyClient', symbol);
    if (!this.state.companies.hasOwnProperty(symbol)) return;
    let tempCompanies = Object.assign({}, this.state.companies);
    delete tempCompanies[symbol];
    this.setState({ companies: tempCompanies });
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
          fnRemoveCompany={(symbol, emit) => this.removeCompany(symbol, emit)}
        />
        <CompanyHolder 
          companies={this.state.companies}
        />
        <AddButton />
      </div>
    );
  }

  // used by Graph
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

  // used by company holder
  addLegendBox(chart) {
    console.log(chart);
  }
}

module.exports = MainBody;