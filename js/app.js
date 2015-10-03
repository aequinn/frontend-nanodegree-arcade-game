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
  this.width;
  this.height;
};

GameSprite.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



/*
* Gem gamesprite and functions
*/
var Gem = function(){
  var gemImages = ['images/gem-blue.png','images/gem-green.png','images/gem-orange.png'];
  var sprite = gemImages[getRandomIntInclusive(0,2)];
  console.log(sprite);
  GameSprite.call(this, sprite);

  this.reset();

};
Gem.prototype = Object.create(GameSprite.prototype);
Gem.prototype.constructor = GameSprite;
Gem.prototype.reset = function(){
  //Generate a valid random x coordinate on the field
  var xCoordinate = getRandomIntInclusive(0,4) * 101;
  //Generate a valid random y coordinate on the field
  var yCoordinate = getRandomIntInclusive(1,3) * 83;
  //make sure they aren't overlapping with another gem

  //Do a wait so there is a delay in it reappearing

  //render
  this.x = xCoordinate;
  this.y = yCoordinate;
};


/*
* Enemy gamesprite and functions
*/
var Enemy = function(){

  GameSprite.call(this, "images/enemy-bug.png" );

  //assign a random multiplier for the speed of the enemy.
  this.velocity = getRandomIntInclusive(100, 402);

  //Reset will place an enemy back at x=0 in a random row.
  this.reset();

};

Enemy.prototype = Object.create(GameSprite.prototype);
Enemy.prototype.constructor = GameSprite;
Enemy.prototype.reset = function(loc){

  //Set the three y cordinates where an enemy can begin
  // about 83 spaces apart
  var startOptions = [60,143, 226];
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

// Player Class and functions
// Creates players and functions to handle the aspects of player
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
      this.moveY = -83;
      break;
    case "down":
      this.moveY = 83;
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

  this.x = 202;
  this.y = 400;

};
//Function that adds current position with movement
Player.prototype.nextMove = function(current, diff){
 return current + diff;
};
Player.prototype.update = function(){

  //Check direction of movement in the x direction
  if(this.moveX != 0 ){
    //Check if moving off vertical boundary of the game board
    if(this.nextMove(this.moveX, this.x)>500 || this.nextMove(this.moveX, this.x)<-5 ){
      this.moveX = 0;
    }else{
      //Update X movement
      this.x = this.nextMove(this.x, this.moveX);
      this.moveX = 0;
    };
  };

  //Check direction of movement in the y direction
  if(this.moveY != 0){
    //check if we will move past the bottom border, don't move if we do.
    if(this.nextMove(this.y, this.moveY) >400){
      this.moveY = 0;
    }else if( this.nextMove(this.y, this.moveY) < 0){
      //check to see if we move past top boundary, reset position if we do.
      this.moveY = 0;
      this.reset();
    }else{
      //If we are in bounds, Update Y movement
      this.y = this.nextMove(this.y, this.moveY);
      this.moveY = 0;
    };
  };

  this.render();
};

/*
* Instantiate game objects.
*/
//Create some gems
var allGems = [new Gem(), new Gem(), new Gem()];

// Place all enemy objects in an array called allEnemies
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];

// Place the player object in a variable called player
var player = new Player();




//Checks for Collisions and updates entities accordingly
//This includes the edges.
var checkCollisions = function(){
  //check the position of each enemy compared to the player to see if they occupy the same space.
  allEnemies.forEach(function(enemy) {
    //Check collision with enemies
    //Check if the right most corner of an enemy is over the left most corner of the player
    if((enemy.x+101 > player.x+50 && enemy.x < player.x+50) ){
      //Check if y cordinates overlap - Player between y+70 y+140 ; enemy y+80 y+145
      if((enemy.y+80 >= player.y+70) && (enemy.y+145 <= player.y+140)){
          player.reset();
      }
    };
    //Check for collision with gems
    /*
    * TO DO:
    * Create gem gamesprite objects
    * Create collection of gems
    */
  });
};

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
