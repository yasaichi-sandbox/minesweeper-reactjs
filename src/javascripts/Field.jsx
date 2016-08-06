import bindAll from 'lodash.bindall';
import React from 'react';
import Radium from 'radium';
import Grid from './Grid';
import FieldStyle from './FieldStyle';

class Field extends React.Component {
  // TODO static propertiesを使いたい
  static get propTypes() {
    return {
      data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
      shape: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
      isMutable: React.PropTypes.bool.isRequired,
      onRevealing: React.PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);
    bindAll(this, ['handleMarking', 'handleUnmarking']);

    this.state = {
      markedGridIds: new Set(),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.every(grid => !grid.isRevealed)) {
      this.setState({ markedGridIds: new Set() });
    }
  }

  // TODO このメソッドはここに書くべきではない気がする
  getStatusOf(grid) {
    if (this.state.markedGridIds.has(grid.id)) {
      return Grid.STATUS.MARKED;
    } else if (grid.isRevealed) {
      return Grid.STATUS.REVEALED;
    } else {
      return Grid.STATUS.UNMARKED;
    }
  }

  handleMarking(gridId) {
    const nextMarkedGridIds = new Set(this.state.markedGridIds).add(gridId);
    this.setState({ markedGridIds: nextMarkedGridIds });
  }

  handleUnmarking(gridId) {
    const nextMarkedGridIds = new Set(this.state.markedGridIds);
    nextMarkedGridIds.delete(gridId);

    this.setState({ markedGridIds: nextMarkedGridIds });
  }

  render() {
    const isMutable = this.props.isMutable;
    let onMarking = isMutable ? this.handleMarking : () => {};
    let onRevealing = isMutable ? this.props.onRevealing : () => {};
    let onUnmarking = isMutable ? this.handleUnmarking : () => {};

    let grids = this.props.data.map(grid => {
      return (
        <Grid
          key={grid.id}
          id={grid.id}
          number={grid.number}
          status={this.getStatusOf(grid)}
          isMined={grid.isMined}
          onMarking={onMarking}
          onRevealing={onRevealing}
          onUnmarking={onUnmarking}
        />
      );
    });

    return (
      <div style={[FieldStyle.base, FieldStyle.shape(...this.props.shape)]}>
        {grids}
      </div>
    );
  }
}

export default Radium(Field);
