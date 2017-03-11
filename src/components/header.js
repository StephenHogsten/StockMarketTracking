const React = require('react');

class Header extends React.Component {
  render() {
    return (
      <div className='my-header'>
        <h1>{this.props.title}</h1>
      </div>
    );
  }
}

module.exports = Header;