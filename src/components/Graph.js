'use strict';
const React = require('React');
const Chart = require('chart.js');
const moment = require('moment');
const d3 = {
  scale: require('d3-scale'),
  axis: require('d3-axis'),
  request: require('d3-request')
};

let normalDotSize = 2;

class Graph extends React.Component {
  componentDidMount() {
    this.buildGraph();
  }
  shouldComponentUpdate(nextProps) {
    if (
      nextProps.companies === this.props.companies &&
      Object.keys(nextProps.companyCache).length === Object.keys(this.props.companyCache).length &&
      nextProps.endDate == this.props.endDate &&
      nextProps.startDate == this.props.startDate &&
      this.props.chart &&
      this.props.ctx
    ) { 
      return false; 
    }   // shouldn't update anything if it's all the same
    return true;
  }
  render() {
    return (
      <canvas id='stock-graph' width="1000" height="500" key="Graph">
      </canvas>
    );
  }
  componentDidUpdate() {
    this.buildGraph();
  }
  buildDatasets() {
    let dataset = [];
    this.props.companies.map( (symbol, idx) => {
      if (!this.props.companyCache[symbol]) return;   // we don't have data yet
      let oneCompanyData = [];
      let oneCompanyDataAll = this.props.companyCache[symbol];
      for (let i=0, l=this.props.companyCache[symbol].dates.length; i<l; i++) {
        let tempDate = moment(oneCompanyDataAll.dates[i]);
        if (tempDate < this.props.startDate) continue;
        if (tempDate > this.props.endDate)   break;
        oneCompanyData.push({
          x: tempDate,
          y: oneCompanyDataAll.values[i]
        });
      }
      dataset.push({
        label: symbol,
        fill: false,
        borderColor: d3.scale.schemeCategory20[idx],
        backgroundColor: d3.scale.schemeCategory20[idx],
        data: oneCompanyData,
        spanGaps: true,
        pointHitRadius: normalDotSize + 5,
        pointRadius: 2,
        pointHoverRadius: normalDotSize + 5
      });
    });
    return dataset;
  }
  newGraph() {
    this.props.fnSetChart( new Chart(this.props.ctx, {
      type: 'line',
      data: {
        datasets: this.buildDatasets()
      },
      options: { 
        title: {
          display: true,
          text: "Price at Close (USD)",
          position: 'left',
          padding: 5
        },
        legend: {
          onHover: (event, legendItem) => {this.hoverOneBox(event, legendItem);},
          onClick: (event, legendItem) => {this.handleClick(legendItem);}
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              tooltipFormat: 'L',
              displayFormats: {
                day: 'L'
              }
            }
          }]
        }
      }
    }));
    Chart.defaults.global.defaultFontColor = '#3C5A5B';
  }
  handleClick(legendItem) {	
    let previous = document.querySelector('.hover-text');
    if (previous) previous.remove();
    this.props.fnRemoveCompany(legendItem.text, true);
  }
  hoverOneBox(event, legendItem) {
    let previous = document.querySelector('.hover-text');
    if (previous) previous.remove();

    let hoverText = document.createElement('div');
    this.setupHoverText(event, hoverText, legendItem);
    
    let thisNode = this.props.chart.data.datasets[legendItem.datasetIndex];
    this.boldOneLine(thisNode);
    
    thisNode.timeout = window.setTimeout(() => {
      hoverText.remove();
      thisNode.pointRadius = normalDotSize;
      this.props.chart.update();
    }, 1000);
    
  }
  setupHoverText(event, hoverText, legendItem) {
    console.log(event);
    hoverText.onclick = () => {this.handleClick(legendItem);};
    hoverText.className = "hover-text";
    hoverText.style.left = event.pageX + 'px';
    hoverText.style.top = event.pageY + 'px';
    hoverText.innerText = "Click to remove this symbol";
    document.getElementById('stock-graph').parentElement.appendChild(hoverText);
  }
  boldOneLine(thisNode) {
    window.clearTimeout(thisNode.timeout);
    thisNode.pointRadius = normalDotSize + 2;
    this.props.chart.update();
  }  
  buildGraph() {
    if (!this.props.ctx) {
      this.props.fnSetCtx();
      return;     // this will retrigger update anyway
    }
    if (!this.props.chart) {
      if (this.props.fnShouldMakeNewChart()) { this.newGraph(); }
      return;
    }
    this.props.chart.data.datasets = this.buildDatasets();
    
    this.props.chart.update();
  }
}

module.exports = Graph;