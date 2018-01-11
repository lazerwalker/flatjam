var map = document.getElementById("map")
var player = document.getElementById("player")

var PLAYER_CONTROL_POWER = 0.03;
var VECTOR_FIELD_POWER = 0.1;

var CELL_SIZE = 50;

var position, velocity, playerOffset, ctx, canvas;

var Directions = [
  { keyCode: 37,  name: "left", x: -1, y: 0 },
  { keyCode: 39, name: "right", x: 1, y: 0 },
  { keyCode: 38, name: "up", x: 0, y: -1 },
  { keyCode: 40, name: "down", x: 0, y: 1 }
]

setupStartingPosition();
setupKeyboardHandling();


function setupStartingPosition() {
  var canvasStyle = window.getComputedStyle(canvas)
  var playerStyle = window.getComputedStyle(player)

  playerOffset = {
    x: (parseInt(canvasStyle.width) - parseInt(playerStyle.width)) / 2,
    y: (parseInt(canvasStyle.height) - parseInt(playerStyle.height)) / 2
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



// Render the new position
function setPosition(pos, image) {
  var newPos = {
    x: -(pos.x - playerOffset.x),
    y: -(pos.y - playerOffset.y)
  };

  var stringPos = newPos.x + " " + newPos.y;
  image.style.backgroundPosition = stringPos;
}

// Main game loop
setInterval(function() {
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

  velocity.x *= 0.9;
  velocity.y *= 0.9;

  position.x += velocity.x;
  position.y += velocity.y;

  setPosition(position, canvas)
}, 33) /* 1000/30, or 30fps  */;
