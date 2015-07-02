import React from 'react';
import Radium from 'radium'
import Field from './field.jsx';
import MissionStyle from '../stylesheets/mission.js'

class Mission extends React.Component {
  static get STATUS() {
    return {
      ONGOING: 0,
      FAILED: 1,
      COMPLETE: 2
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      nRow: 5,
      nCol: 5,
      nMine: 5,
      status: Mission.STATUS.ONGOING,
      revealedGridIds: []
    };

    this.state.minedGridIds = Array
      .apply(null, { length: this.nGrid })
      .map(Number.call, Number)
      .sort(() => Math.random() - 0.5)
      .slice(0, this.state.nMine)
  }

  get nGrid() {
    return this.state.nRow * this.state.nCol
  }

  get isComplete() {
    return (
      this.state.revealedGridIds.length === this.nGrid - this.state.nMine &&
      this.state.revealedGridIds.every(id => this.state.minedGridIds.indexOf(id) < 0)
    )
  }

  componentDidUpdate() {
    if(this.state.status === Mission.STATUS.COMPLETE) {
      alert('Mission Complete!')
    } else if(this.state.status === Mission.STATUS.FAILED) {
      alert('Mission Failed!')
    } else if(this.isComplete) {
      this.setState({ status: Mission.STATUS.COMPLETE })
    }
  }

  handleMineNotFound(gridId) {
    let newGridIds = this.state.revealedGridIds.concat([gridId])
    this.setState({ revealedGridIds: newGridIds })
  }

  handleMineFound(gridId) {
    let newGridIds = this.state.revealedGridIds.concat([gridId])

    this.setState({
      status: Mission.STATUS.FAILED,
      revealedGridIds: newGridIds
    })
  }

  render() {
    return (
      <div style={MissionStyle.base}>
        <Field
          nRow={this.state.nRow}
          nCol={this.state.nCol}
          isImmutable={this.state.status !== Mission.STATUS.ONGOING}
          minedGridIds={this.state.minedGridIds}
          onMineFound={this.handleMineFound.bind(this)}
          onMineNotFound={this.handleMineNotFound.bind(this)}
        />
      </div>
    );
  }
}

export default Radium(Mission);
