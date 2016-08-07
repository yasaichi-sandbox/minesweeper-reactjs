import bindAll from 'lodash.bindall';
import React from 'react';
import Radium from 'radium';
import Console from './Console';
import Field from './Field';
import MissionData from './MissionData';
import MissionStyle from './MissionStyle';

class Mission extends React.Component {
  static get STATUS() {
    return {
      ONGOING: 0,
      FAILED: 1,
      COMPLETE: 2,
    };
  }

  // TODO JSON APIサーバーを実装してそこから読み込むようにする
  static getDataFromServer(params) {
    return new MissionData(params).build().map(grid => {
      grid.isRevealed = false;
      return grid;
    });
  }

  constructor(props) {
    super(props);
    bindAll(this, ['handleParamsChange', 'handleRevealing']);

    this.state = {
      data: [],
      params: { nRow: 5, nCol: 5, nMine: 5 },
      status: this.constructor.STATUS.ONGOING,
    };
  }

  componentDidMount() {
    const nextData = this.constructor.getDataFromServer(this.state.params);
    this.setState({ data: nextData });
  }

  componentDidUpdate() {
    if (this.state.status === this.constructor.STATUS.COMPLETE) {
      alert('Mission Complete!');
    } else if (this.state.status === this.constructor.STATUS.FAILED) {
      alert('Mission Failed!');
    } else if (this.isComplete()) {
      this.setState({ status: this.constructor.STATUS.COMPLETE });
    }
  }

  findGridById(gridId) {
    return this.state.data.filter(grid => grid.id === gridId).shift();
  }

  handleRevealing(gridId) {
    const grid = this.findGridById(gridId);

    if (grid.isMined) {
      this.revealAllMinedGrids();
      this.setState({ status: this.constructor.STATUS.FAILED });
    } else {
      this.revealGridsRecursivelyFrom(grid);
    }
  }

  handleParamsChange(nextParams) {
    const nextData = this.constructor.getDataFromServer(nextParams);

    this.setState({
      data: nextData,
      params: nextParams,
      status: this.constructor.STATUS.ONGOING,
    });
  }

  isComplete() {
    return (
      this.state.data.every(grid => {
        return (grid.isRevealed && !grid.isMined) || (!grid.isRevealed && grid.isMined);
      })
    );
  }

  revealAllMinedGrids() {
    const nextData = this.state.data.map(grid => {
      if (grid.isMined) grid.isRevealed = true;
      return grid;
    });

    this.setState({ data: nextData });
  }

  revealGridsRecursivelyFrom(sourceGrid) {
    const targetGridIds = this.searchSafeGridIdsRecursivelyFrom(sourceGrid);

    const nextData = this.state.data.map(grid => {
      if (targetGridIds.has(grid.id)) grid.isRevealed = true;
      return grid;
    });

    this.setState({ data: nextData });
  }

  // TODO 見通し悪すぎなのでリファクタリングする
  searchSafeGridIdsRecursivelyFrom(sourceGrid, accumulator = {}) {
    if (sourceGrid.isMined) return new Set();

    if (accumulator.safeGridIds && accumulator.searchedGridIds) {
      accumulator.safeGridIds.add(sourceGrid.id);
      accumulator.searchedGridIds.add(sourceGrid.id);
    } else {
      accumulator.safeGridIds = new Set([sourceGrid.id]);
      accumulator.searchedGridIds = new Set([sourceGrid.id]);
    }

    if (sourceGrid.number === 0) {
      sourceGrid.adjacentIds.forEach(gridId => {
        if (accumulator.searchedGridIds.has(gridId)) return;
        const grid = this.findGridById(gridId);

        if (grid.isMined) {
          accumulator.searchedGridIds.add(grid.id);
        } else {
          this.searchSafeGridIdsRecursivelyFrom(grid, accumulator);
        }
      });
    }

    return accumulator.safeGridIds;
  }

  render() {
    return (
      <div style={MissionStyle.base}>
        <Console
          onParamsChange={this.handleParamsChange}
          params={this.state.params}
        />
        <Field
          data={this.state.data}
          shape={[this.state.params.nRow, this.state.params.nCol]}
          isMutable={this.state.status === this.constructor.STATUS.ONGOING}
          onRevealing={this.handleRevealing}
        />
      </div>
    );
  }
}

export default Radium(Mission);
