# Stock Market App
This is for the FreeCodeCamp [Chart the Stock Market](https://www.freecodecamp.com/challenges/chart-the-stock-market) project.

## New Skills for HogDog to practice on this project
* Gulp
  * correct linting
  * auto-refreshing / restarting server 
  * prefixing
  * modularized CSS
* Templates (or just serving React)
  * Redux?
  * React router?
* [socket.io](https://github.com/socketio/socket.io)
* Animation
* [Flex box](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes)

## To Do for Submission
* [X] find a stock market data source
  * [X] quotes and EOD based on date
  * [X] get a representative json
  * [X] make sure we can retrieve the time range we need (day is fine)
* [X] read up on redux / deploying react
* [X] read up on gulp
  * [X] read a bunch of background info
  * [X] sketch out order of things that should happen (with folder structure)
  * [X] break down pieces I can do in order
* [X] server js
  * [X] html
  * [X] css
  * [X] client js (hardest one!)
* [X] make app shell 
* [X] sketch static outline for the page in React
* [X] what do they mean you need web sockets
  * [X] test a socket server
  * [X] make it read the current socket list
* [X] figure out how to dynamically query for a time range
  * [X] first use one stock, and get one specific call
  * [X] make a function for it to work for multiple stocks
  * [X] make the function accept a time range and get appropriate dates in the middle
  * [X] make function accept mulitple quotes to query ( note: made it loop through state)
* [X] display the data (note i just used chart.js again)
* [X] make it interactable
  * [X] move the legend out
  * [X] be able to remove stocks
  * [X] be able to add stocks
  * [X] be able to choose locked time ranges
  * [X] be able to choose custom time range
  * [X] display error for no matching symbols
* [X] deploy to heroku
* [X] clean up round 1
  * [X] time data
    * [X] the graph shouldn't be wrong if there's incomplete time data
    * [X] space between days
    * [X] save off total time range
    * [X] block more clicks or something for clicking before we get the next data back
  * [X] make it prettier
  * [X] better control over redrawing graph
  * [X] handle too many search queries too quickly?
  * [X] default the button dates better
* [X] clean up round 2
  * [X] refactor if necessary
  * [X] clean out unnecessary logs
* [ ] check on mobile 

## Enhancement Ideas
* [ ] save off specific set-ups to return to later
* [ ] ability to zoom and drag on graph
* [ ] handle not adding too many stocks (i.e. max of 100 dates added)
* [ ] make the company data API handle weird errors (RJI exists but doesn't return any data, identify errors)
* [ ] handle edge case timing with removing symbols
* [ ] make the pop-up display all open data (bold the active one)
* [ ] visual cue of someone else's update
