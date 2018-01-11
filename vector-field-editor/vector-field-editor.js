const CELL_SIZE = 50;
const SCALE = 1 / 4;

const IMAGE = new Image(3547, 2388);
IMAGE.src = '../tubing-map.jpg';

const NUM_COLS = Math.ceil(IMAGE.width / CELL_SIZE);
const NUM_ROWS = Math.ceil(IMAGE.height / CELL_SIZE);

const canvas = document.createElement('canvas');
canvas.setAttribute('width', `${IMAGE.width * SCALE}px`);
canvas.setAttribute('height', `${IMAGE.height * SCALE}px`);
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

function line(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke()
}

let vectors = [];
for (let c = 0; c < NUM_COLS; c++) {
	vectors[c] = [];
	for (let r = 0; r < NUM_ROWS; r++) {
		vectors[c][r] = { x: 0, y: 0 };
	}
}

function drawMap() {
	ctx.drawImage(IMAGE, 0, 0, IMAGE.width * SCALE, IMAGE.height * SCALE);
}

function drawScreen(opacity) {
	ctx.fillStyle = `rgba(255, 255, 255, ${opacity}`;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGrid() {
	ctx.strokeStyle = '#000';
	ctx.lineWidth = 0.5;
	for (let x = 0; x <= IMAGE.width; x += CELL_SIZE * SCALE) {
		line(x, 0, x, canvas.width);
	}
	for (let y = 0; y <= IMAGE.height; y += CELL_SIZE * SCALE) {
		line(0, y, IMAGE.height, y);
	}
}

function drawVectors() {
	line.strokeStyle = '#f00';
	for (let c = 0; c < NUM_COLS; c++) {
		for (let r = 0; r < NUM_ROWS; r++) {
			line(
				(c + 0.5) * CELL_SIZE * SCALE,
				(r + 0.5) * CELL_SIZE * SCALE,
				(c + 0.5 + vectors[c][r].x / 2) * CELL_SIZE * SCALE,
				(r + 0.5 + vectors[c][r].y / 2) * CELL_SIZE * SCALE)
		}
	}
}

setInterval(() => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawMap();
	drawScreen(0.8);
	// drawGrid();
	drawVectors();
}, 100);

let isMouseDown = false;
let prevMousePositions = [];

document.body.addEventListener('mousedown', evt => {
	isMouseDown = true;
	prevMousePositions = [];
});

document.body.addEventListener('mouseup', evt => {
	isMouseDown = false;
});

document.body.addEventListener('mousemove', evt => {
	if (isMouseDown) {
		prevMousePositions.push({ x: evt.offsetX, y: evt.offsetY });
		if (prevMousePositions.length > 5) {
			prevMousePositions.shift();
		}
		let col = Math.floor(evt.offsetX / (CELL_SIZE * SCALE));
		let row = Math.floor(evt.offsetY / (CELL_SIZE * SCALE));
		let dx = evt.offsetX - prevMousePositions[0].x;
		let dy = evt.offsetY - prevMousePositions[0].y;
		let dist = Math.sqrt(dx * dx + dy * dy);
		vectors[col][row] = { x: dx / dist, y: dy / dist };
	}
});