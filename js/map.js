var Map = {
	maxRows: 11,
	maxCols: 26,
	blockWidth: 24,
	blockHeight: 24,
	matrix: [],
	remainingDots: 0,

	init: function(matrix) {
		this.matrix = matrix;
		this.remainingDots = this.getRemainingDots();
	},
	getMapPosition: function(position) {
		return {
			row: Math.floor(position.y/this.blockHeight),
			col: Math.floor(position.x/this.blockWidth)			
		}
	},
	getBlockType: function(position) {
		var mapPosition = this.getMapPosition(position);
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
	getCenterPosition: function(position) {
		var mapPosition = this.getMapPosition(position);
		return this.getCoordenate(mapPosition.row, mapPosition.col);
	},
	atBlockCenterCoord: function(position) {
		var centerPosition = this.getCenterPosition(position);
		return (centerPosition.x === position.x && centerPosition.y === position.y);
	},
	changeBlockType: function(blockType, row, col) {
		this.matrix[ row*this.maxCols + col ] = blockType;
	},
	getRemainingDots: function() {
		var remainingDots = 0;
		for(var i=0; i<this.matrix.length; i++) {
			if(this.matrix[i] == 1) 
				remainingDots++;
		}
		return remainingDots;
	},
	getAdjacentBlock: function(position, direction) {
		var mapPosition = this.getMapPosition(position);
		return this.getBlockTypeByRowCol(mapPosition.row + direction.y, mapPosition.col + direction.x);
	},
	canMove: function(position, direction) {
		var adjacentBlock = this.getAdjacentBlock(position, direction)
		return ( ( adjacentBlock !== BlockTypeEnum.WALL ) || 
			( adjacentBlock === BlockTypeEnum.WALL && !this.atBlockCenterCoord(position) ));
	}
};