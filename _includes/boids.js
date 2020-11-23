export default class Boid {
	constructor(x,y,dir=0,speed=2) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.dir = dir;
		this.color = 'black';
		this.force = 0;
	};

	move(ctx, neighbors) {
		var velocity = new Vec(Math.cos(this.dir)*this.speed,Math.sin(this.dir)*this.speed)

		// --- Avoid Walls ---
		let force = new Vec(0,0);
		if (this.x >= cnv.x - WALL_DIST) {
			force.x = -(this.x - (cnv.x - WALL_DIST))/WALL_DIST;
		}
		if (this.x <= WALL_DIST) {
			force.x = -(this.x - WALL_DIST)/WALL_DIST;
		}
		if (this.y >= cnv.y - WALL_DIST) {
			force.y = -(this.y - (cnv.y - WALL_DIST))/WALL_DIST;
		}
		if (this.y <= WALL_DIST) {
			force.y = -(this.y - WALL_DIST)/WALL_DIST;
		}

		let p = Vec.add(velocity, scale(force, 1));
		let rdot = dot(velocity, force);
		let rcross = cross(velocity, force);

		if (magnitude(force) > 0) {
			let angle = Math.acos(dot(p, velocity));
			this.dir += angle * Math.sign(rcross) 
						* ((rdot < 0 ? Math.abs(rdot) : 0) + (0.01));// * (Math.abs(rdot) + 0.01);
		}

		// this.draw_vec(ctx, scale(velocity, 10), 'green')
		// this.draw_vec(ctx, scale(force, 10), 'red')
		// this.draw_vec(ctx, scale(p, 10), 'blue')

		// --- Cohesion ---
		let common_x = neighbors.reduce((acc, curr) => {
			return (acc + curr.x)/2;
		}, this.x);

		let common_y = neighbors.reduce((acc, curr) => {
			return (acc + curr.y)/2;
		}, this.y);

		let cohesion = new Vec(common_x - this.x, common_y - this.y);

		// --- Direction Alignment ---
		let ndir = neighbors.reduce((acc, curr) => {
			acc = normalize(Vec.add(angle2vec(curr.dir), acc));
			return acc;
		
		}, new Vec(0,0));

		let align_dot = dot(ndir, angle2vec(this.dir));
		let align_cross = cross(ndir, angle2vec(this.dir));
		let angle = Math.acos(dot(ndir, angle2vec(this.dir)));
		if (angle) {
			this.dir -= angle * ALIGNMENT_SCALE * Math.sign(align_cross);
		}

		// --- Separation ---
		let separation = new Vec(0,0);
		neighbors.forEach((n) => {
			// ctx.beginPath();
			// ctx.moveTo(this.x, this.y);
			// ctx.lineTo(n.x, n.y);
			// ctx.closePath();
			// ctx.strokeStyle = 'green';
			// ctx.stroke();

			let curr = new Vec(this.x-n.x, this.y-n.y);
			let mag = VIEW_DIST - magnitude(curr);
			curr = mag > 0 ? scale(normalize(curr), mag) : new Vec(0,0);
			separation = Vec.add(separation, curr);
		});

		// this.draw_vec(ctx, scale(normalize(separation), 10), 'red')

		// --- Separation ---
		let new_v = new Vec(Math.cos(this.dir)*this.speed,Math.sin(this.dir)*this.speed)
		new_v = Vec.add(new_v, scale(normalize(cohesion), COHESION_SCALE))
		new_v = Vec.add(new_v, scale(normalize(separation), SEPARATION_SCALE))
		this.x += new_v.x;
		this.y += new_v.y;
	};

	draw(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = 'black';

		ctx.beginPath();
	    ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x+Math.cos(this.dir+Math.PI/2)*6 , this.y+Math.sin(this.dir+Math.PI/2)*6 );
		ctx.lineTo(this.x+Math.cos(this.dir)*20 , this.y+Math.sin(this.dir)*20 );
		ctx.lineTo(this.x-Math.cos(this.dir+Math.PI/2)*6 , this.y+Math.sin(this.dir-Math.PI/2)*6 );
	    ctx.lineTo(this.x, this.y);
		ctx.stroke();
	};

	draw_ahead(ctx) {
		ctx.beginPath();
	    ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.ahead.x, this.ahead.y);
		ctx.closePath();
		ctx.strokeStyle = 'red';
		ctx.stroke();
	};

	draw_vec(ctx, vec, color='red') {
		ctx.beginPath();
	    ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + vec.x, this.y + vec.y);
		ctx.closePath();
		ctx.strokeStyle = color;
		ctx.stroke();
	};
}

class Vec {
	constructor(x, y) {
		this.x = x,
		this.y = y
	}

	static add (a, b) {
		return new Vec(a.x + b.x, a.y + b.y);
	}

}

function magnitude (vec) {
	return Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
}

function normalize (vec) {
	const mag = magnitude(vec);
	if (mag == 0) {
		return new Vec(0,0)
	}
	return new Vec(vec.x / mag, vec.y / mag);
}

function angle2vec(angle) {
	return new Vec(Math.cos(angle), Math.sin(angle));
}

function dot(a, b) {
	return (a.x * b.x + a.y * b.y) / (magnitude(a) * magnitude(b));
}

function cross(a, b) {
	return (a.x * b.y - a.y * b.x) / (magnitude(a) * magnitude(b));
}

function scale (vec, k) {
	return new Vec(vec.x * k, vec.y * k);
}

function square (vec) {
	return new Vec(vec.x * vec.x, vec.y * vec.y);
}

function nearby(boid, index, array) {
	// Square search for neighbors
	if (!(boid === this)) {
		return (Math.abs(boid.x - this.x) < VIEW_DIST & Math.abs(boid.y - this.y) < VIEW_DIST)
	} else {
		return false;
	} 
}

const N = 28;
const WALL_DIST = 100;
const VIEW_DIST = 50;
const COHESION_SCALE = 0.3;
const SEPARATION_SCALE = 0.5;
const ALIGNMENT_SCALE = 0.05;

let boids = [];
const cnv = {
	x: 700,
	y: 500
}

// Spawn boids
for (let i=0; i<N; i++) {
	// boids.push(new Boid(350+i,100+i, (i+0.1)*0.55) );
	boids.push(new Boid(70+(i % 7)*70, 70+(i / 7)*70, (i*0.1)-1) );
}

window.requestAnimationFrame(flock);

function flock() {
	const canvas = document.getElementById('canvas');
	const ctx =  canvas.getContext('2d');

	ctx.clearRect(0,0,cnv.x, cnv.y);

	// Compute the next step for each boid
	boids.forEach((boid) => {
		let neighbors = boids.filter(nearby, boid);
		boid.move(ctx, neighbors);
	});

	boids.forEach((boid) => {
		boid.draw(ctx);
	});

	window.requestAnimationFrame(flock);
}


window.addEventListener('resize', onResize, false);
window.addEventListener('load', onLoad, false);

const canvasContainer = document.getElementById('canvas-container')

// make the canvas fill its parent
function onResize() {
	// console.log(canvasContainer.clientWidth);
	canvas.width = canvasContainer.clientWidth;
	canvas.height = 500;
	cnv.x = canvas.width;
	cnv.y = canvas.height;

	// canvas.width = window.innerWidth;
	// canvas.height = window.innerHeight;
}

function onLoad() {
	onResize();
}
