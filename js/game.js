var game = {
	
	canvas: null,
	context: null,
	screenWidth: 640,
	screenHeight: 480,
	loop: null,
	spriteSheet: null,
	objects: new Array(),
	keydown: {
		left: false,
		right: false,
		up: false,
		down: false,
		reset: function() {
			this.left = false;
			this.right = false;
			this.up = false;
			this.down = false;
		}
	},
	map: null,
	debug: {
		toggleBounds: false,
		togglePosition: false
	},


	create: function() {
		console.log('creating game context.');

		this.canvas = document.createElement('canvas');
		this.canvas.width = this.screenWidth;
		this.canvas.height = this.screenHeight;

		this.context = this.canvas.getContext('2d');

		this.context.strokeStyle = 'blue';
		this.context.fillStyle = 'red';
		this.context.font = 'bold 10px Lucinda Grande, Lucida Sans Unicode, Verdana, sans-serif';

		var container = document.getElementById('container');
		if(container)
			container.appendChild(this.canvas);

		this.addEventListerners();
		this.loadResources();

		console.log('game created!');
	},
	init: function() {

		this.clearCanvas();

		if(this.loop)
			return false;

		var fpsLimit = 30;

		console.log('game started');
		this.loop = setInterval(function() {
			game.update();
			game.draw();
		}, 1000/fpsLimit );
	},
	quit: function() {
			console.log('user wants to quit');
			window.clearInterval(game.loop);
			game.loop = null;
			console.log('game quit');
	},
	update: function() {

		for(var i=0; i<this.objects.length; i++) {
			var obj = this.objects[i];

			// Objects direction
			if(this.keydown.left) {
				obj.direction.x = -1;
				obj.direction.y = 0;
			} else if(this.keydown.right) {
				obj.direction.x = 1;
				obj.direction.y = 0;
			} else if(this.keydown.up) {
				obj.direction.x = 0;
				obj.direction.y = -1;
			} else if(this.keydown.down) {
				obj.direction.x = 0;
				obj.direction.y = 1;
			}

			obj.position.x += (obj.direction.x * obj.speed);
			obj.position.y += (obj.direction.y * obj.speed);

			var objImage = obj.getImage();
			var objImgHalfWidth = objImage.width / 4;
			var objImgHalfHeight = objImage.height / 4;
			
			// var futurePositionX = obj.position.x + (obj.direction.x * obj.speed) + (obj.width / 2);
			// var futurePositionY = obj.position.y + (obj.direction.y * obj.speed) + (obj.height / 2);
			// var futureMapPosition = this.map.getMapPosition(futurePositionX, futurePositionY);

			// Collision detection
			// var objBounds = obj.getBounds();
			// if(this.map.getBlockType(objBounds.topLeft.x, objBounds.topLeft.y) != 3 &&
			// 	this.map.getBlockType(objBounds.topRight.x, objBounds.topRight.y) != 3 &&
			// 	this.map.getBlockType(objBounds.bottomLeft.x, objBounds.bottomLeft.y) != 3 &&
			// 	this.map.getBlockType(objBounds.bottomRight.x, objBounds.bottomRight.y) != 3) {
			// 	obj.position.x += (obj.direction.x * obj.speed);
			// 	obj.position.y += (obj.direction.y * obj.speed);
			// }
			// if(this.map.matrix[(futureMapPosition.row*this.map.maxCols)+futureMapPosition.col] != 3) {
			// 	obj.position.x += (obj.direction.x * obj.speed);
			// 	obj.position.y += (obj.direction.y * obj.speed);
			// }

			// Position always inside screen bounds
			if(obj.position.x - objImgHalfWidth < 0) {
				obj.position.x = objImgHalfWidth;
			} else if((obj.position.x + objImgHalfWidth) > this.screenWidth) {
				obj.position.x = this.screenWidth - objImgHalfWidth;
			} else if(obj.position.y - objImgHalfHeight < 0) {
				obj.position.y = objImgHalfHeight;
			} else if ((obj.position.y + objImgHalfHeight) > this.screenHeight) {
				obj.position.y = this.screenHeight - objImgHalfHeight;
			}
		}

		this.keydown.reset();
	},
	draw: function() {
  		this.clearCanvas();

  		this.context.save();

  		var initialX = 5;
  		var initialY = 5;
  		
  		// Draws map
  		for(var i=0; i<this.map.maxRows; i++) {
  			for(var j=0; j<this.map.maxCols; j++) {
  				if(this.map.matrix[(i*this.map.maxCols)+j] == 3) {
  					var currentX = initialX+(j*this.map.blockWidth);
  					var currentY = initialY+(i*this.map.blockHeight);

	  				this.context.beginPath();
	  				this.context.rect(currentX, currentY, this.map.blockWidth, this.map.blockHeight);
	  				this.context.stroke();
  				}
  			}
  		}

  		for(var i=0; i<this.objects.length; i++) {
  			var obj = this.objects[i];
  			var objImage = obj.getImage();
  			var objImgHalfWidth = objImage.width / 2;
			var objImgHalfHeight = objImage.height / 2;

			if(this.debug.togglePosition) {
				this.context.fillText('('+obj.position.x+','+obj.position.y+')', 
					obj.position.x-10-obj.width*0.5, obj.position.y-5-obj.height*0.5);

				var currentMapPosition = this.map.getMapPosition(obj.position.x, obj.position.y);
				this.context.fillText('('+currentMapPosition.col+'x'+currentMapPosition.row+')',
					obj.position.x-10-obj.width*0.5, obj.position.y+10+obj.height*0.5);
			}

			if(this.debug.toggleBounds) {
				this.context.strokeStyle = 'green';
				this.context.beginPath();
				this.context.rect(obj.getBounds().topLeft.x, obj.getBounds().topLeft.y, obj.width, obj.height);
				this.context.stroke();
			}
  			
  			this.context.translate(obj.position.x, obj.position.y);

  			if(obj.direction.x != 0) {
  				this.context.scale(obj.direction.x*0.5,0.5);
  			} else {
  				this.context.scale(0.5,0.5);
  			}

  			if(obj.direction.y != 0) {

  			}
  			
  			this.context.drawImage(this.spriteSheet, 
  				objImage.x, objImage.y, objImage.width, objImage.height, 
  				-objImgHalfWidth, -objImgHalfHeight, objImage.width, objImage.height);
  		}

  		this.context.restore();
	},
	clearCanvas: function() {
		this.context.clearRect(0, 0, this.screenWidth, this.screenHeight);
		
		// Reset Transform
      	// 1 0 0
      	// 0 1 0
      	// 0 0 1
		//this.context.setTransform(1,0,0,1,0,0);
		// this.context.translate(0, 0);
		// this.context.scale(1,1);
		//this.canvas.width = this.canvas.width;
	},
	loadResources: function() {
		console.log('loading resources.');

		this.spriteSheet = new Image();
		this.spriteSheet.src = 'images/pacman-sprites.png';

		this.map = Object.create(Map);
		this.map.matrix = [
			3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,
			3,1,1,1,1,1,1,1,1,1,1,1,1,3,3,1,3,3,3,1,1,1,1,1,1,1,1,3,
			3,1,3,3,1,3,3,1,1,1,3,3,1,1,1,1,3,3,3,1,3,3,3,3,1,3,1,3,
			3,1,1,1,1,1,1,1,3,3,3,3,1,3,3,1,1,1,1,1,1,1,1,1,1,1,1,3,
			3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
		];

		// TODO: create a resource factory.
		var pacman = Object.create(Sprite);
		pacman.position.x = this.map.blockWidth*1.5+5;
		pacman.position.y = this.map.blockHeight*1.5+5;

		var img01 = Object.create(SpriteImage);
		img01.x = 282;
		img01.y = 2;
		img01.width = 24;
		img01.height = 32;

		var img02 = Object.create(SpriteImage);
		img02.x = 282;
		img02.y = 42;
		img02.width = 30;
		img02.height = 32;

		var img03 = Object.create(SpriteImage);
		img03.x = 282;
		img03.y = 82;
		img03.width = 32;
		img03.height = 32;

		pacman.images.push(img01);
		pacman.images.push(img02);
		pacman.images.push(img03);

  		this.objects.push(pacman);
	},
	addEventListerners: function() {
		console.log('adding event listerners.');

		window.addEventListener('keydown', function(e) {
			// ref: http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
			console.log('key hit ' + String.fromCharCode(e.keyCode));
			if(e.keyCode == 81) { // Q
				game.quit();
			} else if(e.keyCode == 13) { // ENTER
				game.init();
			} else if(e.keyCode == 32) { // SPACE
				game.clearCanvas();
			} else if(e.keyCode == 37) { // LEFT
				game.keydown.left = true;
			} else if(e.keyCode == 39) { // RIGHT
				game.keydown.right = true;
			} else if(e.keyCode == 38) { // UP
				game.keydown.up = true;
			} else if(e.keyCode == 40) { // DOWN
				game.keydown.down = true;
			} else if(String.fromCharCode(e.keyCode) == 'A') {
				game.debug.toggleBounds = !game.debug.toggleBounds;
			} else if(String.fromCharCode(e.keyCode) == 'S') {
				game.debug.togglePosition = !game.debug.togglePosition;
			}
		}, false);
	}
}

