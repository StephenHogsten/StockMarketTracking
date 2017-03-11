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
* [ ] sketch static outline for the page in React
* [ ] what do they mean you need web sockets
  * [ ] test a socket server
* [ ] figure out how to dynamically query for a time range
  * [ ] first use one stock, and get one specific call
  * [ ] make a function for it to work for multiple stocks
  * [ ] make the function accept a time range and get appropriate dates in the middle
  * [ ] make function accept mulitple quotes to query
* [ ] display the data
  * [ ] use d3 to appropriately add the points for a set amount of data
  * [ ] add the legend and the axes / make it pretty
  * [ ] add hover bubble
* [ ] make it interactable
  * [ ] be able to add / remove stocks
  * [ ] be able to choose a new time range

## Enhancement Ideas
* [ ] save off specific set-ups to return to later
* [ ] ability to zoom and drag on graph