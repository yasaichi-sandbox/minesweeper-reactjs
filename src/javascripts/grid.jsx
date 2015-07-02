import React from 'react'
import Radium from 'radium'
import GridStyle from '../stylesheets/grid.js'

class Grid extends React.Component {
  static get STATUS() {
    return {
      UNMARKED: 0,
      MARKED: 1,
      REVEALED: 2
    }
  }

  static get propTypes() {
    return {
      id: React.PropTypes.number.isRequired,
      status: React.PropTypes.number.isRequired,
      onMarking: React.PropTypes.func.isRequired,
      onRevealing: React.PropTypes.func.isRequired
    }
  }

  handleContextMenu(e) {
    e.preventDefault()
  }

  handleMouseDown(e) {
    if(e.button === 0 && this.props.status !== Grid.STATUS.REVEALED) {
      this.props.onRevealing(this.props.id)
    } else if(e.button === 2 && this.props.status === Grid.STATUS.UNMARKED) {
      this.props.onMarking(this.props.id)
    }
  }

  render() {
    return (
      <div
        style={GridStyle.base}
        onContextMenu={this.handleContextMenu}
        onMouseDown={this.handleMouseDown.bind(this)}>
        {this.props.children}
      </div>
    )
  }
}

export default Radium(Grid)
