var circles = [];
var xChange = [];
var yChange = [];
var hasHitPad1 = [];
const colors = ["red", "orange", "yellow", "lime", "fuchsia"];
const maxHeight = window.innerHeight - 30;
const halfHeight = maxHeight / 2;
const maxWidth = window.innerWidth;
const halfWidth = maxWidth / 2;
const circleSize = maxHeight * .05;
const halfCircle = circleSize / 2;
const minPixSize = .001 * maxWidth;
const internval = setInterval(move, 0);
const spawner = document.getElementById("spanwer");
const pad1 = document.getElementById("paddle1");
const spawn = document.getElementById("spawn");
const thing = document.getElementById("thing");
const padHieght = maxHeight*.09;
var pad1Change = 0;
const pad2 = document.getElementById("paddle2");
var pad2Change = 0;
var index = 0;
const leftCheck = 60;
const rightCheck = maxWidth - 60;
var score1 = 0;
const scoreText1 = document.getElementById("score1");
var score2 = 0;
const scoreText2 = document.getElementById("score2");
var circleIndex = 0;
const intevalSpawner = setInterval(circleCreator, 10000);
const result = document.getElementById("result");
const winScore = 100;
var cheatRight = false;
var cheatLeft = false;
var leftXFlip = 1000000;
var rightXFlip = 1000000;
var leftYFlip = 1000000;
var rightYFlip = 1000000;
window.addEventListener("load", function(event) {
  pad2.style.left = maxWidth - 15 + "px";
  pad1.style.left = "5px";
  pad1.style.top = "0px";
  pad2.style.top = "0px";
  spawn.style.left = halfWidth - spawn.offsetWidth / 2 + "px";
  spawn.style.top = maxHeight / 4 - spawn.offsetHeight / 2 + "px";
  spawner.style.left = halfWidth - spawner.offsetWidth / 2 + "px";
  spawner.style.top = halfHeight - spawner.offsetHeight / 2 + "px";
  thing.style.left = halfWidth - thing.offsetWidth / 2 + "px";
  circleCreator();
})

document.addEventListener("keyup", function(event) {
  let keyName = event.key;
  if (keyName == "w" || keyName == "s") {
    pad1Change = 0;
  } else if (keyName == "k" || keyName == "i") {
    pad2Change = 0;
  }
  console.log(keyName);
})


document.addEventListener("keydown", function(event) {
  let keyName = event.key;
  if (keyName == "w") {
    pad1Change = - 2;
  } else if (keyName == "s") {
    pad1Change = 2;
  } else if (keyName == "i") {
    pad2Change = - 2;
  } else if (keyName == "k") {
    pad2Change = 2;
  } else if (keyName == "d" || keyName == "j") {
    circleCreator();
  } else if (keyName == "o" && rightXFlip>0){
    rightXFlip = rightXFlip-1;
    for (let i=0; i<xChange.length; i++){
      xChange[i] = xChange[i]*-1;
    } 
  } else if (keyName == "q" && leftXFlip>0){
    leftXFlip = leftXFlip-1;
    for (let i=0; i<xChange.length; i++){
      xChange[i] = xChange[i]*-1;
    } 
  } else if (keyName == "a" && leftYFlip>0){
    leftYFlip = leftYFlip-1;
    for (let i=0; i<yChange.length; i++){
      yChange[i] = yChange[i]*-1;
    } 
  } else if (keyName == "l"&&rightYFlip>0){
    rightYFlip = rightYFlip-1;
    for (let i=0; i<yChange.length; i++){
      yChange[i] = yChange[i]*-1;
    } 
  } else if (keyName == " "){
    circleCreator();
  }
})

function move() {
  index = index + 1;
  if (index >= colors.length) {
    index = 0;
  }
  spawner.style.left = halfWidth - spawner.offsetWidth / 2 + "px";
  spawner.style.top = halfHeight - spawner.offsetHeight / 2 + "px";
  spawner.style.backgroundColor = colors[index];
  
  /*pad1.style.backgroundColor = colors[index];
  pad2.style.backgroundColor = colors[index];
  thing.style.color = colors[index];
  scoreText1.style.color = colors[index];
  scoreText2.style.color = colors[index];*/
  let nextPad1 = parseInt(pad1.style.top) + pad1Change;
  if (!(nextPad1<=-10||nextPad1+padHieght>=maxHeight)){
    pad1.style.top = nextPad1 + "px";
    
  }
  let nextPad2 = parseInt(pad2.style.top) + pad2Change;
  if (!(nextPad2<=-10||nextPad2+padHieght>=maxHeight)){
    pad2.style.top = nextPad2 + "px";
  }

  
  for (let i = 0; i < circles.length; i = i + 1) {
    let circle = circles[i];
    let tempStyle = circle.style;
    tempStyle.backgroundColor = colors[index];
    let curXChange = xChange[i];
    let x = parseInt(tempStyle.left);
    let y = parseInt(tempStyle.top);
    if ((x <= leftCheck && collision(circle, pad1) && curXChange < 0) || (x >= rightCheck && collision(circle, pad2) && curXChange > 0)) {
      xChange[i] = (Math.abs(xChange[i]) + Math.random() * .5) * Math.sign(xChange[i]) * -1;
      if (cheatRight){
        xChange[i] = -1*Math.abs(xChange[i]);
      } else if (cheatLeft){
        xChange[i] = Math.abs(xChange[i]);
      }
      playSound();
    } else if (x <= 0) {
      x = halfWidth - halfCircle;
      y = halfHeight - halfCircle;
      setScore(0, 1, circle, i);
    } else if (x >= maxWidth) {
      x = halfWidth - halfCircle;
      y = halfHeight - halfCircle;
      setScore(1, 0, circle, i);
    }
    if (y <= 0 || y >= maxHeight) {
      yChange[i] = (Math.abs(yChange[i]) + Math.random() * .1) * Math.sign(yChange[i]) * -1;
      playSound();
    }
    tempStyle.left = x + xChange[i] + "px";
    tempStyle.top = y + yChange[i] + "px";
  }
}

function setScore(change1, change2, circle, i) {
  score1 = score1 + change1;
  score2 = score2 + change2;
  spawner.style.backgroundColor = circle.style.backgroundColor;
  setMove(circle, i);
  scoreText1.innerHTML = score1;
  scoreText2.innerHTML = score2;
  thing.innerHTML = ":";
  if (score1==winScore||score2==winScore){
    for (let i=0; i<circles.length; i=i+1){
      circles[i].style.visibility = "hidden";
    }
    clearInterval(intevalSpawner);
    clearInterval(internval);
    result.style.visibility = "visible";
    document.getElementById("spawn").style.visibility = "visible";
    scoreText1.style.visibility = "hidden";
    scoreText2.style.visibility = "hidden";
    thing.style.visibility = "hidden";
    spawner.style.visibility="hidden";
    if (score1==winScore){
      result.innerHTML = "Team 1 won "+score1+" to "+score2;
    } else if (score2==winScore){
      result.innerHTML = "Team 2 won "+score2+" to "+score1;
    }
  }
  
}

function collision(elm1, elm2) {
  let rect1 = elm1.getBoundingClientRect();
  let rect2 = elm2.getBoundingClientRect();
  console.log(rect2.left);
  return !(rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom);
}


function setMove(element, index) {
  let xMulti = Math.random() + 1;
  let yMulti = Math.random() + 1;
  if (Math.round(Math.random()) == 0) {
    xMulti = xMulti * -1;
  }
  if (cheatRight){
    xMulti = -1*Math.abs(xMulti);
  } else if (cheatLeft){
    xMulti = Math.abs(xMulti);
  }
  if (Math.round(Math.random()) == 0) {
    yMulti = yMulti * -1;
  }
  xChange[index] = xMulti;
  yChange[index] = yMulti;
  element.style.left = halfWidth - halfCircle + 5 - (Math.random() * 10) + "px";
  element.style.top = halfHeight - halfCircle + 5 - (Math.random() * 10) + "px";
  element.style.backgroundColor = colors[index];
  
}


function circleCreator() {
  let element = document.createElement("div");
  xChange.push(0);
  yChange.push(0);
  setMove(element, circleIndex);
  circles.push(element);
  hasHitPad1.push(false);
  document.body.appendChild(element);
  circleIndex = circleIndex + 1;
}

function playSound(){
    var audio = new Audio("Click.mp3");
    audio.play();
}
