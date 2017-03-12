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
  buildGraph() {
    if (!this.ctx) this.ctx = document.getElementById('stock-graph');
    new Chart(this.ctx, {
      type: 'line',
      data: {

      },
      options: {
        
      }
    });
  }
  render() {
    // expect props.data to be {
    return (
      <canvas id='stock-graph' width="1000" height="500">
      </canvas>
    );
  }
}

module.exports = Graph;