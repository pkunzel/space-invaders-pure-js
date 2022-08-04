class Player {
	constructor() {

		this.velocity = {
			x: 0,
			y: 0
		}

		const image = new Image();
		image.src = 'assets/spaceship.png';
		image.onload = () => {
			const scale = 0.15;
			this.image = image;
			this.width = image.width * scale;
			this.height = image.height * scale;

			this.position = {
				x: canvas.width / 2 - this.width / 2,
				y: canvas.height - this.height / 2 - 25
			}
		}

		this.opacity = 1;
	}

	draw() {
		if (this.image) {
			context.save();
			context.globalAlpha = this.opacity;

			context.drawImage(this.image,
				this.position.x,
				this.position.y,
				this.width,
				this.height);

			context.restore();
		}
	}

	update() {
		if (this.image) {
			this.position.x += this.velocity.x;
			this.draw();
		}
	}
}

class Invader {
	constructor({ position }) {

		this.velocity = {
			x: 0,
			y: 0
		}

		const image = new Image();
		image.src = 'assets/invader.png';
		image.onload = () => {
			const scale = 1;
			this.image = image;
			this.width = image.width * scale;
			this.height = image.height * scale;

			this.position = {
				x: position.x,
				y: position.y
			}
		}
	}

	draw() {
		if (this.image) {
			context.drawImage(this.image,
				this.position.x,
				this.position.y,
				this.width,
				this.height);
		}
	}

	update({ velocity }) {
		if (this.image) {
			this.position.x += velocity.x;
			this.position.y += velocity.y;
			this.draw();
		}
	}

	shoot(invaderProjectiles) {
		invaderProjectiles.push(new InvaderProjectile({
			position: {
				x: this.position.x + this.width / 2,
				y: this.position.y + this.height / 2
			},
			velocity: {
				x: 0,
				y: 5
			}
		}));
	}
}

class Projectile {
	constructor({ position, velocity }) {
		this.position = position;
		this.velocity = velocity;

		this.radius = 3;
	}

	draw() {
		context.beginPath();
		context.arc(this.position.x,
			this.position.y,
			this.radius,
			0,
			Math.PI * 2);
		context.fillStyle = 'red';
		context.fill();
		context.closePath();
	}

	update() {
		this.draw();

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

class Particle {
	constructor({ position, velocity, radius, color, fades }) {
		this.position = position;
		this.velocity = velocity;

		this.radius = radius;
		this.color = color;
		this.opacity = 1;
		this.fades = fades;
	}

	draw() {
		context.save()
		context.globalAlpha = this.opacity;

		context.beginPath();
		context.arc(this.position.x,
			this.position.y,
			this.radius,
			0,
			Math.PI * 2);
		context.fillStyle = this.color;
		context.fill();
		context.closePath();

		context.restore()
	}

	update() {
		this.draw();

		this.position.x += this.velocity.x;

		this.position.y = this.position.y + this.velocity.y;

		if (this.fades) {
			this.opacity -= 0.01;
		} else if (this.position.y > canvas.height) {
			this.position.y = 0;
		}
	}
}

class InvaderProjectile {
	constructor({ position, velocity }) {
		this.position = position;
		this.velocity = velocity;

		this.width = 4;
		this.height = 8;
	}

	draw() {
		context.fillStyle = 'white';
		context.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

	update() {
		this.draw();

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}
}

class Grid {
	constructor() {
		this.position = {
			x: 0,
			y: 0
		};

		this.velocity = {
			x: 3,
			y: 0
		}

		this.invaders = [];

		const columns = Math.floor(Math.random() * 10 + 5);
		const rows = Math.floor(Math.random() * 5 + 2);

		this.width = columns * 30;

		for (let x = 0; x < columns; x++) {
			for (let y = 0; y < rows; y++) {
				this.invaders.push(new Invader({
					position: {
						x: x * 30,
						y: y * 30
					}
				}));
			}
		}
	}

	update() {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		this.velocity.y = 0;

		if (this.position.x + this.width >= canvas.width
			|| this.position.x <= 0) {
			this.velocity.x = -this.velocity.x
			this.velocity.y = 30;
		}

	}
}