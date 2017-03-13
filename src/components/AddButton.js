'use strict';

const React = require('React');

const MatchingCompany = require('./MatchingCompany.js'); // eslint-disable-line

class AddButton extends React.Component {
  render() {
    // check for the error and no companies first
    let matches = [];
    this.props.matchingCompanies.forEach((val, idx) => {
      //val should be object with Symbol, Name, Exchange
      if (idx > 20) return;   // max 20 results
      matches.push(
        <MatchingCompany 
          symbol={val.Symbol}
          name={val.Name}
          exchange={val.Exchange}
          idx={idx}
          fnClick={() => this.props.fnAddCompany(val.Symbol, true)}
          key={val.Symbol + idx}
        />
      );
    }); 
    return (
      <div id='add-button'> 
        <div className={"search-bar"} key="search-bar">
          <input 
            type="text" 
            className="search-text" 
            placeholder="add a symbol"
            onFocus={(event) => {
              document.querySelector('.matches-holder').classList = ['matches-holder fade-in'];
              event.target.select();
            }}
            onChange={this.props.fnSearchSymbols}
            onBlur={() => {
              document.querySelector('.matches-holder').classList = ['matches-holder fade-away'];
            }}
            key="text"
          >
          </input>
          <i 
            className={"fa fa-search"}
            onClick={()=>document.querySelector('.search-text').focus()}
            key="icon"
          >
          </i>
        </div>
        <div className="matches-holder" key="matches-holder">
          {matches}
        </div>
      </div>
    );
  }
}

module.exports = AddButton;