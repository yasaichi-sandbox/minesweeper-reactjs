import range from 'lodash.range';

export default class MissionData {
  constructor(params) {
    this.nRow = params.nRow;
    this.nCol = params.nCol;
    this.nMine = params.nMine;
    this.minedGridIds = [];
  }

  getAdjacentGridIdsOf(targetId) {
    const row = Math.floor(targetId / this.nCol);
    const col = targetId % this.nCol;
    const nRows = range(this.nRow);
    const nCols = range(this.nCol);

    return [-1, 0, 1]
      .reduce((a, e) => a.concat([[row + e, col - 1], [row + e, col], [row + e, col + 1]]), [])
      .filter(([r, c]) => nRows.includes(r) && nCols.includes(c))
      .map(([r, c]) => (this.nCol * r) + c)
      .filter((id) => id !== targetId);
  }

  build() {
    const nGrid = this.nRow * this.nCol;

    this.minedGridIds = range(nGrid)
      .sort(() => Math.random() - 0.5)
      .slice(0, this.nMine);

    return (
      range(nGrid).map((i) => {
        const adjacentGridIds = this.getAdjacentGridIdsOf(i);
        const number = adjacentGridIds
          .filter((id) => this.minedGridIds.includes(id))
          .length;

        return {
          id: i,
          isMined: this.minedGridIds.includes(i),
          adjacentIds: adjacentGridIds,
          number
        };
      })
    );
  }
}
