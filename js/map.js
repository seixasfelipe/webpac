var Map = {
	maxRows: 5,
	maxCols: 26,
	blockWidth: 24,
	blockHeight: 24,
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
	getBlockTypeByRowCol: function(row, col) {
		return this.matrix[ (row*this.maxCols) + col];
	},
	getCoordenate: function(row, col) {
		return {
			x: col*this.blockHeight + (this.blockWidth*0.5),
			y: row*this.blockWidth + (this.blockHeight*0.5)
		}
	},
	getCenterPosition: function(positionX, positionY) {
		var mapPosition = this.getMapPosition(positionX, positionY);
		return this.getCoordenate(mapPosition.row, mapPosition.col);
	},
	atBlockCenterCoord: function(positionX, positionY) {
		var centerPosition = this.getCenterPosition(positionX, positionY);
		return (centerPosition.x == positionX && centerPosition.y == positionY);
	},
	changeBlockType: function(blockType, row, col) {
		this.matrix[ row*this.maxCols + col ] = blockType;
	}
}