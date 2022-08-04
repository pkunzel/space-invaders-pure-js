function updateScore(points) {
	game.score += points;
	gameScore.innerHTML = game.score;
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