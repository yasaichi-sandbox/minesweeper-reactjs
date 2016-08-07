import range from 'lodash.range';

export default class MissionData {
  constructor(params) {
    this.nRow = params.nRow;
    this.nCol = params.nCol;
    this.nMine = params.nMine;
    this.minedGridIds = [];
  }

  getAdjacentGridIdsOf(targetId) {
    const r = Math.floor(targetId / this.nCol);
    const c = targetId % this.nCol;
    const nRows = range(this.nRow);
    const nCols = range(this.nCol);

    return [-1, 0, 1]
      .reduce((a, e) => a.concat([[r + e, c - 1], [r + e, c], [r + e, c + 1]]), [])
      .filter(c => nRows.includes(c[0]) && nCols.includes(c[1]))
      .map(c => (this.nCol * c[0]) + c[1])
      .filter(id => id !== targetId);
  }

  build() {
    const nGrid = this.nRow * this.nCol;

    this.minedGridIds = range(nGrid)
      .sort(() => Math.random() - 0.5)
      .slice(0, this.nMine);

    return (
      range(nGrid).map(i => {
        const adjacentGridIds = this.getAdjacentGridIdsOf(i);
        const number = adjacentGridIds
          .filter(id => this.minedGridIds.includes(id))
          .length;

        return {
          id: i,
          isMined: this.minedGridIds.includes(i),
          adjacentIds: adjacentGridIds,
          number,
        };
      })
    );
  }
}
