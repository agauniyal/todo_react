import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Link extends Component {
  static contextTypes = {
    route: PropTypes.string,
    linkHandler: PropTypes.func
  };

  handleClick = e => {
    e.preventDefault();
    this.context.linkHandler(this.props.to);
  };

  render() {
    return (
      <a href="#" onClick={this.handleClick}>
        {this.props.children}
      </a>
    );
  }
}

Link.propTypes = {
  to: PropTypes.string.isRequired
};
