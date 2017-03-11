const Header = require('../components/Header.js');  // eslint-disable-line
const Footer = require('../components/Footer.js');  // eslint-disable-line
const ReactDOM = require('react-dom');
const React = require('react'); // eslint-disable-line

ReactDOM.render(
  <div>
    <Header title="Stock Watch" key="header" />
    <Footer footer="footer" />
  </div>
  , document.getElementById('react-shell')
);

