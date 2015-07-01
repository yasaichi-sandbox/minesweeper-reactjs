import React from 'react'
import Radium from 'radium'
import Grid from './grid.jsx'
import FieldStyle from '../stylesheets/field.js'

class Field extends React.Component {
  // TODO static propertiesを使いたい
  static get propTypes() {
    return {
      nRow: React.PropTypes.number.isRequired,
      nCol: React.PropTypes.number.isRequired,
      isImmutable: React.PropTypes.bool.isRequired,
      minedGridIds: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
      onMineFound: React.PropTypes.func.isRequired,
      onMineNotFound: React.PropTypes.func.isRequired,
    }
  }

  constructor(props) {
    super(props)
    let grids = []

    for(let i = 0; i < this.props.nRow * this.props.nCol; i++) {
      grids[i] = {
        id: i,
        isMined: this.props.minedGridIds.indexOf(i) >= 0,
        status: Grid.STATUS.UNMARKED,
        text: '',
      }
    }

    this.state = {
      grids: grids
    }
  }

  countNeighborMines(gridId) {
    let nRow = this.props.nRow
    let nCol = this.props.nCol
    let r = Math.floor(gridId / nCol)
    let c = gridId % nCol

    let neighborGridIds = [-1, 0, 1]
      .reduce((a, e) => a.concat([[r+e, c-1], [r+e, c], [r+e, c+1]]), [])
      .filter(c => 0 <= c[0] && c[0] < nRow && 0 <= c[1] && c[1] < nCol)
      .map(c => nCol * c[0] + c[1])
      .filter(id => id !== gridId)

    return neighborGridIds.filter(id => this.props.minedGridIds.indexOf(id) >= 0).length
  }

  handleMarking(gridId) {
    if(this.props.isImmutable) return

    let grid = this.state.grids[gridId]
    let newGrids = [].concat(this.state.grids)

    newGrids[grid.id] = {
      id: grid.id,
      isMined: grid.isMined,
      status: Grid.STATUS.MARKED,
      text: '?'
    }

    this.setState({ grids: newGrids })
  }

  handleRevealing(gridId) {
    if(this.props.isImmutable) return

    let grid = this.state.grids[gridId]
    let newGrids = [].concat(this.state.grids)

    newGrids[grid.id] = {
      id: grid.id,
      isMined: grid.isMined,
      status: Grid.STATUS.REVEALED,
      text: grid.isMined ? '●～*' : this.countNeighborMines(grid.id).toString()
    }

    this.setState({ grids: newGrids })

    if(grid.isMined) {
      this.props.onMineFound(grid.id)
    } else {
      this.props.onMineNotFound(grid.id)
    }
  }

  render() {
    let grids = this.state.grids.map(grid => {
      return (
        <Grid
          key={grid.id}
          id={grid.id}
          status={grid.status}
          onRevealing={this.handleRevealing.bind(this)}
          onMarking={this.handleMarking.bind(this)}>
          {grid.text}
        </Grid>
      )
    })

    let styles = [
      FieldStyle.base,
      FieldStyle.shape(this.props.nRow, this.props.nCol)
    ]

    return (
      <div style={styles}>
        {grids}
      </div>
    )
  }
}

export default Radium(Field)
