'use strict';

const React = require('React');

class GraphButtons extends React.Component {
  clickSetButton(event, daysBack) {
    // return if it's already selected
    console.log('clicked');	
    console.log(event.target);	
    let button = event.target;
    let lastClasses = button.className.split(' ');
    if (lastClasses.includes('active-button')) return;
    // unselect all selected
    let selected = document.getElementsByClassName('active-button')
    for (let i=0; i<selected.length; i++ ) {
      let classList = selected[i].className.split(' ');
      classList.splice(classList.indexOf('active-button'), 1);
      selected[i].classList = [classList.join(' ')];
    } 
    // select this button
    lastClasses.push('active-button');
    button.classList = [lastClasses.join(' ')];
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
            onClick={(event) => this.clickSetButton(event)}
          >Last 10 Years</div>
          <div
            id='last-5-years' 
            key='last-5-years'
            type="button"
            className="button"
            onClick={(event) => this.clickSetButton(event)}
          >Last 5 Years</div>
          <div
            id='last-year' 
            key='last-year'
            type="button"
            className="button"
            onClick={(event) => this.clickSetButton(event)}
          >Last Year</div>
          <div
            id='last-6-months' 
            key='last-6-months'
            type="button"
            className={"button active-button"}
            onClick={(event) => this.clickSetButton(event)}
          >Last 6 Months</div>
          <div
            id='last-month' 
            key='last-month'
            type="button"
            className="button"
            onClick={(event) => this.clickSetButton(event)}
          >Last Month</div>
        </div>
        <div id='custom-times-container' key='custom'>
          <p key='setTimes'>Last 10 years, last 5 years, last year, last 6 months, last months, last week</p>
          <p key='chooseDates'>First Date | Last Date</p>
        </div>
      </div>
    );
  }
}

module.exports = GraphButtons;