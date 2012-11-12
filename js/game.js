var game = {
	
	canvas: null,
	context: null,
	screenWidth: 640,
	screenHeight: 480,
	loop: null,
	spriteSheet: null,
	objects: [],
	map: null,
	debug: {
		toggleBounds: false,
		togglePosition: false,
		toggleBoundsPosition: false
	},
	player: null,


	create: function() {
		console.log('creating game context.');

		this.canvas = document.createElement('canvas');
		this.canvas.width = this.screenWidth;
		this.canvas.height = this.screenHeight;

		this.context = this.canvas.getContext('2d');

		this.context.strokeStyle = 'blue';
		this.context.fillStyle = 'white';
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
		this.handleInput();
		this.updatePlayerPosition(this.player);
		this.updateEnemiesPosition(this.objects);
		// this.checkCollisions();
		// this.handleCollisions();
		this.eatDots(this.player);
	},
	updatePlayerPosition: function(player) {
		this.updateSpritePosition(player);
	},
	updateEnemiesPosition: function(enemies) {
		var i;
		for(i=0; i<enemies.length; i += 1) {
			this.updateSpritePosition(enemies[i]);
		}
	},
	updateSpritePosition: function(sprite) {
		if( this.map.canMove(sprite.position, sprite.direction) ) {
			sprite.move();	
		}
	},
	handleInput: function() {
		if(keys['q'] === true) { // Q
			this.quit();
			delete keys['q'];
		} else if(keys['space'] === true) { // SPACE
			this.clearCanvas();
			delete keys['space'];
		} else if(keys['a'] === true) {
			this.debug.toggleBounds = !this.debug.toggleBounds;
			delete keys['a'];
		} else if(keys['s'] === true) {
			this.debug.togglePosition = !this.debug.togglePosition;
			delete keys['s'];
		} else if(keys['d'] === true) {
			this.debug.toggleBoundsPosition = !this.debug.toggleBoundsPosition;
			delete keys['d'];
		}

		var atBlockCenterCoord = this.map.atBlockCenterCoord(this.player.position);

		if(atBlockCenterCoord) {
			if(keys.left) {
				this.player.directionTo(DirectionEnum.LEFT);
				delete keys.left;
			} else if (keys.right) {
				this.player.directionTo(DirectionEnum.RIGHT);
				delete keys.right;
			} else if (keys.up) {
				this.player.directionTo(DirectionEnum.UP);
				delete keys.up;
			} else if (keys.down) {
				this.player.directionTo(DirectionEnum.DOWN);
				delete keys.down;
			}
		}
	},
	eatDots: function(obj) {
		var atBlockCenterCoord = this.map.atBlockCenterCoord(obj.position);
		var mapPosition = this.map.getMapPosition(obj.position);

		// Eat Dots
		if(atBlockCenterCoord && this.map.getBlockTypeByRowCol(mapPosition.row, mapPosition.col) == 1) {
			this.map.changeBlockType(0, mapPosition.row, mapPosition.col);
			--this.map.remainingDots;
		}
	},
	draw: function() {
  		this.clearCanvas();

  		this.context.save();

  		this.drawMap();
  		this.drawStatus();

  		this.drawObject(this.player);

  		for(var i=0; i<this.objects.length; i++) {
  			this.drawObject(this.objects[i]);
  		}

  		this.context.restore();
	},
	drawObject: function(obj) {
		this.drawDebugInfo(obj);

		this.context.translate(obj.position.x, obj.position.y);

		var scaleFactor = 1;
		if(obj.direction.x != 0) {
			this.context.scale(obj.direction.x*scaleFactor,scaleFactor);
		} else {
			this.context.scale(scaleFactor,scaleFactor);
		}

		// WTF?? Angle 1.60!?!? I got it trying and fixing!
		if(obj.direction.y > 0) {
			this.context.rotate(1.60);
		} else if(obj.direction.y < 0) {
			this.context.rotate(-1.60);
		}
		
		var objImage = obj.getImage();
		var objImgHalfWidth = objImage.width*0.5;
		var objImgHalfHeight = objImage.height*0.5;
		this.context.drawImage(this.spriteSheet, 
			objImage.x, objImage.y, objImage.width, objImage.height, 
			-objImgHalfWidth, -objImgHalfHeight, objImage.width, objImage.height);

		this.context.setTransform(1,0,0,1,0,0);
	},
	drawMap: function() {
  		var initialX = 0;
  		var initialY = 0;
  		
  		// Draws map
  		for(var i=0; i<this.map.maxRows; i++) {
  			for(var j=0; j<this.map.maxCols; j++) {
  				var blockType = this.map.matrix[(i*this.map.maxCols)+j];
  				var currentX = initialX+(j*this.map.blockWidth);
  				var currentY = initialY+(i*this.map.blockHeight);

  				if(blockType == 3) {
	  				this.context.beginPath();
	  				this.context.rect(currentX, currentY, this.map.blockWidth, this.map.blockHeight);
	  				this.context.stroke();
  				} else if(blockType == 1) {
  					var centerPosition = this.map.getCenterPosition({ x: currentX, y: currentY });
  					this.context.beginPath();
  					this.context.rect(centerPosition.x-1, centerPosition.y-1, 3, 3);
  					this.context.fill();
  				}
  			}
  		}
	},
	drawDebugInfo: function(obj) {
		this.context.fillStyle = 'white';
		this.context.font = 'bold 10px Lucinda Grande, Lucida Sans Unicode, Verdana, sans-serif';

		if(this.debug.togglePosition) {
			this.context.fillText('('+obj.position.x+','+obj.position.y+')', 
				obj.position.x-10-obj.width*0.5, obj.position.y-5-obj.height*0.5);

			var currentMapPosition = this.map.getMapPosition(obj.position);
			this.context.fillText('('+currentMapPosition.col+'x'+currentMapPosition.row+')',
				obj.position.x-10-obj.width*0.5, obj.position.y+10+obj.height*0.5);
			this.context.fillText('('+this.map.getCoordenate(currentMapPosition.row, currentMapPosition.col).x+'x'+this.map.getCoordenate(currentMapPosition.row, currentMapPosition.col).y+')',
				obj.position.x-10-obj.width*0.5, obj.position.y+20+obj.height*0.5);
		}

		if(this.debug.toggleBoundsPosition) {
			obj.getBounds().debug();
			this.debug.toggleBoundsPosition = false;
		}

		if(this.debug.toggleBounds) {
			this.context.strokeStyle = 'red';
			this.context.beginPath();
			this.context.rect(obj.getBounds().topLeft.x, obj.getBounds().topLeft.y, obj.width, obj.height);
			this.context.stroke();
		}
	},
	drawStatus: function() {
		this.context.fillStyle = "green";
		this.context.font = 'bold 16px Lucinda Grande, Lucida Sans Unicode, Verdana, sans-serif';
		this.context.fillText('Remaining Dots: ' + this.map.remainingDots,
			100, 300);
		if(this.map.remainingDots == 0) {
			this.context.fillText('Congratulations, YOU WIN!!', 
				this.screenWidth*0.3, 110);
		}
		this.context.fill();
	},
	clearCanvas: function() {
		this.context.clearRect(0, 0, this.screenWidth, this.screenHeight);
	},
	loadResources: function() {
		console.log('loading resources.');

		this.spriteSheet = new Image();
		this.spriteSheet.src = 'images/pacman-sprites.png';

		this.map = Object.create(Map);
		this.map.init([
			3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,
			3,1,1,1,1,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,1,1,1,1,3,
			3,1,3,1,3,1,3,3,3,1,3,1,3,3,1,3,1,3,3,3,1,3,1,3,1,3,
			3,1,3,1,3,1,3,3,3,1,3,1,1,1,1,3,1,3,3,3,1,3,1,3,1,3,
			3,1,3,3,3,1,3,3,3,1,3,1,3,3,1,3,1,3,3,3,1,3,3,3,1,3,
			3,1,1,1,1,1,1,1,1,1,3,1,1,1,1,3,1,1,1,1,1,1,1,1,1,3,
			3,1,3,3,3,1,3,3,3,1,3,1,3,3,1,3,1,3,3,3,1,3,3,3,1,3,
			3,1,3,1,3,1,3,3,3,1,3,1,1,1,1,3,1,3,3,3,1,3,1,3,1,3,
			3,1,3,1,3,1,3,3,3,1,3,1,3,3,1,3,1,3,3,3,1,3,1,3,1,3,
			3,1,1,1,1,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,1,1,1,1,3,
			3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3
		]);

		// TODO: create a resource factory.
		var pacman = Object.create(Sprite, {
			position: {
				value: {
					x: this.map.blockWidth*1.5,
					y: this.map.blockHeight*1.5
				}
			},
			direction: {
				value: {
					x: 1,
					y: 0
				}
			},
			images: {
				value: [
					{
						x: 3,
						y: 23,
						width: 12,
						height: 13
					}
				]
			}
		});

		console.log('PacMan Object created:');
		console.log(pacman);

  		this.player = pacman;








  		var enemy = Object.create(Sprite, {
  			position: {
				value: {
					x: this.map.blockWidth*1.5,
					y: this.map.blockHeight*5.5
				}
			},
			direction: {
				value: {
					x: 1,
					y: 0
				}
			},
			images: {
				value: [
					{
						x: 123,
						y: 83,
						width: 14,
						height: 14
					}
				]
			}
  		});

		console.log('Enemy Object created:');
		console.log(enemy);



		this.objects.push(enemy);

		console.log('Game Objects array:');
  		console.log(this.objects);
	},
	addEventListerners: function() {
		console.log('adding event listerners.');

		window.addEventListener('keydown', function(e) {
			// ref: http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
			console.log('key hit ' + String.fromCharCode(e.keyCode).toLowerCase());
			e.preventDefault();

			if(e.keyCode == 13) { // ENTER
				game.init();
			} else if(e.keyCode == 32) { // SPACE
				keys['space'] = true;
			} else if(e.keyCode === 37) { // LEFT
				keys['left'] = true;
			} else if(e.keyCode === 39) { // RIGHT
				keys['right'] = true;
			} else if(e.keyCode === 38) { // UP
				keys['up'] = true;
			} else if(e.keyCode === 40) { // DOWN
				keys['down'] = true;
			} else {
				var keycode = String.fromCharCode(e.keyCode).toLowerCase();
				keys[keycode] = true;
			}
		}, false);
	}
};