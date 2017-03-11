'use strict';

const React = require('React');

class MainBody extends React.Component {
  constructor(props) {
    super();
    this.state = {
      companies: this.getCompanies(props),
      startDate: this.startDate,
      endDate: this.endDate,
      timeSlices: this.timeSlices
    };
  }
  getCompanies(props) {
    // eventually we'll get this from web sockets
    // for now just take it from the props
    return props.companies;
  }
  render() {
    return (
      <div id='main-body'>
        <GraphButtons />
        <Graph />
        <CompanyHolder />
        <AddButton />
      </div>
    );
  }
}

module.exports = MainBody;