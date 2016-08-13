import bindAll from 'lodash.bindall';
import React from 'react';
import styles from './style.css';

export default class Grid extends React.Component {
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
    if (this.isMarked) {
      return '';
    } else if (this.isUnmarked || !this.isRevealed) {
      return null;
    } else if (this.props.isMined) {
      return '';
    } else if (this.props.number === 0) {
      return null;
    }

    return this.props.number.toString();
  }

  get styleClassName() {
    if (this.isMarked) {
      return 'marked';
    } else if (this.isUnmarked) {
      return 'unmarked';
    } else if (!this.isRevealed) {
      return null;
    } else if (this.props.isMined) {
      return 'mined';
    } else if (this.props.number === 0) {
      return 'revealed';
    }

    return `number${this.props.number}`;
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
        className={styles[this.styleClassName]}
        onContextMenu={this.handleContextMenu}
        onMouseDown={this.handleMouseDown}
      >
        {this.statusText}
      </div>
    );
  }
}
