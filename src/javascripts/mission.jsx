import React from 'react'
import Radium from 'radium'
import Console from './console.jsx'
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

  // TODO JSON APIサーバーを実装してそこから読み込むようにする
  static getDataFromServer(params) {
    return new MissionData(params).build().map(grid => {
      grid.isRevealed = false
      return grid
    })
  }

  constructor(props) {
    super(props)

    this.state = {
      data: [],
      params: { nRow: 5, nCol: 5, nMine: 5 },
      status: this.constructor.STATUS.ONGOING
    }
  }

  componentDidMount() {
    let nextData = this.constructor.getDataFromServer(this.state.params)
    this.setState({ data: nextData })
  }

  componentDidUpdate() {
    if(this.state.status === this.constructor.STATUS.COMPLETE) {
      alert('Mission Complete!')
    } else if(this.state.status === this.constructor.STATUS.FAILED) {
      alert('Mission Failed!')
    } else if(this.isComplete()) {
      this.setState({ status: this.constructor.STATUS.COMPLETE })
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

  handleParamsChange(nextParams) {
    let nextData = this.constructor.getDataFromServer(nextParams)

    this.setState({
      data: nextData,
      params: nextParams,
      status: this.constructor.STATUS.ONGOING
    })
  }

  isComplete() {
    return (
      this.state.data.every(grid => {
        return grid.isRevealed && !grid.isMined || !grid.isRevealed && grid.isMined
      })
    )
  }

  render() {
    return (
      <div style={MissionStyle.base}>
        <Console
          onParamsChange={this.handleParamsChange.bind(this)}
          params={this.state.params}
        />
        <Field
          data={this.state.data}
          shape={[this.state.params.nRow, this.state.params.nCol]}
          isMutable={this.state.status === this.constructor.STATUS.ONGOING}
          onRevealing={this.handleRevealing.bind(this)}
        />
      </div>
    )
  }
}

export default Radium(Mission)
