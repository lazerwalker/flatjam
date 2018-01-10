var canvas = document.getElementById("game");
var player = document.getElementById("player");

var canvasStyle = window.getComputedStyle(canvas)
var playerStyle = window.getComputedStyle(player)

// Set start position / offset
var playerOffset = {
  x: (parseInt(canvasStyle.width) - parseInt(playerStyle.width)) / 2,
  y: (parseInt(canvasStyle.height) - parseInt(playerStyle.height)) / 2
};

var position = {
  x: 0,
  y: 0
};


// Render the new position
function setPosition(pos, image) {
  var newPos = {
    x: -(pos.x - playerOffset.x),
    y: -(pos.y - playerOffset.y)
  };

  var stringPos = newPos.x + " " + newPos.y;
  image.style.backgroundPosition = stringPos;
}


setInterval(function() {
  position.x += 0.25
  position.y += 0.25
  setPosition(position, canvas)
}, 33) /* 1000/30, or 30fps  */;
