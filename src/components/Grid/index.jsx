import bindAll from 'lodash.bindall';
import React from 'react';
import Radium from 'radium';
import styles from './style';

class Grid extends React.Component {
  static get STATUS() {
    return {
      UNMARKED: 0,
      MARKED: 1,
      REVEALED: 2
    };
  }

  static get propTypes() {
    return {
      id: React.PropTypes.number.isRequired,
      number: React.PropTypes.number.isRequired,
      status: React.PropTypes.number.isRequired,
      isMined: React.PropTypes.bool.isRequired,
      onMarking: React.PropTypes.func.isRequired,
      onRevealing: React.PropTypes.func.isRequired,
      onUnmarking: React.PropTypes.func.isRequired
    };
  }

  constructor(props) {
    super(props);
    bindAll(this, ['handleMouseDown']);
  }

  get isMarked() {
    return this.props.status === this.constructor.STATUS.MARKED;
  }

  get isRevealed() {
    return this.props.status === this.constructor.STATUS.REVEALED;
  }

  get isUnmarked() {
    return this.props.status === this.constructor.STATUS.UNMARKED;
  }

  get statusText() {
    if (this.isRevealed) {
      return this.props.isMined ? '●～*' : this.props.number.toString();
    } else if (this.isMarked) {
      return '?';
    }

    return '';
  }

  handleContextMenu(e) {
    e.preventDefault();
  }

  handleMouseDown(e) {
    if (e.button === 0 && this.isUnmarked) {
      this.props.onRevealing(this.props.id);
    } else if (e.button === 2 && this.isUnmarked) {
      this.props.onMarking(this.props.id);
    } else if (e.button === 2 && this.isMarked) {
      this.props.onUnmarking(this.props.id);
    }
  }

  render() {
    return (
      <div
        style={styles.base}
        onContextMenu={this.handleContextMenu}
        onMouseDown={this.handleMouseDown}
      >
        {this.statusText}
      </div>
    );
  }
}

export default Radium(Grid);
