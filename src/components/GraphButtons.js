'use strict';

const React = require('React');
const Pikaday = require('pikaday');
// const moment = require('moment'); // eslint-disable-line

class GraphButtons extends React.Component {
  clickStaticButton(event, daysBack) {
    // return if it's already selected
    let button = event.target;
    let lastClasses = button.className.split(' ');
    if (lastClasses.includes('active-button')) return;
    // unselect all selected
    this.unselectAll();
    // select this button
    lastClasses.push('active-button');
    button.classList = [lastClasses.join(' ')];
    // trigger the time range change
    this.props.fnStaticTimeChange(daysBack);
  }
  unselectAll() {
    let selected = document.getElementsByClassName('active-button')
    for (let i=0; i<selected.length; i++ ) {
      let classList = selected[i].className.split(' ');
      classList.splice(classList.indexOf('active-button'), 1);
      selected[i].classList = [classList.join(' ')];
    } 
  }
  setDynamicDates(fromId) {
    let startDate = document.getElementById('start-date').value;
    let endDate = document.getElementById('end-date').value;
    if (!startDate || !endDate) return;   // we don't have both endpoints
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    if (!startDate || !endDate) return;   // we don't have both endpoints as dates
    if (startDate > endDate) {            // we don't have a valid set
      document.getElementById(fromId).value = "";
      document.getElementById(fromId).placeholder = "start must be less than end";
      return;
    }
    this.unselectAll();
    this.props.fnDynamicTimeChange(startDate, endDate);
  }
  render() {
    return (
      <div id='graph-buttons'>
        <div id='set-times-container' key='set'>
          <div
            id='last-10-years' 
            key='last-10-years'
            type="button"
            className="button"
            onClick={(event) => this.clickStaticButton(event, 10*365)}
          >Last 10 Years</div>
          <div
            id='last-5-years' 
            key='last-5-years'
            type="button"
            className="button"
            onClick={(event) => this.clickStaticButton(event, 5*365)}
          >Last 5 Years</div>
          <div
            id='last-year' 
            key='last-year'
            type="button"
            className="button"
            onClick={(event) => this.clickStaticButton(event, 365)}
          >Last Year</div>
          <div
            id='last-6-months' 
            key='last-6-months'
            type="button"
            className={"button active-button"}
            onClick={(event) => this.clickStaticButton(event, 183)}
          >Last 6 Months</div>
          <div
            id='last-month' 
            key='last-month'
            type="button"
            className="button"
            onClick={(event) => this.clickStaticButton(event, 31)}
          >Last Month</div>
        </div>
        <div id='custom-times-container' key='custom'>
          <input 
            id='start-date' 
            key='start-date' 
            placeholder='choose start date'
            readOnly
          >
          </input>
          <input 
            id='end-date' 
            key='end-date' 
            placeholder='choose end date'
            readOnly
          >
          </input>
        </div>
      </div>
    );
  }
  componentDidMount() {
    let today = new Date();
    let thisYear = today.getFullYear();
    let momentFormat = 'MM/DD/YYYY';
    //start date
    new Pikaday({
      field: document.getElementById('start-date'),
      format: momentFormat,
      disableWeekends: true,
      yearRange: [thisYear-10, thisYear],
      maxDate: today,
      onSelect: () => this.setDynamicDates('start-date')
    });
    //end date
    new Pikaday({
      field: document.getElementById('end-date'),
      format: momentFormat,
      disableWeekends: true,
      yearRange: [thisYear-10, thisYear],
      maxDate: today,
      onSelect: () => this.setDynamicDates('end-date')
    });
  }
  componentDidUpdate() {
    if (document.getElementsByClassName('active-button').length > 0) {
      ['start-date', 'end-date'].forEach( (val) => document.getElementById(val).value = "" );
    }
  }
}

module.exports = GraphButtons;