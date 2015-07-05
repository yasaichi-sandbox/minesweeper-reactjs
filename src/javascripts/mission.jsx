import React from 'react'
import Radium from 'radium'
import Field from './field.jsx'
import MissionData from './mission_data.js'
import MissionStyle from './mission_style.js'

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
    this.loadDataFromServer()
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
      status: mineFound ? Mission.STATUS.FAILED : this.state.status
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
    let nextData = new MissionData({
      nRow: this.state.nRow,
      nCol: this.state.nCol,
      nMine: this.state.nMine
    }).build()

    this.setState({ data: nextData })
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
    )
  }
}

export default Radium(Mission)
