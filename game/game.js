/*global PIXI*/

var loader = new PIXI.AssetLoader(["sprites/shapes.json"]);
loader.onComplete = onAssetsLoaded;
loader.load();


var width = window.innerWidth;
var height = window.innerHeight;

// create a renderer instance.
var renderer = PIXI.autoDetectRenderer(width, height);

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0);


var sprites;
var sparks = [];

function onAssetsLoaded() {

  // add the renderer view element to the DOM
  document.body.textContent = "";
  document.body.appendChild(renderer.view);

  sprites = ["triangle", "square", "pentagon", "hexagon"].map(function (name) {
    var sprite = PIXI.Sprite.fromFrame(name);
    sprite.name = name;
    sprite.position.x = (width / 2)|0;
    sprite.position.y = (height / 2)|0;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.visible = false;
    return sprite;
  });

  before = Date.now();
  window.requestAnimationFrame(tick);
}

function createSpark(x, y, mx, my) {
  var sprite = PIXI.Sprite.fromFrame("star");
  sprite.position.x = x + Math.random() * 10 - 5;
  sprite.position.y = y + Math.random() * 10 - 5;
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;
  sprite.lifetime = 1000;
  sprite.mx = mx;
  sprite.my = my;
  stage.addChild(sprite);
  sparks.push(sprite);
}

var before;
function tick() {
  var now = Date.now();
  var delta = now - before;
  before = now;

  var gamepads = navigator.webkitGetGamepads();

  sprites.forEach(function (sprite, i) {
    var gamepad = gamepads[i];
    if (gamepad) {
      if (!sprite.visible) {
        sprite.visible = true;
        stage.addChild(sprite);
      }
      sprite.x += gamepad.axes[0] * delta;
      sprite.y += gamepad.axes[1] * delta;
      if (sprite.x < 0) sprite.x = 0;
      if (sprite.x > width) sprite.x = width;
      if (sprite.y < 0) sprite.y = 0;
      if (sprite.y > height) sprite.y = height;
      var angle;
      if (Math.abs(gamepad.axes[0]) > 0.1 || Math.abs(gamepad.axes[1]) > 0.1) {
        angle = -Math.atan(gamepad.axes[0] / gamepad.axes[1]);
        if (gamepad.axes[1] < 0) angle += Math.PI;
        if (sprite.rotation < angle) sprite.rotation += Math.min(angle - sprite.rotation, delta / 200);
        if (sprite.rotation > angle) sprite.rotation -= Math.min(sprite.rotation - angle, delta / 200);
      }
      if (gamepad.buttons[11]) {
        angle = Math.atan(gamepad.axes[2] / gamepad.axes[3]);
        if (gamepad.axes[3] < 0) angle += Math.PI;
        createSpark(sprite.x, sprite.y, gamepad.axes[0] + gamepad.axes[2], gamepad.axes[1] + gamepad.axes[3]);
      }
    }
    else {
      if (sprite.visible) {
        sprite.visible = false;
        stage.removeChild(sprite);
      }
    }
  });
  for (var i = sparks.length - 1; i >= 0; i--) {
    var spark = sparks[i];
    spark.rotation += delta / 100;
    spark.alpha = (1000 - spark.lifetime) / 1000;

    spark.x += spark.mx * delta;
    spark.y += spark.my * delta;
    spark.lifetime -= delta;
    if (spark.lifetime < 0) {
      stage.removeChild(spark);
      sparks.splice(i, 1);
    }
  }
  renderer.render(stage);
  window.requestAnimationFrame(tick);
}
