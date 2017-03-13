'use strict';

const React = require('React');

class MatchingCompany extends React.Component {
  render() {
    return (
      <div className="matching-company" onClick={() => this.props.fnClick()}>
        <span className='matching-company-symbol' key="symbol">
          {this.props.symbol + ' '}
        </span>
        <span className='matching-company-name' key="info">
          {this.props.name}
        </span>
        <br key='br' />
        <span className='matching-company-exchange' key='exchange'>
          {'  ' + this.props.exchange}
      </span>
      </div>
    );
  }
}

module.exports = MatchingCompany;