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
  this.width = 0;
  this.height = 0;
};

GameSprite.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//Gameover Object
var GameOverScreen = function(){

};
GameOverScreen.prototype.render = function(){
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "hsla(259, 4%, 25%, 0.5)";
  ctx.fillRect(0, 100, 505, 230);

  ctx.font = "normal 60px "+gameFont+", sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("GAME OVER", 505/2, (171/2+100));
  ctx.fillText("Score: "+scorekeeper.currentScore, 505/2, (171/2+170));
  ctx.font = "normal 20px "+gameFont+", sans-serif";
  ctx.fillText("Press 'ENTER' to play again.", 505/2, (171/2+210));
};
GameOverScreen.prototype.handleInput = function(input){
  switch (input){
    case "enter":
      gameState = 'new';
      avatarPicker.sprite = "";
      break;
  }
};
// method to create an option to create an avatar at the beginning of the game
var AvatarPicker = function(){
  this.sprite = "";
  this.avatarImages = [
          'images/char-boy.png',
          'images/char-cat-girl.png',
          'images/char-horn-girl.png',
          'images/char-pink-girl.png',
          'images/char-princess-girl.png'
  ];
  this.selectorSprite = 'images/selector.png';
  this.selectorX = 0;
  this.selectorY = 100;
};

AvatarPicker.prototype.render = function(){
  ctx.fillStyle = "green";
  ctx.fillRect(0, 100, 505, 280);

  //Draw selector highligher next
  ctx.drawImage(Resources.get(this.selectorSprite), this.selectorX, this.selectorY);

  //loop through avatars and display all
  for(i=0; i < this.avatarImages.length; i++){
    ctx.drawImage(Resources.get(this.avatarImages[i]), i*101, 100);
  };
  ctx.font = "normal 20px "+gameFont+", sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#EEF296";
  ctx.fillText("Navigate using <- and -> arrows.", 505/2, 310);
  ctx.fillText("Select an avatar and begin with 'ENTER'.", 505/2, 350);


};
AvatarPicker.prototype.handleInput = function(input){
  //dependingon movement direction set a move cordinate.
  switch (input){
    case "left":
      if(this.selectorX-101 >= 0){
        this.selectorX += -101;
      }
      break;
    case "right":
      if(this.selectorX+101 <= 404){
        this.selectorX += 101;
      }
      break;
    case "enter":
      this.sprite = this.avatarImages[this.selectorX/101];
      break;
  }
  this.update();
};
AvatarPicker.prototype.update = function(){
  ctx.drawImage(Resources.get(this.selectorSprite), this.selectorX, this.selectorY);
};
/*
* Gem gamesprites and functions
*/
var Gem = function(){
  var gems = [['images/gem-blue.png',150],['images/gem-green.png',100],['images/gem-orange.png',50]];
  var gem = gems[getRandomIntInclusive(0,2)];

  GameSprite.call(this, gem[0]);
  this.value = gem[1];

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
  this.width = 101*0.75;
  this.height = 171*0.70;
};
Gem.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x+13, this.y+13, this.width, this.height);
};
Gem.prototype.clear = function(){
  this.x = -100;
  this.y = -100;
  this.render();
};

/*
* @Description scorekeeper object
*/
var ScoreKeeper = function(){
  GameSprite.call(this, "");
  this.currentScore = 0;
  this.topScore = 0;
  this.x = 0;
  this.y = 0;
  this.reset();
};
ScoreKeeper.prototype = Object.create(GameSprite.prototype);
ScoreKeeper.prototype.constructor = GameSprite;
ScoreKeeper.prototype.reset = function() {
  this.x = 303;
  this.y = 40;
};
ScoreKeeper.prototype.render = function() {
  ctx.font = "normal 18px "+gameFont+", sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "#222";
  ctx.fillText("Score: "+this.currentScore, ctx.canvas.clientWidth/2, 40);
};
ScoreKeeper.prototype.update = function(points) {
    this.currentScore += points;
};

/*
* Enemy gamesprite and functions
*/
var Enemy = function(){

  GameSprite.call(this, "images/enemy-bug.png" );
  //Reset will place an enemy back at x=0 in a random row.
  this.reset();

};

Enemy.prototype = Object.create(GameSprite.prototype);
Enemy.prototype.constructor = GameSprite;
Enemy.prototype.reset = function(){

  //Set the three y cordinates where an enemy can begin
  // about 83 spaces apart
  var startOptions = [60,143, 226];
  //Get a random start location between 0 and 2
  var rand = getRandomIntInclusive(0, 2);
  //assign a random multiplier for the speed of the enemy.
  this.velocity = getRandomIntInclusive(100, 502);
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
  }

  this.render();

};

/*
* Health tracker
*/
var HealthKeeper = function(){
  GameSprite.call(this, "images/heart.png");
  this.reset();
};

HealthKeeper.prototype = Object.create(GameSprite.prototype);
HealthKeeper.prototype.constructor = GameSprite;
//render
HealthKeeper.prototype.render = function(){
  ctx.fillText("Health: ",375, 40);
  for(i=this.health; i >= 0; i--){
    ctx.drawImage(Resources.get(this.sprite), 480-(i*101*.25), 12, 101*.25, 171*.25);
  };
};
//update health
HealthKeeper.prototype.hit = function(){
  this.health = this.health - 1;
  if(this.health < 0){
    gameState = 'gameOver';
  }
};

HealthKeeper.prototype.reset = function(){
  this.health = 3;
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
  }
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
  if(this.moveX !== 0 ){
    //Check if moving off vertical boundary of the game board
    if(this.nextMove(this.moveX, this.x)>500 || this.nextMove(this.moveX, this.x)<-5 ){
      this.moveX = 0;
    }else{
      //Update X movement
      this.x = this.nextMove(this.x, this.moveX);
      this.moveX = 0;
    }
  }

  //Check direction of movement in the y direction
  if(this.moveY !== 0){
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
    }
  }

  this.render();
};

/*
* Instantiate game objects.
*/
//set a gameState variable to track different states of the game
var gameFont = "Montserrat";
var gameState = "new";

//Creaet an avatarPicker
var avatarPicker = new AvatarPicker();

//Create some gems
var allGems = [new Gem(), new Gem(), new Gem()];

// Place all enemy objects in an array called allEnemies
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];

// Place the player object in a variable called player
var player = new Player();
var scorekeeper = new ScoreKeeper();
var healthKeeper = new HealthKeeper();
var gameOverScreen = new GameOverScreen();

//Checks for Collisions with other Sprites and gameboard edges then updates entities accordingly
var checkCollisions = function(){

  allGems.forEach(function(gem){
    if((gem.x+gem.width+15 > player.x+50) && (gem.x+15 < player.x+50)){
      if((gem.y+60 >= player.y+70) && (gem.y+108 <= player.y+140)){
        scorekeeper.currentScore += gem.value;
        gem.clear();
        setTimeout(function () {
          gem.reset();
        }, 3000);
      }
    }
  });

  //check the position of each enemy compared to the player to see if they occupy the same space.
  allEnemies.forEach(function(enemy) {
    //Check collision with enemies
    //Check if the right most corner of an enemy is over the left most corner of the player
    if((enemy.x+101 > player.x+50 && enemy.x < player.x+50) ){
      //Check if y cordinates overlap - Player between y+70 y+140 ; enemy y+80 y+145
      if((enemy.y+80 >= player.y+70) && (enemy.y+145 <= player.y+140)){
          healthKeeper.hit();
          player.reset();
      }
    }

  });
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
if(gameState == 'new'){
  avatarPicker.handleInput(allowedKeys[e.keyCode]);
}else if(gameState == 'gameOver'){
  gameOverScreen.handleInput(allowedKeys[e.keyCode]);
}else{
  player.handleInput(allowedKeys[e.keyCode]);
}

});

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
// Using from MDN to generate random whole numbers for several aspects of the game.
// Starting position for enemies & gems
// Velocity for enemies
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
