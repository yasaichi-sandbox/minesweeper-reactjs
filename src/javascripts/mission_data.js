export default class MissionData {
  constructor(params) {
    this.nRow = params.nRow
    this.nCol = params.nCol
    this.nMine = params.nMine
    this.minedGridIds = []
  }

  countNeighborMines(targetId) {
    let r = Math.floor(targetId / this.nCol)
    let c = targetId % this.nCol

    let neighborGridIds = [-1, 0, 1]
      .reduce((a, e) => a.concat([[r+e, c-1], [r+e, c], [r+e, c+1]]), [])
      .filter(c => 0 <= c[0] && c[0] < this.nRow && 0 <= c[1] && c[1] < this.nCol)
      .map(c => this.nCol * c[0] + c[1])
      .filter(id => id !== targetId)

    return neighborGridIds.filter(id => this.minedGridIds.indexOf(id) >= 0).length
  }

  build() {
    let nGrid = this.nRow * this.nCol

    this.minedGridIds = this._range(0, nGrid)
      .sort(() => Math.random() - 0.5)
      .slice(0, this.nMine)

    return (
      this._range(0, nGrid).map(i => {
        return {
          id: i,
          isMined: this.minedGridIds.indexOf(i) >= 0,
          isRevealed: false,
          number: this.countNeighborMines(i)
        }
      })
    )
  }

  // immutable-jsとか使っても良かったけどサイズ大きくなりそうだったので自作
  _range(first, last) {
    let diff = last - first

    return Array
      .apply(null, { length: diff > 0 ? diff : 0 })
      .map((_, i) => first + i)
  }
}
