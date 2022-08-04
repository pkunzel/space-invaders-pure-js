const canvas = document.querySelector('#game-canvas');
canvas.width = window.innerWidth * .9;
canvas.height = window.innerHeight * .9;

const context = canvas.getContext('2d');
const gameScore = document.querySelector('[game-score]');

const keys = {
	left: {
		pressed: false
	},
	right: {
		pressed: false
	},
	space: {
		pressed: false
	}
};


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

const player = new Player();
const projectiles = [];
const grids = [];
const invaderProjectiles = [];
const particles = [];



let frames = 0;
let randomInterval = Math.floor((Math.random() * 500)) + 500;
let game = {
	over: false,
	active: true,
	score: 0
}

function updateScore(points) {
	game.score += points;
	gameScore.innerHTML = game.score;
}

updateScore(0);

for (let i = 0; i < 100; i++) {
	particles.push(new Particle({
		position: {
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height
		},
		velocity: {
			x: 0,
			y: 0.5
		},
		radius: 1,
		color: 'white',
		fades: false
	}));
}

function animate() {
	if (!game.active) return;

	requestAnimationFrame(animate);

	context.fillStyle = 'black';
	context.fillRect(0, 0, canvas.width, canvas.height);

	player.update();

	particles.forEach((particle, particleIndex) => {
		if (particle.opacity <= 0) {
			particles.splice(particleIndex, 1);
		} else {
			particle.update();
		}
	})

	invaderProjectiles.forEach((projectile, projectileIndex) => {

		if (projectile.position.y > canvas.height) {
			invaderProjectiles.splice(projectileIndex, 1);
		} else {
			projectile.update();
		}

		if (projectile.position.y + projectile.height > player.position.y &&
			projectile.position.y < player.position.y + player.height &&
			projectile.position.x + projectile.width > player.position.x &&
			projectile.position.x < player.position.x + player.width) {

			setTimeout(() => {
				invaderProjectiles.splice(projectileIndex, 1);
				player.opacity = 0;
				game.over = true;
			}, 0);

			setTimeout(() => {
				game.active = false;
			}, 2000);

			createParticles({ object: player, color: 'red', fades: true });

		}
	})

	projectiles.forEach((projectile, index) => {
		if (projectile.position.y + projectile.radius < 0) {
			projectiles.splice(index, 1);
		} else {
			projectile.update();
		}
	});

	grids.forEach((grid, gridIndex) => {
		grid.update();

		if (frames % 100 === 0 && grid.invaders.length > 0) {
			const randomInvaderIndex = Math.floor(Math.random() * grid.invaders.length);
			grid.invaders[randomInvaderIndex].shoot(invaderProjectiles);
		}

		grid.invaders.forEach((invader, invaderIndex) => {
			invader.update({ velocity: grid.velocity });

			// Projectle hits enemy
			projectiles.forEach((projectile, projectileIndex) => {
				if (projectile.position.y - projectile.radius <= invader.position.y + invader.height
					&& projectile.position.x + projectile.radius >= invader.position.x
					&& projectile.position.x - projectile.radius <= invader.position.x + invader.width
					&& projectile.position.y + projectile.radius >= invader.position.y) {

					setTimeout(() => {
						const invaderExist = grid.invaders.find(targetInvader => targetInvader == invader);
						const projectileExist = projectiles.find(targetProjectile => targetProjectile == projectile);

						// remove invader and projectile
						if (invaderExist && projectileExist) {
							grid.invaders.splice(invaderIndex, 1);
							projectiles.splice(projectileIndex, 1);

							createParticles({ object: invader, fades: true });

							if (grid.invaders.length == 0) {
								grids.splice(gridIndex, 1);
							} else {
								const firstInvader = grid.invaders[0];
								const lasrInvader = grid.invaders[grid.invaders.length - 1];

								grid.width = lasrInvader.position.x + lasrInvader.width - firstInvader.position.x;
								grid.position.x = firstInvader.position.x;
							}

							updateScore(10);
						}
					}, 0);
				}
			})

		})
	})

	if (keys.left.pressed && player.position.x >= 0) {
		player.velocity.x = -7;
	} else if (keys.right.pressed && player.position.x <= canvas.width - player.width) {
		player.velocity.x = 7;
	} else {
		player.velocity.x = 0;
	}

	// spawn enemy grid
	if (frames % randomInterval === 0) {
		grids.push(new Grid());
		frames = 0;
		randomInterval = Math.floor((Math.random() * 1000)) + 500;
	}

	//spawn enemy projectile


	frames++;
}

function createParticles({ object, color, fades }) {
	for (let i = 0; i < 10; i++) {
		particles.push(new Particle({
			position: {
				x: object.position.x + object.width / 2,
				y: object.position.y + object.height / 2
			},
			velocity: {
				x: (Math.random() - 0.5) * 2,
				y: (Math.random() - 0.5) * 2
			},
			radius: Math.random() * 3,
			color: color || '#BAA0BE',
			fades: fades || false
		}));
	}
}

animate();

window.addEventListener('keydown', (e) => {
	if (game.over) return

	switch (e.key) {
		case 'ArrowLeft':
			keys.left.pressed = true;
			break;
		case 'ArrowRight':
			keys.right.pressed = true;
			break;
		case ' ':
			keys.space.pressed = true;
			projectiles.push(new Projectile({ position: { x: player.position.x + player.width / 2, y: player.position.y - player.height / 2 }, velocity: { x: 0, y: -10 } }));
			break;
	}
});

window.addEventListener('keyup', (e) => {
	switch (e.key) {
		case 'ArrowLeft':
			keys.left.pressed = false;
			break;
		case 'ArrowRight':
			keys.right.pressed = false;
			break;
		case ' ':
			keys.space.pressed = false;
			break;
	}
});