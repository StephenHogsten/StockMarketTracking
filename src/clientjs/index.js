const Header = require('../components/Header.js');  // eslint-disable-line
const Footer = require('../components/Footer.js');  // eslint-disable-line
const MainBody = require('../components/MainBody.js');  // eslint-disable-line
const ReactDOM = require('react-dom');
const React = require('react'); // eslint-disable-line

ReactDOM.render(
  <div>
    <Header title="Stock Watch" key="header" />
    <MainBody key="MainBody" />
    <Footer key="footer" />
  </div>
  , document.getElementById('react-shell')
);
