import React from 'react';
import Radium from 'radium'
import Field from './field.jsx';
import MissionStyle from '../stylesheets/mission.js'

class Mission extends React.Component {
  static get STATUS() {
    return {
      ONGOING: 'Ongoing',
      FAILED: 'Failed',
      COMPLETE: 'Complete'
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
      .apply(null, { length: this.state.nRow * this.state.nCol })
      .map(Number.call, Number)
      .sort(() => Math.random() - 0.5)
      .slice(0, this.state.nMine)

    console.log(this.state.minedGridIds)
  }

  isCompleteUnder(revealedGridIds) {
    let nGrid = this.state.nRow * this.state.nCol

    return (
      revealedGridIds.length === nGrid - this.state.nMine &&
      revealedGridIds.every(id => this.state.minedGridIds.indexOf(id) < 0)
    )
  }

  handleMineNotFound(gridId) {
    let newGridIds = this.state.revealedGridIds.concat([gridId])
    this.setState({ revealedGridIds: newGridIds })

    // TODO newGridIdsを必要としない実装を考える
    if(this.isCompleteUnder(newGridIds)) {
      this.setState({ status: Mission.STATUS.COMPLETE })
    }
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
        <div style={{ textAlign: 'center' }}>{this.state.status}</div>
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
