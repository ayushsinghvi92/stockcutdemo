const Rectangle = require ('./rectangle');

const MaxRectsBinPacking = function (binHeight, binWidth) {
	this.area = binHeight*binWidth;
	this.height = binHeight;
	this.width = binWidth;
	this.usedRectangles = [];
	this.freeRectangles = []; // rectangle that represents the free areas of the bin, not the pieces waiting to be packed. 
	this.freeRectangles.push(new Rectangle(0,0,binHeight, binWidth)); // initializing the first free rectangle
}

MaxRectsBinPacking.prototype.validatePieces = function(pieces) {
	const validPieces = [], invalidPieces = [];
	pieces.map( piece => {

		if(piece.height === this.height && piece.width === this.width) return validPieces.push(piece); //if the size of the piece is the same as the size of the slab, it's valid
		if(piece.width >= this.width && piece.width<=this.height && piece.height<=this.width) return validPieces.push(piece); // the peice can be rotated
		if(piece.height >= this.height && piece.height<=this.width && piece.width <= this.height) return validPieces.push(piece); //the piece can be rotated		
		if(piece.width < this.width && piece.height < this.height) return validPieces.push(piece);
		return invalidPieces.push(piece);
	})
	return { validPieces, invalidPieces }
};

MaxRectsBinPacking.prototype.occupancy = function () {
	let occupiedArea = 0;
	this.usedRectangles.forEach( rectangle => {
		occupiedArea += rectangle.area();
	})
	return occupiedArea * 100/this.area + '% occupancy';
}

MaxRectsBinPacking.prototype.insertPieces = function (validPieces) {
	while( validPieces.length ) {
		let { bestPieceToInsert, bestPieceIndex } = this.findBestPieceToInsert(validPieces);
		this.insert(bestPieceToInsert);
		validPieces.splice(bestPieceIndex, 1);		
	}
}

MaxRectsBinPacking.prototype.findBestPieceToInsert = function (arrOfPieces) {

	let bestPieceToInsert;
	let bestPieceIndex = -1;
	let bestScore1 = 10000;
	let bestScore2 = 10000;

	arrOfPieces.forEach((piece, i) => {
		let currentBestFit = this.bestShortSideFit(piece.height, piece.width);
		let pieceToInsert = currentBestFit.bestNode,
			score1 = currentBestFit.bestShortSideFit,
			score2 = currentBestFit.bestLongSideFit;
		if (score1 < bestScore1 || (score1 === bestScore1 && score2 < bestScore2)) {
			bestScore1 = score1;
			bestScore2 = score2;
			bestPieceToInsert = pieceToInsert;
			bestPieceIndex = i;
		}
	})
	if(bestPieceIndex == -1) 
		throw new Error ('Could not insert this/these piece/pieces' , arrOfPieces )
	return { bestPieceToInsert, bestPieceIndex}

}

MaxRectsBinPacking.prototype.insert = function (piece) {
	let newNode = piece;
	let numberOfFreeNodes = this.freeRectangles.length;


	//The following for loop goes through the free rectangles array and removing rectangles that intersect 
	//with the new node. If they intersect, two new rectangles are created and pushed
	//into the array to replace the one that is removed. The pushing is a side effect of the SplitFreeNode function 

	//I think we can modify this to be a filter function like: 
	//Try later...

	// this.freeRectangles.filter( rectangle => {
	// 	return !this.splitFreeNode(rectangle, newNode);
	// })

	for (let i = 0; i < numberOfFreeNodes; i++) {

		if (this.splitFreeNode(this.freeRectangles[i], newNode))
		{
			this.freeRectangles.splice( i, 1)
			--i;
			--numberOfFreeNodes;
		}
	}

	this.pruneFreeList();
	this.usedRectangles.push(newNode);
	return newNode;

}

MaxRectsBinPacking.prototype.bestShortSideFit = function (height, width) {

	let bestShortSideFit = 10000; // arbritary large value
	let bestLongSideFit = 10000;

	const bestNode = new Rectangle();

	this.freeRectangles.forEach(rectangle => {
		if (rectangle.width >= width && rectangle.height >= height)
		{
			let leftoverHoriz = rectangle.width - width;
			let leftoverVert = rectangle.height - height;
			let shortSideFit = Math.min(leftoverHoriz, leftoverVert);
			let longSideFit = Math.max(leftoverHoriz, leftoverVert);

			if (shortSideFit < bestShortSideFit || (shortSideFit == bestShortSideFit && longSideFit < bestLongSideFit))
			{
				bestNode.x = rectangle.x;
				bestNode.y = rectangle.y;
				bestNode.width = width;
				bestNode.height = height;
				bestShortSideFit = shortSideFit;
				bestLongSideFit = longSideFit;
			}
		}

		//rotate - find a way to disable this when rotatability is false
		if (rectangle.width >= height && rectangle.height >= width)
		{			
			let flippedLeftoverHoriz = rectangle.width - height;
			let flippedLeftoverVert = rectangle.height - width;
			let flippedShortSideFit = Math.min(flippedLeftoverHoriz, flippedLeftoverVert);
			let flippedLongSideFit = Math.max(flippedLeftoverHoriz, flippedLeftoverVert);

			if (flippedShortSideFit < bestShortSideFit || (flippedShortSideFit == bestShortSideFit && flippedLongSideFit < bestLongSideFit))
			{
				bestNode.x = rectangle.x;
				bestNode.y = rectangle.y;
				bestNode.width = height;
				bestNode.height = width;
				bestShortSideFit = flippedShortSideFit;
				bestLongSideFit = flippedLongSideFit;
			}
		}
	})
	return {bestNode, bestShortSideFit, bestLongSideFit};
}

MaxRectsBinPacking.prototype.splitFreeNode = function ( freeNode, usedNode ) {


	// Test with SAT if the rectangles even intersect.
	if (usedNode.x >= freeNode.x + freeNode.width || usedNode.x + usedNode.width <= freeNode.x ||
		usedNode.y >= freeNode.y + freeNode.height || usedNode.y + usedNode.height <= freeNode.y)
		return false;

	// Intersecting on the X plane
	if (usedNode.x < freeNode.x + freeNode.width && usedNode.x + usedNode.width > freeNode.x)
	{
		// New node at the top side of the used node.
		if (usedNode.y > freeNode.y && usedNode.y < freeNode.y + freeNode.height)
		{
			let newNode = Object.assign({},freeNode);
			//Immutability is important because the referenced free node is going to be removed from the array. 
			newNode.height = usedNode.y - newNode.y;
			this.freeRectangles.push(newNode);
		}

		// New node at the bottom side of the used node.
		if (usedNode.y + usedNode.height < freeNode.y + freeNode.height)
		{
			let newNode = Object.assign({},freeNode);
			newNode.y = usedNode.y + usedNode.height;
			newNode.height = freeNode.y + freeNode.height - (usedNode.y + usedNode.height);
			this.freeRectangles.push(newNode);
		}
	}


	// Intersecting on the Y plane
	if (usedNode.y < freeNode.y + freeNode.height && usedNode.y + usedNode.height > freeNode.y)
	{
		// New node at the left side of the used node.
		if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width)
		{
			let newNode = Object.assign({},freeNode); 
			newNode.width = usedNode.x - newNode.x;
			this.freeRectangles.push(newNode);
		}

		// New node at the right side of the used node.
		if (usedNode.x + usedNode.width < freeNode.x + freeNode.width)
		{
			let newNode = Object.assign({},freeNode);
			newNode.x = usedNode.x + usedNode.width;
			newNode.width = freeNode.x + freeNode.width - (usedNode.x + usedNode.width);
			this.freeRectangles.push(newNode);
		}
	}

	return true;
}

MaxRectsBinPacking.prototype.pruneFreeList = function () {
	for( let i = 0; i<this.freeRectangles.length; i++) {
		for ( let j = i+1; j<this.freeRectangles.length; j++) {
			if (Rectangle.isContainedIn(this.freeRectangles[i], this.freeRectangles[j]))
			{
				this.freeRectangles.splice(i,1);
				--i;
				break;
			}
			if (Rectangle.isContainedIn(this.freeRectangles[j], this.freeRectangles[i]))
			{
				this.freeRectangles.splice(j, 1);
				--j;
			}	
		}
	}
}

module.exports = MaxRectsBinPacking;