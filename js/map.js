var Map = {
	maxRows: 4,
	maxCols: 28,
	blockWidth: 16,
	blockHeight: 16,
	matrix: new Array(),

	currentMapPosition: function(positionX, positionY) {
		return {
			row: Math.floor(positionX/this.maxCols),
			col: Math.floor(positionY/this.maxRows)
		}
	}
}