'use strict';
const React = require('React');
const Chart = require('chart.js');
const d3 = {
  scale: require('d3-scale'),
  axis: require('d3-axis'),
  request: require('d3-request')
};

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
        pointHoverRadius: 6,
        pointRadius: 3.5
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
        }
      }
    }));
    Chart.defaults.global.defaultFontColor = '#3C5A5B';
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