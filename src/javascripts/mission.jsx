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
    super(props)

    this.state = {
      nRow: 5,
      nCol: 5,
      nMine: 5,
      data: [],
      status: this.constructor.STATUS.ONGOING
    }
  }

  componentDidMount() {
    this.loadDataFromServer();
  }

  componentDidUpdate() {
    if(this.state.status === Mission.STATUS.COMPLETE) {
      alert('Mission Complete!')
    } else if(this.state.status === Mission.STATUS.FAILED) {
      alert('Mission Failed!')
    } else if(this.isComplete()) {
      this.setState({ status: Mission.STATUS.COMPLETE })
    }
  }

  handleRevealing(gridId) {
    let targetGrid = this.state.data.filter(grid => grid.id === gridId).shift()
    let mineFound = targetGrid.isMined

    let nextData = this.state.data.map(grid => {
      if(mineFound && grid.isMined || grid.id === targetGrid.id) grid.isRevealed = true
      return grid
    })

    this.setState({
      data: nextData,
      status: mineFound ? Mission.STATUS.FAILED : Mission.STATUS.ONGOING
    })
  }

  isComplete() {
    return (
      this.state.data.every(grid => {
        return grid.isRevealed && !grid.isMined || !grid.isRevealed && grid.isMined
      })
    )
  }

  // TODO JSON APIサーバーを実装してそこから読み込むようにする
  loadDataFromServer() {
    let data = Array
      .apply(null, { length: this.state.nRow * this.state.nCol })
      .map(Number.call, Number)
      .map(i => {
        return {
          id: i,
          isMined: [0,1,2,3,4].indexOf(i) >= 0,
          isRevealed: false,
          number: [5,6,7,8,9].indexOf(i) >= 0 ? 1 : 0
        }
      })

    this.setState({ data: data })
  }

  render() {
    return (
      <div style={MissionStyle.base}>
        <Field
          data={this.state.data}
          shape={[this.state.nRow, this.state.nCol]}
          isMutable={this.state.status === this.constructor.STATUS.ONGOING}
          onRevealing={this.handleRevealing.bind(this)}
        />
      </div>
    );
  }
}

export default Radium(Mission);
