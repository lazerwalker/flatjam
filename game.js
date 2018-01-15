var map = document.getElementById("map")
var player = document.getElementById("player")
var ctx = document.getElementById("canvas").getContext('2d')

var PLAYER_CONTROL_POWER = 0.03;
var VECTOR_FIELD_POWER = 0.1;
var TURBO_MODE = false;
var FRICTION = 0.9;

var topX = 0;

var LEFT_EXIT_X = {
  min: 1190,
  max: 1460
}

var RIGHT_EXIT_X = {
  min: 2010,
  max: 2365
}

var ENTRANCE_X_MIN = 630;

var CELL_SIZE = 50;

var position,
  velocity,
  playerOffset,
  ctx,
  canvasWidth,
  canvasHeight;

var Directions = [
  { keyCode: 37,  name: "left", x: -1, y: 0 },
  { keyCode: 39, name: "right", x: 1, y: 0 },
  { keyCode: 38, name: "up", x: 0, y: -1 },
  { keyCode: 40, name: "down", x: 0, y: 1 }
]

var scale = 1.0

setupStartingPosition();
setupKeyboardHandling();

function setupStartingPosition() {
  var canvasStyle = window.getComputedStyle(canvas)
  var playerStyle = window.getComputedStyle(player)

  canvasWidth = parseInt(canvasStyle.width)
  canvasHeight = parseInt(canvasStyle.height)

  playerOffset = {
    x: (canvasWidth - parseInt(playerStyle.width)) / 2,
    y: (canvasHeight - parseInt(playerStyle.height)) / 2
  };

  position = {
    x: 830,
    y: 2030
  };

  velocity = {
    x: 0,
    y: 0
  }
}

function setupKeyboardHandling() {
  window.addEventListener('keyup', function(e) {
    var direction = Directions.filter(function(d) {
      return d.keyCode === e.keyCode
    })[0];

    if (direction) {
      direction.pressed = false;
    }
  });

  window.addEventListener('keydown',  function(e) {
    var direction = Directions.filter(function(d) {
      return d.keyCode === e.keyCode
    })[0];

    if (direction) {
      direction.pressed = true;
    }
  });
}

function render() {
  var renderPos = {
    x: position.x - playerOffset.x,
    y: position.y - playerOffset.y
  }

	ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  if (renderPos.y < 0) {
    var leftBorder;
    if (position.x < RIGHT_EXIT_X.min) {
      leftBorder = LEFT_EXIT_X.min;
    } else {
      leftBorder = RIGHT_EXIT_X.min;
    }

    var xOffset = leftBorder - renderPos.x

    ctx.drawImage(map, ENTRANCE_X_MIN - 30, map.height + renderPos.y, canvasWidth, canvasHeight, xOffset, 0, canvasWidth, canvasHeight)
  }

  ctx.drawImage(map, renderPos.x, renderPos.y, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight)
  ctx.drawImage(player, playerOffset.x, playerOffset.y)
}

// Main game loop
setInterval(function() {
  if (position.y < 0) {
    var diff;
    if (position.x < RIGHT_EXIT_X.min) {
      diff = Math.min(position.x - LEFT_EXIT_X.min, LEFT_EXIT_X.max - LEFT_EXIT_X.min)
    } else {
      diff = Math.min(position.x - RIGHT_EXIT_X.min, RIGHT_EXIT_X.max - RIGHT_EXIT_X.min)
    }

    position = {
      x: 630 + diff,
      y: map.height - player.height
    }
  }

  var numExecutions = TURBO_MODE ? 20 : 1;
  for (var i = 0; i < numExecutions; i++) {
    var vectorFieldPos = {
      col: Math.floor(position.x / CELL_SIZE),
      row: Math.floor(position.y / CELL_SIZE)
    }

    var vector = vectors[vectorFieldPos.col][vectorFieldPos.row];

    velocity.x += vector.x * vector.mag * VECTOR_FIELD_POWER;
    velocity.y += vector.y * vector.mag * VECTOR_FIELD_POWER;

    Directions.forEach(function(d) {
      if (d.pressed) {
        velocity.x += d.x * PLAYER_CONTROL_POWER;
        velocity.y += d.y * PLAYER_CONTROL_POWER;
      };
    })

    velocity.x *= FRICTION;
    velocity.y *= FRICTION;

    position.x += velocity.x;
    position.y += velocity.y;
  }

  render()
}, 33) /* 1000/30, or 30fps  */;
