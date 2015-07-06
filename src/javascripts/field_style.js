const FieldStyle = {
  base: {
    borderLeft: 'solid 1px black',
    borderTop: 'solid 1px black'
  },
  shape(nRow, nCol) {
    return {
      width: `${46 * nCol}px`,
      height: `${46 * nRow}px`
    }
  }
}

export default FieldStyle
