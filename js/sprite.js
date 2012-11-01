var Sprite = {
	position: { x: 0, y: 0 },
	currentImageIndex: 0,
	images: new Array(),
	getImage: function() {
		/*
		this.currentImageIndex += 1;
		if(this.currentImageIndex > this.images.length - 1)
			this.currentImageIndex = 0;
		*/
		return this.images[this.currentImageIndex];
	}
};

var SpriteImage = {
	x: 0,
	y: 0,
	width: 0,
	height: 0
}