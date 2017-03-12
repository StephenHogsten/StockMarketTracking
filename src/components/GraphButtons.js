'use strict';

const React = require('React');

class GraphButtons extends React.Component {
  render() {
    return (
      <div id='graph-button'>
        <p key='setTimes'>Last 10 years, last 5 years, last year, last 6 months, last months, last week</p>
        <p key='chooseDates'>First Date | Last Date</p>
      </div>
    );
  }
}

module.exports = GraphButtons;