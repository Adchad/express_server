var connect_open = false;

var player_number = 0;

var friend;
// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8081');

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
    connect_open=true;
});

// Listen for messages
socket.addEventListener('message', function (event) {
  var str_data = event.data;
  if(str_data.slice(0,14)==="player-number:"){
    console.log("player number " + str_data.slice(14,15) );
    player_number = str_data.slice(14,15);
  }

  if(str_data.slice(0,8)==="play_num"){
    //console.log(str_data);
      var x_string = parseInt(str_data.slice(15,18));
      var y_string = parseInt(str_data.slice(19,22));

      console.log( x_string + " " +y_string);
      friend.setCoordAndDraw(x_string,y_string);
  }

});


function send_socket(message) {
    if(connect_open){
      socket.send(message);
    }


    
  
}





var great_div_DOM = document.querySelector('.greatdiv');

var xpadded,ypadded;

var sizex = 30;
var sizey = 21;

var offsetx = 200;
var offsety = 200;

var speed = 400;
var dir = 'd';



var player;
var map;
var enemy_list;

var proj_array = [];

class Point{

  constructor(x,y){
    this.x = x;
    this.y = y;
    this.state=false;
    this.color='black';
    this.class="normal-cell";
  }

  getCoordinates(){
    return [this.x,this.y];
  }

  setCoordinates(x,y){
    this.x = x;
    this.y = y;
  }

  getState(){
    return this.state;
  }
  draw(){

    if(this.state==true){
      xpadded = ("00" + this.x).slice (-3);
      ypadded = ("00" + this.y).slice (-3);
    
      document.querySelector("#indiv-"+ xpadded +"-"+ ypadded).style.backgroundColor = this.color;
      
    }
    else{
      xpadded = ("00" + this.x).slice (-3);
      ypadded = ("00" + this.y).slice (-3);
    
      document.querySelector("#indiv-"+ xpadded +"-"+ ypadded).style.backgroundColor = "white";
    }
  }

  setColor(color){
    this.color=color;
  }

  setClass(class_){
    
    xpadded = ("00" + this.x).slice (-3);
    ypadded = ("00" + this.y).slice (-3);
    document.querySelector("#indiv-"+ xpadded +"-"+ ypadded).classList.remove(this.class);
    this.class=class_;
    document.querySelector("#indiv-"+ xpadded +"-"+ ypadded).classList.add(this.class);

  }

  add(){
    this.state=true;
  }
  remove(){
    this.state=false;
  }




}



const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}


function init(){

  for (let x = 0; x < sizex; x++) {
      for (let y = 0; y < sizey; y++) {
          xpadded = ("00" + x).slice (-3);
          ypadded = ("00" + y).slice (-3);
          great_div_DOM.innerHTML += "<div class=\"insidediv\" id=\"indiv-"+ xpadded +"-"+ ypadded + "\"></div>\n";
          document.querySelector("#indiv-"+ xpadded +"-"+ ypadded).style.left = x*28 + offsetx + "px";
          document.querySelector("#indiv-"+ xpadded +"-"+ ypadded).style.top = y*28 + offsety + "px";

      }

    }
}




async function logKey(e) {
  
    switch (e.code) {

      case 'ArrowLeft':
        dir = 'l';
        if(!player.detectCollisions(dir)){
          player.moveAndDraw(dir);
          map.draw();
        }
        
        break;

      case 'ArrowRight':
        dir = 'r';
        if(!player.detectCollisions(dir)){
          player.moveAndDraw(dir);
          map.draw();
        }
        break;
      case 'ArrowDown':
        dir = 'd';
        if(!player.detectCollisions(dir)){
          player.moveAndDraw(dir);
          map.draw();
        }
        break;
      case 'ArrowUp':
        dir = 'u';
        if(!player.detectCollisions(dir)){
          player.moveAndDraw(dir);
          map.draw();
        }
        break;
      
      case 'Space':
        player.shoot();
        break;
    }

    await sleep(speed);
  
}



class Map {

  constructor(width,height){

    this.width=width;
    this.height=height;
    this.map=[];

    for(var i=0; i<this.height; ++i){
      this.map.push(new Array());
      for(var j=0; j<this.width; ++j){
        this.map[i].push(new Point(j,i));

        if(i==0 || i==this.height-1 ||j==0||j==this.width-1){
          this.map[i][j].add();
        }

      }
    }



  }

  draw(){
    for(var i=0; i<this.height; ++i){
      this.map.push(new Array());
      for(var j=0; j<this.width; ++j){
        this.map[i][j].draw();
      }
    }
  }

  getMap(){
    return this.map;
  }

}
  
class Player{
  constructor(x, y ,map){
    this.x=x;
    this.y=y;
    //this.point=new Point(x, sizey-1);
    this.map=map;
  }


  move(direction){
    switch (direction) {
      case 'l':
        this.x--;
        this.map[this.y][this.x].setCoordinates(this.x,this.y);
        break;
    
      case 'r':
        this.x++;
        this.map[this.y][this.x].setCoordinates(this.x,this.y);
        break;


      case 'd':
        this.y++;
        this.map[this.y][this.x].setCoordinates(this.x,this.y);
        break;

      case 'u':
        this.y--;
        this.map[this.y][this.x].setCoordinates(this.x,this.y);
        break;
    }
  }


  setCoordinates(x,y){
    this.x=x;
    this.y=y;
    this.map[this.y][this.x].setCoordinates(this.x,this.y);
  }
  draw(){
    this.map[this.y][this.x].add();
  }

  erase(){
    this.map[this.y][this.x].remove();
  }

  moveAndDraw(direction){
    this.erase();
    this.move(direction);
    this.draw();
  }

  setCoordAndDraw(x,y){
    this.erase();
    this.setCoordinates(x,y);
    this.draw();
  }

  getCoordinates(){
    return [this.x, this.y];
  }

  detectCollisions(direction){
    var next_cell;
    switch (direction) {
      case 'l':
        next_cell = this.map[this.y][this.x-1];
        break;
    
      case 'r':
        next_cell = this.map[this.y][this.x+1];
        break;

      case 'd':
        next_cell = this.map[this.y+1][this.x];
        break;

      case 'u':
        next_cell = this.map[this.y-1][this.x];
        break;
    }
    

    if(next_cell.getState()==true){
      return true;
    }

    return false;
  }



}




async function send_data() {
  while(true){
    await sleep(100);
    var position = player.getCoordinates();
    xpadded = ("00" + position[0]).slice (-3);
    ypadded = ("00" + position[1]).slice (-3);
    send_socket('play_num='+player_number + '_pos=' + xpadded +";"+ ypadded);
  }
}


map=new Map(sizex,sizey);



//MAIN

document.addEventListener('keydown', logKey);

//document.addEventListener('keyup', function(){ speed=400; dir='d';});




init();

player = new Player(4,sizey-2, map.getMap());

friend = new Player(6,sizey-2,map.getMap());

player.draw();
send_data();
//GAME LOOP
async function loop(timestamp) {

  //await sleep(speed);

  //console.log(player.getX());
  
  map.draw();
  
  window.requestAnimationFrame(loop)
} 
window.requestAnimationFrame(loop)
