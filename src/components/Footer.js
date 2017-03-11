const React = require('react');

class Footer extends React.Component {
  render() {
    return (
      <div id='footer'>
        <hr className="footer-bar" key="bar"/>
        <br key="br" />
        <p className="footer-text" key="text">Created special for you by HogDog Designs</p>
      </div>
    );
  }
}

module.exports = Footer;