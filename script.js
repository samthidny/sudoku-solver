//console.log("Script included");

var data = [
	
	//Easy
	/*[0,0,5,0,9,0,0,8,0],
	[0,4,1,3,0,0,7,0,5],
	[7,0,0,8,0,5,0,0,3],
	[9,7,0,0,8,0,0,0,0],
	[0,0,8,7,0,1,4,6,0],
	[0,0,2,0,0,0,0,7,8],
	[6,0,0,2,0,4,0,3,0],
	[0,1,3,0,0,9,8,5,0],
	[0,5,0,0,3,0,6,0,7]*/
	
	//Medium
	/*[0,0,3,0,0,0,5,0,0],
	[0,4,0,0,0,0,0,8,0],
	[8,0,5,1,9,7,3,0,0],
	[7,0,0,8,0,9,0,0,3],
	[0,1,0,0,4,0,0,5,0],
	[3,0,0,7,0,2,0,0,4],
	[0,0,9,2,7,1,8,0,0],
	[0,3,0,0,0,0,0,7,2],
	[0,0,8,0,0,4,9,0,0]*/
	
	
	//Hard
	[3,0,9,0,0,0,0,0,4],
	[0,0,0,5,0,8,0,0,0],
	[5,0,0,2,0,0,3,0,0],
	[0,2,6,0,7,0,0,5,0],
	[0,0,0,8,0,1,0,0,0],
	[0,3,0,0,2,0,1,7,0],
	[0,0,7,0,0,5,0,0,1],
	[0,0,0,7,0,3,0,0,0],
	[9,0,0,0,0,0,7,0,5]
	
];

function Model(data) {

	var all = [];
	for(var i=0; i<9; i++) {
		all.push(i + 1);
	}
	
	//Create Grid Data Structure
	var model = {};
	this.rows = [];
	for(var y=0; y<data.length; y++) {
		this.rows.push([]);
		for(var x=0; x<data[0].length; x++) {
			var box = new Box(getSquare(data, x, y), all.concat());
			box.name = x + "_" + y;
			this.rows[y].push(box);
		}
	}
	
	//Create Squares
	this.squares = [];
	for(var y=0; y<3; y++) {
		this.squares.push([]);
		for(var x=0; x<3; x++) {
			this.squares[y].push({grid:getRect(this.rows, x * 3, y * 3, 3, 3)});
		}
	}

	//Create Cols
	this.cols = [];
	for(var x=0; x<9; x++) {
		this.cols.push([]);
		for(var y=0; y<this.rows.length; y++) {
			this.cols[x].push(getSquare(this.rows, x, y));
		}
	}
		
	
	//Util
	function getRect(arr, sx, sy, width, height) {
		var rtn = [];
		for(var y=0; y<height; y++) {
			for(var x=0; x<width; x++) {
				rtn.push(getSquare(arr, sx + x, sy + y));		
			}	
		}
		return rtn;
	}
	
	//Bind each cell to its rows and columns and squares
	for(var x=0; x<9; x++) {
		for(var y=0; y<9; y++) {
			var cell = this.getCell(x, y);
			cell.bind(this.cols[x], this.rows[y], this.squares[Math.floor(y/3)][Math.floor(x/3)]);
		}	
	}
	
	
} //Model

Model.prototype.getCell = function(x, y) {
	return getSquare(this.rows, x, y);
}

Model.prototype.toString = function() {
	var str = "";
	for(var y=0; y<9; y++) {
		for(var x=0; x<9; x++) {
			str += this.getCell(x, y);
		}
			str += "\n";
	}
	
	return str;
}

function getSquare(arr, x, y) {
	return arr[y][x];
}

function Box(value, options) {
	
	this.value = value;
	this.options = options.concat();
	this.solved = false;

}

Box.prototype.toString = function() {
	var len = this.options.length;
	var complete = (len == 1 && this.value != 0)
	return "[" + this.value + "]("+ (complete  ? "X" : len) + ") ";
}

Box.prototype.check = function() {
	
	if(this.solved) {
		return true;
	}
	
	var cells = this.column.concat(this.row).concat(this.square.grid);	
	
	//if value has already been set
	if(this.value > 0) {
		this.options = [this.value];
	}

	//Create a list of values that this can't be
	var cell = this;
	var exclude = _.filter(cells, function(value, index, exclude) { 
		if(value == cell || value.value === 0 || (cell.options.length == 1 && cell.options.length > 0)) {
			return false;
		} else { 
			return true;
	} });
	exclude = _.pluck(exclude, "value");
	//Remove options that are in the excluded list
	this.options = _.reject(this.options, function(value) { return exclude.indexOf(value) != -1 })
	
	//If we narrow this cell down to 1 number
	if(!this.solved && this.options.length === 1) {
		this.solved = true;
		this.value = [this.options[0]];
		var inst = this;
		var str = "";
		
		_.each(cells, function(obj) {
			if(obj.options.length > 1) {
				var indexToRemove = obj.options.indexOf(Number(inst.value[0]));
				if(indexToRemove != -1) {
					obj.options.splice(indexToRemove, 1);
				}
				str += obj.options + "   ";

			}
		});

		return true;
		
	}

}


//Chech if other cells in this grid have 
function isUnique(group, cell) {
	
	for(var p=0; p<cell.options.length; p++) {
	
		var searchFor = cell.options[p];
		//Possibilities
		var found = 0;
				
		console.log("");
		console.log("Looking for " + searchFor);
		for(var i=0; i<group.length; i++) {
			if(group[i] !== cell) {
				var indexFound = group[i].options.indexOf(searchFor);
				if(indexFound != -1) {
					console.log("Found " + group[i].name);
					found++;
				}
			}
		}
		if(found == 0) {
			console.log("This is the only square in this group that has this as a possibility, therefore it must be it!!!!");
			console.log(cell.name + " is definitely number " + searchFor);
		}
		else {
			console.log("Found " + found + " cells that could be " + searchFor);
		}
		
	}
	return found;
}

//Bind to groups
Box.prototype.bind = function(column, row, square) {
	this.column = column;
	this.row = row;
	this.square = square;
}


//Implementation 
var model = new Model(data);

function cycle() {
	
	var solveCount = 0;
	
	for (var y = 0; y < 9; y++) {
		for (var x = 0; x < 9; x++) {
			var cell = model.getCell(x, y);
			cell.check();
			if(cell.solved) {
				solveCount++;
			}
		}
	}
	
	console.log("Solved " + solveCount);
	
	//console.log("AFTER")
	console.log(model.toString());
	
	var found = isUnique(model.squares[0][2].grid, model.rows[0][6]);
	console.log(found);
	
}






