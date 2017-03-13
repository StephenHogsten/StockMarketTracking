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
    console.log('triggered mount');
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
        pointRadius: 4
      });
      console.log('symbol' + symbol);
      console.log('idx' + idx);
      console.log(d3.scale.schemeCategory20[idx]);
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
    console.log('we are atualy making one now');
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
    // Chart.defaults.global.defaultColor = '#3C5A5B';
    Chart.defaults.global.defaultFontColor = '#3C5A5B';
  }
  buildGraph() {
    console.log('building new graph');
    if (!this.props.dates) {
      console.log('no dates yet');
      console.log(this.props);
      return;
    }
    if (!this.props.ctx) {
      console.log('no ctx');
      this.props.fnSetCtx();
      return;     // this will retrigger update anyway
    }
    console.log('ctx: ' + this.props.ctx);
    if (!this.props.chart) {
      console.log('no chart - well make one');
      if (this.props.fnShouldMakeNewChart()) { this.newGraph(); }
      return;
    }
    console.log('we actually can update a graph');
    this.props.chart.data.datasets = this.buildDatasets();
    this.props.chart.update();
  }
  render() {
    // expect props.data to be 
    return (
      <canvas id='stock-graph' width="1000" height="500">
      </canvas>
    );
  }
}

module.exports = Graph;