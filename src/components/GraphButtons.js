'use strict';

const React = require('React');
const Pikaday = require('pikaday');
// const moment = require('moment'); // eslint-disable-line

class GraphButtons extends React.Component {
  clickStaticButton(event, numberBack, unitsBack='days') {
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
    this.props.fnStaticTimeChange(numberBack, unitsBack);
  }
  unselectAll() {
    let selected = document.getElementsByClassName('active-button');
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
      <div id='graph-buttons' key="GraphButtons">
        <div id='set-times-container' key='set'>
          <div
            id='last-5-years' 
            key='last-5-years'
            type="button"
            className="button"
            onClick={(event) => this.clickStaticButton(event, 5, 'years')}
          >Last 5 Years</div>
          <div
            id='last-year' 
            key='last-year'
            type="button"
            className="button"
            onClick={(event) => this.clickStaticButton(event, 1, 'years')}
          >Last Year</div>
          <div
            id='last-6-months' 
            key='last-6-months'
            type="button"
            className={"button"}
            onClick={(event) => this.clickStaticButton(event, 6, 'months')}
          >Last 6 Months</div>
          <div
            id='last-90-days' 
            key='last-90-days'
            type="button"
            className={"button active-button"}
            onClick={(event) => this.clickStaticButton(event, 90)}
          >Last 90 Days</div>
          <div
            id='last-month' 
            key='last-month'
            type="button"
            className="button"
            onClick={(event) => this.clickStaticButton(event, 1, 'months')}
          >Last Month</div>
        </div>
        <div id='custom-times-container' key='custom'>
          <input 
            id='start-date' 
            key='start-date' 
            placeholder='choose start date'
            value={this.props.startDate.calendar()}
            readOnly
          >
          </input>
          <span key='dash'>-</span>
          <input 
            id='end-date' 
            key='end-date' 
            placeholder='choose end date'
            value={this.props.endDate.format('MM/DD/YYYY')}
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
    let start = new Pikaday({
      field: document.getElementById('start-date'),
      format: momentFormat,
      disableWeekends: true,
      yearRange: [thisYear-10, thisYear],
      maxDate: today,
      onSelect: () => this.setDynamicDates('start-date')
    });
    //end date
    let end = new Pikaday({
      field: document.getElementById('end-date'),
      format: momentFormat,
      disableWeekends: true,
      yearRange: [thisYear-10, thisYear],
      maxDate: today,
      onSelect: () => this.setDynamicDates('end-date')
    });
    this.props.fnSetPickers(start, end);
  }
  componentDidUpdate() {
    this.props.startPicker.setMoment(this.props.startDate, true);
    this.props.endPicker.setMoment(this.props.endDate, true);
  }
}

module.exports = GraphButtons;