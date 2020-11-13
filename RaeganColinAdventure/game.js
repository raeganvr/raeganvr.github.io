const levels = [
	//level 0
    ["flag", "rock", "", "rock", "tree", "tree", "rider",
     "", "rock", "rock", "", "", "", "",
     "fenceside", "tree", "start animate", "animate", "animate", "fenceside", "rock", 
     "", "water", "", "", "tree", "", "",
     "fenceside", "water", "", "tree", "", "rock", "",
     "", "tree", "", "", "", "", "",
     "", "fence", "", "", "horseup", "water", "water"],

     // level 1
     ["water", "rider", "tree", "horsedown", "rock", "", "tree",
     "water", "bridge", "rock", "", "rock", "", "",
     "start animate", "animate", "animate", "animate", "animate", "", "tree",
     "rock", "rock", "tree", "water", "water", "", "",
     "flag", "rock", "", "fence", "", "", "",
     "fenceside", "rock", "", "tree", "rock", "", "rock",
     "", "", "", "fence", "", "", ""],

     //level 2
     ["rock", "", "flag", "tree", "rider", "", "",
     "", "rock", "fenceside", "tree", "", "", "",
     "start animate", "animate", " bridge animate", "animate", "", "", "",
     "tree", "", "water", "", "rock", "", "",
     "horseup", "", "tree", "water", "tree", "", ""],

     //level 3
     ["", "horsedown", "rock", "", "flag", "", "",
     "water", "bridge", "water", "tree", "fenceside", "", "",
     "water", "", "tree", "rock", "", "", "",
     "tree", "start animate", "animate", "animate", "animate", "", "",
     "", "rock", "", "rider", "tree", "", ""],

     //level 4
     ["tree", "horsedown", "", "fence", "rider", "", "",
     "water", "bridge", "tree", "rock", "", "", "",
     "water", "", "", "", "", "", "",
     "start animate", "animate", "animate", "water", "water", "", "",
     "tree", "rock", "", "fence", "flag", "", ""]
    ];// end of levels
	 
	 
const gridBoxes = document.querySelectorAll("#gameBoard div");
const noPassObstacles = ["rock", "tree", "water"]; //impassable objects

var currentLevel = 0; //starting level
var riderOn = false; // is the rider on?
var currentLocationOfHorse = 0; //Horse Position
var currentLocationOfEnemy = 0; //Enemy Position
var counter = 0; //tracks current location of enemy
var currentAnimation; // allows 1 animation per level
var enemyStart; //where enemy starts
var widthOfBoard = 7; //width of board
var cross = new sound("sounds/OOF.mp3"); //sound when going over barrier
var death = new sound("sounds/deathsound.mp3"); //sound when user dies
var claim = new sound("sounds/swordpull.mp3"); //sound when user gets rider
var gameMusic = new sound ("sounds/ninjamusic.mp3"); //game music
var winSound = new sound ("sounds/win.mp3"); //victory music

//object constructor to play sounds
//https://www.w3schools.com/graphics/game_sound.asp
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

//start
window.addEventListener("load", function(){
	loadLevel();
});

//improve horse
document.addEventListener("keydown", function(e){
	
	switch(e.keyCode){
		case 37: // left arrow
			if(currentLocationOfHorse % widthOfBoard !== 0){
				tryToMove("left");
			}
			break;
		case 38: // up arrow
			if(currentLocationOfHorse - widthOfBoard >= 0) {
				tryToMove("up");
			}
			break;
		case 39: // right arrow
			if(currentLocationOfHorse % widthOfBoard < widthOfBoard - 1){
				tryToMove("right");
			}
			break;
		case 40: // down arrow
			if(currentLocationOfHorse + widthOfBoard < widthOfBoard * widthOfBoard){
				tryToMove("down");
			}
			break;
	}// switch
}); // key event listener


// try to move horse
function tryToMove(direction){
	
	// location before move
	let oldLocation = currentLocationOfHorse
	
	// class of location before move
	let oldClassName = gridBoxes[oldLocation].className;
	
	let nextLocation = 0; // location we wish to move to
	let nextClass = ""; // class of locations we wish to move to
	
	let nextLocation2 = 0;
	let nextClass2 = "";
	
	let newClass = ""; // new class to switch to if move successful
	
	
	switch(direction){
		case "left":
			nextLocation = currentLocationOfHorse - 1;
			break;
		case "right":
			nextLocation = currentLocationOfHorse + 1;
			break;
		case "up":
			nextLocation = currentLocationOfHorse - widthOfBoard;
			break;
		case "down":
			nextLocation = currentLocationOfHorse + widthOfBoard;
			break;
		
	}//switch
	
	nextClass = gridBoxes[nextLocation].className;
	
	// if the obstacle is not passable, don't move
	if(noPassObstacles.includes(nextClass)) { return; }
	
	// if it's a fence, and there is no rider, don't move
	if(!riderOn && nextClass.includes("fence")) { return; }
	
	// if there is a fence, move two spaces with animation
	if(nextClass.includes("fence")){
		
		// rider must be on to jump
		if(riderOn){
			gridBoxes[currentLocationOfHorse].className = "";
			oldClassName = gridBoxes[nextLocation].className;
			
			// set values according to direction
			if(direction == "left"){
				cross.play();
				nextClass = "jumpleft";
				nextClass2 = "horserideleft";
				nextLocation2 = nextLocation - 1 ;
			} else if (direction == "right") {
				cross.play();
				nextClass = "jumpright";
				nextClass2 = "horserideright";
				nextLocation2 = nextLocation + 1;
			} else if (direction == "up") {
				cross.play();
				nextClass = "jumpup";
				nextClass2 = "horserideup";
				nextLocation2 = nextLocation - widthOfBoard;
			} else if (direction == "down") {
				cross.play();
				nextClass = "jumpdown";
				nextClass2 = "horseridedown";
				nextLocation2 = nextLocation + widthOfBoard;
			}//else if
			
			// if impassable object after fence, dont move
			if(gridBoxes[nextLocation2].className.includes("impassable")){
				gridBoxes[currentLocationOfHorse].className = nextClass2;
				return;
			} // if 
	 
			//if fence is at edge if grid
			if(nextLocation2 % widthOfBoard == 1){
				currentLocationOfHorse = oldLocation;
				gridBoxes[currentLocationOfHorse].className = nextClass2;
				return; 
			} // if 
			
			//show horse jumping
			gridBoxes[nextLocation].className = nextClass;
			
			setTimeout(function(){
				
				// set jump back to just a fence
				gridBoxes[nextLocation].className = oldClassName;
				
				// update current location of horse to be 2 spaces past take off
				currentLocationOfHorse = nextLocation2;
				
				//get class of box after jump
				nextClass = gridBoxes[currentLocationOfHorse].className;
				
				//show horse and rider after landing
				gridBoxes[currentLocationOfHorse].className = nextClass2;
				
				// if next box is a flag, go up a level
				levelUp(nextClass);
			},350);
			return;
		}// if riderOn
	}// if class has fence
	
	// if there is a rider, add rider
	if(nextClass == "rider"){
		claim.play();
		riderOn = true;
	}
	
	// if there is a bridge in the old location keep it 
	if(oldClassName.includes("bridge")){
		gridBoxes[oldLocation].className = "bridge";
	}else{
		gridBoxes[oldLocation].className = "";
	}// else
	
	// build name of new class
	newClass = (riderOn) ? "horseride" : "horse"; 
	newClass += direction;
	
	// if there is a bridge in the next location, keep it 
	if(gridBoxes[nextLocation].classList.contains("bridge")){
		newClass += " bridge";
	}
	// move 1 space
	currentLocationOfHorse = nextLocation;
	gridBoxes[currentLocationOfHorse].className = newClass;
	
	//if it is an enemy
	if(nextClass.includes("enemy")) {
		death.play();
		document.getElementById("lose").style.display = "block";
		return;	
	} //if
  
	// move up to next level if needed
	levelUp(nextClass);
	
}//tryToMove

// move up a level
function levelUp(nextClass){
	if(nextClass == "flag" && riderOn && currentLevel !== 4){
		gameMusic.play();
		document.getElementById("levelup").style.display = "block";
		clearTimeout(currentAnimation);
		setTimeout(function(){
			document.getElementById("levelup").style.display = "none";
			currentLevel++;
			loadLevel();
		}, 1000);
		
	}else if(nextClass == "flag" && riderOn && currentLevel == 4){
		winSound.play();
		document.getElementById("win").style.display = "block";
		clearTimeout(currentAnimation);
	}
}//levelup

//load levels 0 - maxlevel
function loadLevel(){
  let levelMap = levels[currentLevel];
  let animateBoxes;
  riderOn = false;

  if (currentLevel <= 0){
      // load board
      for(i = 0; i < gridBoxes.length; i++) {
         gridBoxes[i].className = levelMap[i];
         if (levelMap[i].includes("horse")) currentLocationOfHorse = i;
         if (levelMap[i].includes("start animate")){
         enemyStart = i;
         currentLocationOfEnemy = enemyStart;
         }//if
      }//for

      animateBoxes = document.querySelectorAll(".animate");

      animateEnemy(animateBoxes, 0, "right");

  }else if (currentLevel <= 4 && currentLevel > 0){
      // load board
      for(i = 0; i < gridBoxes.length; i++) {
         gridBoxes[i].className = levelMap[i];
         if (levelMap[i].includes("horse")) currentLocationOfHorse = i;
         if (levelMap[i].includes("start animate")){
         enemyStart = i - 1;
         currentLocationOfEnemy = enemyStart;
         }//if
      }//for

      animateBoxes = document.querySelectorAll(".animate");

      animateEnemy(animateBoxes, 0, "right");

  }//if

}//loadleve

//animate enemy left to right (could add up and down to this)
// boxes - array of grid boxes that include animation
// index - curent locaton of animation
// direction - curent direction of animation
function animateEnemy(boxes, index, direction) {
	
	//exit function if no animation
	if(boxes.length <= 0) {return;}
	
	//update images
	if (direction == "right") {
		boxes[index].classList.add("enemyright");
	}else{
		boxes[index].classList.add("enemyleft");
	}//if/else
	
	//remove images from other boxes
	for(var i = 0; i < boxes.length; i++){
		if(i != index){
		  boxes[i].classList.remove("enemyleft");
		  boxes[i].classList.remove("enemyright");		  
		}//if
		
	}//for

	// moving right
	if(direction == "right"){
		if(counter >= 1){
			currentLocationOfEnemy++;
		}//if
	}//if
	
	if(direction == "right") {
		//turn around if hit right side
		if(index == boxes.length - 1){
			index--;
			direction = "left";
		}else {
			index++;
		}//end else if
		
	//moving left
	} else {
		if(counter >= 1){
			currentLocationOfEnemy--;
		}//if
		//turn around if hit side
	if(index == 0) {
	//turn around if hit left side
		index++;
		direction = "right";
		} else {
			index--;
		}//else
	}//else
	
    //if enemy runs into player
	if(currentLocationOfHorse == currentLocationOfEnemy){
		document.getElementById("lose").style.display = "block";
	    clearTimeout(currentAnimation);
		return;
	}//if
	
	currentAnimation = setTimeout(function(){
	  animateEnemy(boxes, index, direction);
	}, 750);
	
    counter++;
	
}//animateEnemy



// intro code -----------------------------
// change the visibility of divIs
function changeVisibility(divId){
	let element = document.getElementById(divId);
	
	// if element exists, it is considered true
	if(element){
		element.className = (element.className == 'hidden')? 'unhidden':'hidden';
	}// if
	
}// changeVisibility

// display ligtbox with big image in it
function displayLightBox(alt, imageFile){
	
	let bigImage = document.getElementById("bigImage");
	let image = new Image();
	
	// updates the big image to access
	image.src = "images/" + imageFile;
	
	// force big image to preload so we can access width
	// to center image on page
	image.onload = function(){
		let width = image.width;
		document.getElementById("boundaryBigImage").style.width = width + "px";
	};
	
	bigImage.src = image.src;
	bigImage.alt = alt;
	
	changeVisibility("lightbox");
	changeVisibility("positionBigImage");
} // displayLighBox