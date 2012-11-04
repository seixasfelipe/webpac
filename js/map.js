var Map = {
	maxRows: 5,
	maxCols: 28,
	blockWidth: 22,
	blockHeight: 22,
	matrix: new Array(),

	getMapPosition: function(positionX, positionY) {
		return {
			row: Math.floor(positionY/this.blockHeight),
			col: Math.floor(positionX/this.blockWidth)			
		}
	},
	getBlockType: function(positionX, positionY) {
		var mapPosition = this.getMapPosition(positionX, positionY);
		return this.matrix[ (mapPosition.row*this.maxCols) + mapPosition.col];
	},
	getCoordenate: function(row, col) {
		return {
			x: row*this.blockHeight + (this.blockHeight / 2),
			y: col*this.blockWidth + (this.blockWidth / 2)
		}
	},
	getCenterPosition: function(positionX, positionY) {
		var mapPosition = this.getMapPosition(positionX, positionY);
		return this.getCoordenate(mapPosition.col, mapPosition.row);
	}
}