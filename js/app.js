
/* A GameSprite Object
* A common parent object for game entities that need
* position x, y
* update function
* render function
*/
var GameSprite = function(sprite){
  this.x = 0;
  this.y = 0;
  this.moveX = 0;
  this.moveY = 0;
  this.sprite = sprite;
};

GameSprite.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
    GameSprite.call(this, "images/enemy-bug.png" );

    //assign a random multiplier for the speed of the enemy.
    this.velocity = getRandomIntInclusive(85, 202);

    //Reset will place an enemy back at x=0 in a random row.
    this.reset();

};

Enemy.prototype = Object.create(GameSprite.prototype);
Enemy.prototype.constructor = GameSprite;
Enemy.prototype.reset = function(loc){

  //Set the three y cordinates where an enemy can begin
  var startOptions = [60,145, 225];
  //Get a random start location between 0 and 2
  var rand = getRandomIntInclusive(0, 2);
  //Set X cordinate to negative the velocity. This will keep it from looking like it jumps the first time
  this.x =  this.velocity*-1;
  //Get the random start row
  this.y = startOptions[rand];
};
Enemy.prototype.update = function(dt){
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x = this.x + this.velocity * dt;
  if(this.x >= 601){
    this.reset();
  };
  this.render();

};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
  //Load player sprite image
  GameSprite.call(this, "images/char-boy.png");
  this.reset();

};
Player.prototype = Object.create(GameSprite.prototype);
Player.prototype.constructor = GameSprite;
// Read input from the keyboard and move player.
// Check bountries
Player.prototype.handleInput = function(input){
  //dependingon movement direction set a move cordinate.
  switch (input){
    case "up":
      this.moveY = -85;
      break;
    case "down":
      this.moveY = 85;
      break;
    case "left":
      this.moveX = -101;
      break;
    case "right":
      this.moveX = 101;
      break;
  };
  this.update();
};
// Move player back to initial starting point
Player.prototype.reset = function(){
  this.x = 200;
  this.y = 390;

};
Player.prototype.update = function(){
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if(this.moveX != 0){
    //Update X movement
    this.x = (this.x + this.moveX);
    this.moveX = 0;
  };
  if(this.moveY != 0){
    //Update Y movement
    this.y = (this.y + this.moveY);
    this.moveY = 0;
  };

  //Check for collisions
  console.log("Check Collisions");
  allEnemies.forEach(function(enemy) {
    console.log("ex: "+ enemy.x+ " ey: "+ enemy.y);
    console.log("px: " + player.x+ " py: "+ player.y);
      if(enemy.x == player.x && enemy.y == player.y){

        this.reset();
      };
  });

  this.render();

};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];

// Place the player object in a variable called player
var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
// Using from MDN to generate random starting row for Enemies.
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
