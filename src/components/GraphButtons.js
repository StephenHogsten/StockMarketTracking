'use strict';

const React = require('React');

class GraphButtons extends React.Component {
  render() {
    return (
      <div id='graph-button'>
        <div 
          className='btn' 
          key='test-add'
          onClick={() => {
            console.log('add clicked');
            this.props.socket.emit('addCompanyClient', 'AAPL')
          }}
        >Add</div>
        <div 
          className='btn' 
          key='test-remove'
          onClick={() => {
            console.log('remove clicked');
            this.props.socket.emit('removeCompanyClient', 'AAPL')
          }}
        >Remove</div>
        <p key='setTimes'>Last 10 years, last 5 years, last year, last 6 months, last months, last week</p>
        <p key='chooseDates'>First Date | Last Date</p>
      </div>
    );
  }
}

module.exports = GraphButtons;