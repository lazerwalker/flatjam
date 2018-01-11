const CELL_SIZE = 50;
const SCALE = 1;

const IMAGE = new Image(3547, 2388);
IMAGE.src = '../tubing-map.jpg';

const NUM_COLS = Math.ceil(IMAGE.width / CELL_SIZE);
const NUM_ROWS = Math.ceil(IMAGE.height / CELL_SIZE);

const canvas = document.createElement('canvas');
canvas.setAttribute('width', `${IMAGE.width * SCALE}px`);
canvas.setAttribute('height', `${IMAGE.height * SCALE}px`);
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

var SET_MAG_TO = 1.2;

function line(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke()
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
	for (let x = 0; x <= canvas.width; x += CELL_SIZE * SCALE) {
		line(x, 0, x, canvas.width);
	}
	for (let y = 0; y <= canvas.height; y += CELL_SIZE * SCALE) {
		line(0, y, canvas.height, y);
	}
}

function drawVectors() {
	ctx.lineWidth = 2;
	for (let c = 0; c < NUM_COLS; c++) {
		for (let r = 0; r < NUM_ROWS; r++) {
			let x = vectors[c][r].x;
			let y = vectors[c][r].y;
			if ((x === 0 && y === 0) || isNaN(x) || isNaN(y) || x === null || y === null) {
				ctx.fillStyle = 'rgba(255,0,0,0.5)'
				ctx.fillRect(c * CELL_SIZE * SCALE, r * CELL_SIZE * SCALE, CELL_SIZE * SCALE, CELL_SIZE * SCALE);
			}
			else {
				let n = Math.floor(255 * vectors[c][r].mag / 1.5);
				ctx.fillStyle = `rgba(${n}, ${n}, ${n}, 0.8)`;
				ctx.fillRect(c * CELL_SIZE * SCALE, r * CELL_SIZE * SCALE, CELL_SIZE * SCALE, CELL_SIZE * SCALE);
				let angle = (vectors[c][r].angle + 360) % 360;
				ctx.strokeStyle = `rgb(${angle > 180 ? 200 : 0},0,${angle < 90 || angle > 270 ? 200 : 0})`;
				line(
					(c + 0.5 - x / 2) * CELL_SIZE * SCALE,
					(r + 0.5 - y / 2) * CELL_SIZE * SCALE,
					(c + 0.5 + x / 2) * CELL_SIZE * SCALE,
					(r + 0.5 + y / 2) * CELL_SIZE * SCALE)
			}
		}
	}
}

setInterval(() => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawMap();
	drawScreen(0.9);
	// drawGrid();
	drawVectors();
}, 16);

let isMouseDown = false;
let downMousePosition = null;
let prevMousePositions = [];

document.body.addEventListener('mousedown', evt => {
	isMouseDown = true;
	prevMousePositions = [];
	if (evt.shiftKey) {
		downMousePosition = { x: evt.offsetX, y: evt.offsetY };
	}
	else {
		downMousePosition = null;
	}
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
		let cellX;
		let cellY;
		let startX;
		let startY;
		let endX;
		let endY;
		if (downMousePosition) {
			cellX = downMousePosition.x;
			cellY = downMousePosition.y;
			startX = cellX;
			startY = cellY;
			endX = evt.offsetX;
			endY = evt.offsetY;
		}
		else {
			cellX = evt.offsetX;
			cellY = evt.offsetY;
			startX = prevMousePositions[0].x;
			startY = prevMousePositions[0].y;
			endX = cellX;
			endY = cellY;
		}
		let col = Math.floor(cellX / (CELL_SIZE * SCALE));
		let row = Math.floor(cellY / (CELL_SIZE * SCALE));
		let dx = endX - startX;
		let dy = endY - startY;
		let dist = Math.sqrt(dx * dx + dy * dy);
		vectors[col][row].x = dx / dist;
		vectors[col][row].y = dy / dist;
		vectors[col][row].angle = Math.round(Math.atan2(dy, dx) * 180 / Math.PI);
		// vectors[col][row].mag = SET_MAG_TO;
	}
});