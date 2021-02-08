//Miinaharava testailua

var squareContents = [];
var outerCover = [];
/*
0 = empty cell, no mines nearby
1-8 = number of mines nearby
m = mine
(f = flag)
*/
//⬜,⬛

var totalSquaresN = 0;
var minesN = 0;
var width = 0;
var height = 0;



function playgroundSetup(w, h, mines) {
	console.log("Muodostetaan miinakenttää...");
	console.log("Leveys: " + w);
	width = w;
	height = h;
	console.log("Korkeus: " + h);
	totalSquaresN = w * h;
	minesN = mines;
	console.log("Kentällä on " + totalSquaresN + " ruutua");
	console.log("Miinojen lukumäärä: " + mines);
	var minePercentage = mines / totalSquaresN * 100;
	console.log(minePercentage.toFixed(2) + "% ruuduista on miinoitettuja");
	console.log("---");

	for (i = 0; i < totalSquaresN; i++) {
		squareContents.push(0);
		outerCover.push("■");
	}
//	console.log(squareContents.length);
//	console.log(squareContents);
}

playgroundSetup(10, 7, 9);
//console.log(totalSquaresN);
//console.log(minesN);

/*
function mineAllocation() {
	var probOfMine = minesN / totalSquaresN;
	var currentMinesN = 0;
	var painopiste = 0;
	for (i = 0; i < totalSquaresN; i++) {
		var tempProb = Math.random();
		if (tempProb < probOfMine / 2) {
			currentMinesN++;
			squareContents.splice(i, 1, "m");
			painopiste += i;
		}
		if (i == 69 && currentMinesN < 15) {
			i = -1;
		}
		if (currentMinesN == minesN) {
			break;
		}
	}
//	console.log("Painopiste: " + painopiste / mines);
}

mineAllocation();
*/

//V 2.0
function mineAllocation() {
	var currCount = 0;
	while (currCount < minesN) {
		var randomSquare = Math.floor(Math.random() * totalSquaresN);
		if (squareContents[randomSquare] != "m") {
			squareContents.splice(randomSquare, 1, "m");
			currCount++;
		}
	}
}
mineAllocation();


function printer(list) {
	var tempList = [];
	for (i = 0; i < totalSquaresN; i++) {
		tempList.push(list[i]);
		if (i != 0 && (i + 1) % width == 0) {
			console.log(tempList.join("  "));
			tempList = [];
		}
	}
	console.log(tempList.join("  "));
	tempList = [];
}

printer(squareContents);


var squareCoordinates = [];
//Vasen yläkulma: 0,0
//oikealle: X nousee
//alas: Y Nousee(!)
function assignCoordinates() {
	squareCoordinates.push([0,0]);
	var y = 0;
	var x = 0;
	for (i = 1; i < totalSquaresN; i++) {
		x = i % width;
		if (i % width == 0) {
			y++;
		}
		squareCoordinates.push([x, y]);
	}
}

assignCoordinates();


function minesWithinRadius() {
	var adjMines = 0;
	for (i = 0; i < totalSquaresN; i++) {
		if (squareContents[i] != "m") {
			for (j = 0; j < totalSquaresN; j++) {
				if (i != j) {
					var xChange = squareCoordinates[j][0] - squareCoordinates[i][0];
					var yChange = squareCoordinates[j][1] - squareCoordinates[i][1];
					var distance = Math.sqrt(Math.pow(xChange, 2) + Math.pow(yChange, 2));
					if (distance < 1.5 && squareContents[j] == "m") {
						adjMines++;
					}
				}
			}
			squareContents.splice(i, 1, adjMines);
		adjMines = 0;
		}	
	}
}

minesWithinRadius();

printer(squareContents);


var adjZeroLocation = []
function fillEmptys(startPoint) {
	adjZeroLocation.push(startPoint);
	function adjZeros() {
		for (i = 0; i < adjZeroLocation.length; i++) {
			for (j = 0; j < totalSquaresN; j++) {
				var check = false
				for (k = 0; k < adjZeroLocation.length; k++) {
					if (adjZeroLocation[k] == j) {
						check = true;
					}
				}
				if (adjZeroLocation[i] != j && check == false) {
					var xChange = squareCoordinates[j][0] - squareCoordinates[adjZeroLocation[i]][0];
					var yChange = squareCoordinates[j][1] - squareCoordinates[adjZeroLocation[i]][1];
					var distance = Math.sqrt(Math.pow(xChange, 2) + Math.pow(yChange, 2));
					if (distance < 1.5 && squareContents[j] == 0) {
						adjZeroLocation.push(j)
						adjZeros();
					}
				}
				
			}
		}
	}
	adjZeros();

	for (i = 0; i < adjZeroLocation.length; i++) {
		outerCover.splice(adjZeroLocation[i], 1, "□");
		for (j = 0; j < squareContents.length; j++) {
			var xChange = squareCoordinates[j][0] - squareCoordinates[adjZeroLocation[i]][0];
			var yChange = squareCoordinates[j][1] - squareCoordinates[adjZeroLocation[i]][1];
			var distance = Math.sqrt(Math.pow(xChange, 2) + Math.pow(yChange, 2));
			if (distance < 1.5 && squareContents[j] != 0) {
				outerCover.splice(j, 1, (squareContents[j]));
			}
		}
	}
}

if (squareContents[0] == 0) {
	fillEmptys(0);
}


printer(outerCover);





/*
var testList = [0, 0, 0, 0, 0];
function orderSmallToLarge(array) {
	var tempList = [];
	var run = true
	while (run) {
		var smallest = array[0];
		var location = 0;
		for (i = 0; i < array.length; i++) {
			if (smallest > array[i]) {
				smallest = array[i];
				location = i;
			}
		}
		adjZeroLocation.splice(location, 1);
		tempList.push(smallest);

		if (tempList.length == array.length) {
			run = false
		}
	}
	testList = tempList;
}

if (adjZeroLocation.length > 0) {
	orderSmallToLarge(adjZeroLocation);
}
console.log(testList);
*/


