import React from 'react'
import Radium from 'radium'
import ConsoleStyle from './console_style.js'

class Console extends React.Component {
  static get propTypes() {
    return {
      nRows: React.PropTypes.arrayOf(React.PropTypes.number),
      nCols: React.PropTypes.arrayOf(React.PropTypes.number),
      nMines: React.PropTypes.arrayOf(React.PropTypes.number),
      onParamsChange: React.PropTypes.func.isRequired,
      params: React.PropTypes.shape({
        nRow: React.PropTypes.number.isRequired,
        nCol: React.PropTypes.number.isRequired,
        nMine: React.PropTypes.number.isRequired
      })
    }
  }

  static get defaultProps() {
    return {
      nRows: [5, 6, 7, 8, 9, 10],
      nCols: [5, 6, 7, 8, 9, 10],
      nMines: [5, 10, 15, 20, 25]
    }
  }

  buildSelectBoxOf(paramName) {
    let optionValues = this.props[`${paramName}s`]

    return (
      <select defaultValue={this.props.params[paramName]} ref={paramName}>
        {optionValues.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
    )
  }

  handleSubmit(e) {
    e.preventDefault()

    let nextParams = {
      nRow: Number(this.refs.nRow.getDOMNode().value),
      nCol: Number(this.refs.nCol.getDOMNode().value),
      nMine: Number(this.refs.nMine.getDOMNode().value)
    }

    let nRowIsValid = this.props.nRows.indexOf(nextParams.nRow) >= 0
    let nColIsValid = this.props.nCols.indexOf(nextParams.nCol) >= 0
    let nMineIsValid = this.props.nMines.indexOf(nextParams.nMine) >= 0

    if(nRowIsValid && nColIsValid && nMineIsValid) {
      this.props.onParamsChange(nextParams)
    }
  }

  render() {
    return (
      <form
        style={ConsoleStyle.base}
        onSubmit={this.handleSubmit.bind(this)}>
        <ul style={ConsoleStyle.ul}>
          <li style={[ConsoleStyle.li.base, ConsoleStyle.li.notLastChild]}>
            {this.buildSelectBoxOf('nRow')}
            <span> x </span>
            {this.buildSelectBoxOf('nCol')}
          </li>
          <li style={ConsoleStyle.li.base}>
            <span>●～*</span>
            <span> x </span>
            {this.buildSelectBoxOf('nMine')}
          </li>
        </ul>
        <input type='submit' value='Start!' />
      </form>
    )
  }
}

export default Radium(Console)
