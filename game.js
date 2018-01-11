var canvas = document.getElementById("game");
var player = document.getElementById("player");

var position, playerOffset;

var Directions = [
  { keyCode: 37,  name: "left", x: -0.25, y: 0 },
  { keyCode: 39, name: "right", x: 0.25, y: 0 },
  { keyCode: 38, name: "up", x: 0, y: -0.25 },
  { keyCode: 40, name: "down", x: 0, y: 0.25 }
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
    x: 0,
    y: 0
  };
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
    console.log(e.keyCode)

    var direction = Directions.filter(function(d) {
      console.log(d.keyCode)
      return d.keyCode === e.keyCode
    })[0];

    if (direction) {
      console.log("Pressed " + direction.name)
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
  position.x += 0
  position.y += 1

  Directions.forEach(function(d) {
    if (d.pressed) {
      position.x += d.x;
      position.y += d.y;
    };
  })

  setPosition(position, canvas)
}, 33) /* 1000/30, or 30fps  */;
