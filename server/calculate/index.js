const api = module.exports = require('express').Router();
const Bin = require('./maxRectsBinPack');

const calculateFit = (binSize, pieces) => {
console.log('this is being called')
	const bins = [];
	let currentBin = new Bin (binSize.height, binSize.width);
	bins.push(currentBin);
	let { validPieces, invalidPieces } = currentBin.validatePieces (pieces);
	while(validPieces.length) {
		try {
			currentBin.insertPieces (validPieces);
		} catch (e) {
			let newBin = new Bin (binSize.height, binSize.width);
			bins.push(newBin);
		}
		currentBin = bins[bins.length-1];
	}

	return { bins, invalidPieces };
}

api.use((req,res) => {
	
	const pieces = req.body.pieces;
	const binSize = req.body.binSize;
	res.send(calculateFit (binSize, pieces));

})
