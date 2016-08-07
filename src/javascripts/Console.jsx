import bindAll from 'lodash.bindall';
import React from 'react';
import Radium from 'radium';
import ConsoleStyle from './ConsoleStyle';

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
        nMine: React.PropTypes.number.isRequired,
      }),
    };
  }

  static get defaultProps() {
    return {
      nRows: [5, 6, 7, 8, 9, 10],
      nCols: [5, 6, 7, 8, 9, 10],
      nMines: [5, 10, 15, 20, 25],
    };
  }

  constructor(props) {
    super(props);
    bindAll(this, ['handleSubmit']);
  }

  buildSelectBoxOf(paramName) {
    const optionValues = this.props[`${paramName}s`];

    return (
      <select defaultValue={this.props.params[paramName]} ref={paramName}>
        {optionValues.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    const nextParams = {
      nRow: Number(this.refs.nRow.value),
      nCol: Number(this.refs.nCol.value),
      nMine: Number(this.refs.nMine.value),
    };

    const nRowIsValid = this.props.nRows.includes(nextParams.nRow);
    const nColIsValid = this.props.nCols.includes(nextParams.nCol);

    // 今回のユースケースでは必要ないが、一応厳しくチェック
    const nMineIsValid =
      this.props.nMines.includes(nextParams.nMine) &&
      nextParams.nMine < nextParams.nRow * nextParams.nCol;

    if (nRowIsValid && nColIsValid && nMineIsValid) {
      this.props.onParamsChange(nextParams);
    }
  }

  render() {
    return (
      <form
        style={ConsoleStyle.base}
        onSubmit={this.handleSubmit}
      >
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
        <input type="submit" value="Start!" />
      </form>
    );
  }
}

export default Radium(Console);
