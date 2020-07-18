//Initial color
let color = "#FFFFFF";

//Boolean to check drag mode
let isClicked = false;

//Function that clear all the tr and td element
function cleanGrid(){
  $("#pixel_canvas tr").remove();
  doubleClickCount = 0;
}

function makeGrid() {
  let height = $("#input_height").val();
  let width = $("#input_width").val();
  let table = $("#pixel_canvas");
  
  //Inifity way to do this
  for(let i = 0; i < height; i++){
    table.append("<tr></tr>");
  }

  var trs = $("#pixel_canvas tr");

  for(let a = 0; a < width; a++){
    trs.append("<td></td>");
  }
}

//Function that activates the single pixel
function makePixel(el){
  let element = $(el.target);
  element.css("background", color);
}

//Save settings button event
$("#submit").on("click", function(){
  cleanGrid(); 
  makeGrid();
  $("#settings").toggleClass("open");
});


var doubleClickCount = 0;
var startPx, endPx;


//Classic click event, down + release, so no drag event
$("#pixel_canvas").on("click", "td", function(e){
  makePixel(e);
  isClicked = false;
})
.on("dblclick", "td", function(e){
  if(doubleClickCount == 0){
    $(e.target).css('background-color', 'green');
    startPx = $(e.target);
  } else if(doubleClickCount == 1) {
    $(e.target).css('background-color', 'red');
    endPx = $(e.target);
  }
  doubleClickCount++;


})
.on("mousedown", function(e){ //Mouse button clicked but not released
  makePixel(e);
  
  //e.preventDefault();
  isClicked = true;
})
.on("mouseover", "td", function(e){ 
  //Check if the mouse button is clicked when i pass over a grid element
  if(isClicked){
    makePixel(e);
  }
});

//Check the mouse button release on all the document
$(document).on('mouseup', function(){
  isClicked = false;
});

$("#colorPicker").change(function(){
  color = $(this).val();
});

$("#close").on("click", function(){
  $("#settings").toggleClass("open");
});

$("#open").on("click", function(){
  $("#settings").toggleClass("open");
});

$("#refresh").on("click", function(){
  cleanGrid(); 
  makeGrid();
});

//First call to create the grid on document ready, equivalent to $document.ready...
makeGrid();


function solveMaze() {

  
  tileColumnCount = $("#input_height").val();
  tileRowCount = $("#input_width").val();
  
  var tiles = [];
  var xLoc;
  var yLoc;

  var endLocX, endLocY;

  for (c = 0; c < tileColumnCount; c++) {
    tiles[c] = [];
    for (r = 0; r < tileRowCount; r++) {
      pxState = getState(c*tileColumnCount+r);
      if(pxState == "s"){
        xLoc = c;
        yLoc = r;
      }
      if(pxState == "f"){
        endLocX = c;
        endLocY = r;
      }
      tiles[c][r] = {x: c, y: r, state: pxState}; //state is e for empty
    }
  }

  // console.log(tiles);

  var queue = [[xLoc, yLoc]];
  var pathFound = false;
  while (queue.length > 0 && !pathFound) {
    xLoc = queue[0][0];
    yLoc = queue[0][1];
    var index = 0;
    for (var i = 1; i < queue.length; i++) {
      if (distanceToFinish(queue[i][0], queue[i][1]) < distanceToFinish(xLoc, yLoc)) {
        xLoc = queue[i][0];
        yLoc = queue[i][1];
        index = i;
      }
    }
    queue.splice(index, 1);
    if (xLoc < tileColumnCount - 1) {
      if (tiles[xLoc+1][yLoc].state == 'f') {
        pathFound = true;
      }
    }
    if (yLoc < tileRowCount - 1) {
      if (tiles[xLoc][yLoc+1].state == 'f') {
        pathFound = true;
      }
    }
    if (xLoc > 0) {
      if (tiles[xLoc-1][yLoc].state == 'e') {
        queue.push([xLoc-1, yLoc]);
        tiles[xLoc-1][yLoc].state = tiles[xLoc][yLoc].state + 'l';
      }
    }
    if (xLoc < tileColumnCount - 1) {
      if (tiles[xLoc+1][yLoc].state == 'e') {
        queue.push([xLoc+1, yLoc]);
        tiles[xLoc+1][yLoc].state = tiles[xLoc][yLoc].state + 'r';
      }
    }
    if (yLoc > 0) {
      if (tiles[xLoc][yLoc-1].state == 'e') {
        queue.push([xLoc, yLoc-1]);
        tiles[xLoc][yLoc-1].state = tiles[xLoc][yLoc].state + 'u';
      }
    }
    if (yLoc < tileRowCount - 1) {
      if (tiles[xLoc][yLoc+1].state == 'e') {
        queue.push([xLoc, yLoc+1]);
        tiles[xLoc][yLoc+1].state = tiles[xLoc][yLoc].state + 'd';
      }
    }
  }
  
  
  console.log(tiles);
  
  if (!pathFound) {
    // output.innerHTML = 'No Solution';
    alert("NO SOLUTION");
  }
  else {
    // output.innerHTML = 'Solved!';
    alert("SOLVED");
    var path = tiles[xLoc][yLoc].state;
    var pathLength = path.length;
    var currX = 0;
    var currY = 0;
    for (var i = 0; i < pathLength-1; i++) {
      if (path.charAt(i+1) == 'u') {
        currY -= 1;
      }
      if (path.charAt(i+1) == 'd') {
        currY += 1;
      }
      if (path.charAt(i+1) == 'r') {
        currX += 1;
      }
      if (path.charAt(i+1) == 'l') {
        currX -= 1;
      }
      tiles[currX][currY].state = 'x';
    }
  }

  function getState(index){
    el = $("td")[index];
    style = window.getComputedStyle(el);
    thisColor = style.getPropertyValue("background-color");

    if (thisColor == "rgb(0, 128, 0)") {
      state = "s";
    }
    else if (thisColor == 'rgb(255, 0, 0)') {
      state = "f";
    }
    else if (thisColor == "rgb(0, 0, 0)") {
      state = "w";
    }
    else {
      state = "e";
    }
    // console.log(index + ": " + state);
    return state;

  }


  function distanceToFinish (xVal, yVal) {
    return (xVal-endLocX)*(xVal-endLocX) + (yVal-endLocY)*(yVal-endLocY);
  }
}

