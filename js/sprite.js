var Sprite = {
	position: { x: 0, y: 0 },
	direction: { x: 1, y: 0 },
	speed: 1,
	width: 18,
	height: 18,

	getBounds: function() {

		var halfWidth = this.width*0.5;
		var halfHeight = this.height*0.5;
		var positionX = this.position.x;
		var positionY = this.position.y;

		return {
			topLeft: { 
				x: positionX - halfWidth,
				y: positionY - halfHeight
			},
			topRight: {
				x: positionX + halfWidth,
				y: positionY - halfHeight
			},
			bottomLeft: {
				x: positionX - halfWidth,
				y: positionY + halfHeight
			},
			bottomRight: {
				x: positionX + halfWidth,
				y: positionY + halfHeight
			}
		}
	},

	currentImageIndex: 0,
	images: new Array(),

	getImage: function() {
		return this.images[this.currentImageIndex];
	}
};

var SpriteImage = {
	x: 0,
	y: 0,
	width: 0,
	height: 0
}