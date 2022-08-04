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