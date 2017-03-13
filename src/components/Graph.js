'use strict';
const React = require('React');
const Chart = require('chart.js');
const d3 = {
  scale: require('d3-scale'),
  axis: require('d3-axis'),
  request: require('d3-request')
};

let normalDotSize = 4;

class Graph extends React.Component {
  componentDidMount() {
    this.buildGraph();
  }
  componentDidUpdate() {
    this.buildGraph();
  }
  buildDatasets() {
    let dataset = [];
    Object.keys(this.props.companies).map( (symbol, idx) => {
      if (!this.props.companies[symbol]) return;   // we don't have data yet
      dataset.push({
        label: symbol,
        fill: false,
        borderColor: d3.scale.schemeCategory20[idx],
        backgroundColor: d3.scale.schemeCategory20[idx],
        data: this.props.companies[symbol],
        spanGaps: true,
        pointHitRadius: normalDotSize + 3,
        pointRadius: normalDotSize,
        pointHoverRadius: normalDotSize + 3
      });
    });
    return dataset;
  }
  makeDateLabels() {
    return this.props.dates.map( (val) => {
      val = val.split('T')[0].split('-');
      val.push(val.shift());
      return val.join('/');
    });
  }
  newGraph() {
    this.props.fnSetChart( new Chart(this.props.ctx, {
      type: 'line',
      data: {
        labels: this.makeDateLabels(),
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
    this.setupHoverText(hoverText, legendItem);
    
    let thisNode = this.props.chart.data.datasets[legendItem.datasetIndex];
    this.boldOneLine(thisNode);
    
    thisNode.timeout = window.setTimeout(() => {
      hoverText.remove();
      thisNode.pointRadius = normalDotSize;
      this.props.chart.update();
    }, 1000);
    
  }
  setupHoverText(hoverText, legendItem) {
    hoverText.onclick = () => {this.handleClick(legendItem);};
    hoverText.className = "hover-text";
    hoverText.style.left = event.x + 'px';
    hoverText.style.top = event.y + 'px';
    hoverText.innerText = "Click to remove this symbol";
    document.getElementById('stock-graph').parentElement.appendChild(hoverText);
  }
  boldOneLine(thisNode) {
    window.clearTimeout(thisNode.timeout);
    thisNode.pointRadius = normalDotSize + 2;
    this.props.chart.update();
  }  
  buildGraph() {
    if (!this.props.dates) {
      return;
    }
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
  render() {
    return (
      <canvas id='stock-graph' width="1000" height="500">
      </canvas>
    );
  }
}

module.exports = Graph;