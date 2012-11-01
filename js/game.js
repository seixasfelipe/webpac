var game = {
	
	canvas: null,
	context: null,
	screenWidth: 320,
	screenHeight: 240,
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


	create: function() {
		console.log('creating game context.');

		this.canvas = document.createElement('canvas');
		this.canvas.width = this.screenWidth;
		this.canvas.height = this.screenHeight;

		this.context = this.canvas.getContext('2d');

		var container = document.getElementById('container');
		if(container)
			container.appendChild(this.canvas);

		this.addEventListerners();
		this.loadResources();

		console.log('game created!');
	},
	init: function() {
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
		}

		this.keydown.reset();
	},
	draw: function() {
  		this.erase();

  		for(var i=0; i<this.objects.length; i++) {
  			var obj = this.objects[i];
  			var objImage = obj.getImage();
  			this.context.drawImage(this.spriteSheet, 
  				objImage.x, objImage.y, objImage.width, objImage.height, 
  				obj.position.x, obj.position.y, objImage.width, objImage.height);
  		}
	},
	erase: function() {
		this.canvas.width = this.canvas.width;
	},
	loadResources: function() {
		this.spriteSheet = new Image();
		this.spriteSheet.src = 'images/pacman-sprites.png';

		var pacman = Object.create(Sprite);
		pacman.position.x = 100;
		pacman.position.y = 50;
		pacman.speed = 3;

		var img01 = Object.create(SpriteImage);
		img01.x = 282;
		img01.y = 2;
		img01.width = 32;
		img01.height = 32;

		var img02 = Object.create(SpriteImage);
		img02.x = 282;
		img02.y = 42;
		img02.width = 32;
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
		window.addEventListener('keydown', function(e) {
			// ref: http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
			console.log('key hit ' + String.fromCharCode(e.keyCode));
			if(e.keyCode == 81) { // Q
				game.quit();
			} else if(e.keyCode == 13) { // ENTER
				game.init();
			} else if(e.keyCode == 32) { // SPACE
				game.erase();
			} else if(e.keyCode == 37) { // LEFT
				game.keydown.left = true;
			} else if(e.keyCode == 39) { // RIGHT
				game.keydown.right = true;
			} else if(e.keyCode == 38) { // UP
				game.keydown.up = true;
			} else if(e.keyCode == 40) { // DOWN
				game.keydown.down = true;
			}
		}, false);
	}
}

