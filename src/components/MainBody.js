'use strict';

const React = require('React');
const querystring = require('querystring');
const socketio = require('socket.io-client');
const moment = require('moment');
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
    let socket = socketio();
    this.state = {
      companies: [],                  // actively graphed getCompanies
      companyCache: {},               // full time range data for all companies
      endDate: moment(),                // range is inclusive
      startDate: moment().subtract(90, 'days'),  // default to last 90 days
      chart: null,
      chartPending: null,
      ctx: null,
      matchingCompanies: [],
      noMatchingCompanies: false,
      socket: socket,
    };
    this.companyCache = {};   // symbol: { dates: [], values: [] }
    this.pointsMax = 100;     // maximun No. points to draw for each company
    this.maxTries = 5;
    this.searchTimeout = null;
    this.getCompanies();
    socket.on('addCompanyServer', (data) => this.addCompany(data));
    socket.on('removeCompanyServer', (data) => this.removeCompany(data));
  }
  getCompanies() {
    d3.request.json('/api/allSymbols', (err, data) => {
      if (err) throw err;
      this.setState({ companies: data });
      data.forEach( (val) => this.retrieveOneCompanyData(val) );
    });
  }
  retrieveOneCompanyData(oneCompany, tries=0) {
    if (this.companyCache.hasOwnProperty(oneCompany)) return;
    if (tries > this.maxTries) { console.log('max tries reach'); return; }
    let queryString = querystring.stringify({
      Symbol: oneCompany,
      EndOffsetDays: 0,
      NumberOfDays: 3650
    });
    d3.request.json('/api/companyData?' + queryString, (err, data) => {
      if (err) { console.log('error: ' + err); return; }
      if (data.hasOwnProperty('ExceptionType')) { return; }
      if (data.error === 'request blocked') {
        console.log('exceeded limit, trying again for ' + oneCompany);	
        setTimeout( () => this.retrieveOneCompanyData(oneCompany, tries+1), 2500);
        return;
      }
      let tempCompanyCache = Object.assign({}, this.state.companyCache);
      tempCompanyCache[oneCompany] = {
        dates: data.Dates.map((val) => moment(val)),
        values: data.Elements[0].DataSeries.close.values
      };
      this.setState({ companyCache: tempCompanyCache });
    });
  }
  retrieveAllCompanyData() {
    // go through all the symbols
    this.state.companies.forEach((symbol) => this.retrieveOneCompanyData(symbol));
  }
  addCompany(newSymbol, emit) {
    newSymbol = newSymbol.toUpperCase();
    if (emit) this.state.socket.emit('addCompanyClient', newSymbol);
    if (this.state.companies.includes(newSymbol)) return;
    let tempCompanies = Object.assign([], this.state.companies);
    tempCompanies.push(newSymbol);
    this.retrieveOneCompanyData(newSymbol);
    this.setState({ companies: tempCompanies });
  }
  removeCompany(symbol, emit) {
    symbol = symbol.toUpperCase();
    if (emit) this.state.socket.emit('removeCompanyClient', symbol);
    if (!this.state.companies.includes(symbol)) return;
    let tempCompanies = Object.assign([], this.state.companies);
    tempCompanies.splice(tempCompanies.indexOf(symbol));
    this.setState({ companies: tempCompanies });
  }
  shouldComponentUpdate(nextProps, nextState) {
    // wait until we have all the company data to render
    if (nextState.chartPending) {
      return false;
    } else {
      return true;
    }
  }
  render() {
    return (
      <div id='main-body'>
        <GraphButtons 
          endDate={this.state.endDate}
          startDate={this.state.startDate}
          fnStaticTimeChange={(numberBack, unitsBack) => this.staticTimeChange(numberBack, unitsBack)}
          fnDynamicTimeChange={(startDate, endDate) => this.dynamicTimeChange(startDate, endDate)}
          key="GraphButtons"
        />
        <Graph 
          companies={this.state.companies}
          companyCache={this.state.companyCache}
          endDate={this.state.endDate}
          startDate={this.state.startDate}
          ctx={this.state.ctx}
          chart={this.state.chart}
          fnSetCtx={() => this.setCtx()}
          fnSetChart={(chart) => this.setChart(chart)}
          fnShouldMakeNewChart={() => this.shouldMakeNewChart()}
          fnRemoveCompany={(symbol, emit) => this.removeCompany(symbol, emit)}
          key="Graph"
        />
        <AddButton 
          matchingCompanies={this.state.matchingCompanies}
          noMatchingCompanies={this.state.noMatchingCompanies}
          fnSearchSymbols={(event) => this.searchSymbolsTimeout(event)}
          fnAddCompany={(symbol, emit) => this.addCompany(symbol, emit)}
          key="AddButton"
        />
      </div>
    );
  }

  // used by GraphButtons
  staticTimeChange(numberBack, unitsBack='days') {
    this.setState({ 
      endDate: moment(),
      startDate: moment().subtract(numberBack, unitsBack)
    });
  }
  dynamicTimeChange(startDate, endDate) {
    this.setState({
      endDate: moment(endDate),
      startDate: moment(startDate)
    });
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

  // used by AddButton
  searchSymbolsTimeout(event, delay=600) {
    let symbol = encodeURIComponent(event.target.value.toUpperCase());
    if (!symbol) {
      this.setState({
        noMatchingCompanies: false,
        matchingCompanies: []
      });
      return;
    }
    clearTimeout( this.searchTimeout );
    this.searchTimeout = setTimeout( () => this.searchSymbols(symbol), delay );   //keep from freaking out while typing
  }
  searchSymbols(symbol) {
    d3.request.json('/api/searchSymbol/' + symbol, (err, data) => {
      if (err) throw err;
      if (data.length === 0) {
        this.setState({
          noMatchingCompanies: true,
          matchingCompanies: []
        });
      } else {
        this.setState({
          noMatchingCompanies: false,
          matchingCompanies: data
        });
      }
    });
  }

}

module.exports = MainBody;