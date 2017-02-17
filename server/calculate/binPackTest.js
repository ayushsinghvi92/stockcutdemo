console.log('starting bin pack test using MaxRectsBinPack');

const Bin = require ('./maxRectsBinPack');


const pieces = [
	{
		height: 60,
		width: 40
	},
	{
		height: 100,
		width: 20,
	},
	{
		height: 100,
		width: 35
	},
	{
		height: 40,
		width: 40
	},
	{
		height: 190, //invalid piece
		width: 70
	},
	{
		height: 40, // wont fit in first bin
		width: 40
	},
	{
		height: 10,
		width: 10
	},
	{
		height: 60,
		width: 40
	},
	{
		height: 100,
		width: 20,
	},
	{
		height: 100,
		width: 35
	},
	{
		height: 40,
		width: 40
	},
	{
		height: 190, //invalid piece
		width: 70
	},
	{
		height: 40, // wont fit in first bin
		width: 40
	},
	{
		height: 10,
		width: 10
	}
]

const binSize = { width: 100, height: 100 };
const bins = [];

console.log(' bin size is:.................\n ', binSize);
let testBin = new Bin (binSize.height, binSize.width);
bins.push(testBin);
let validPieces = testBin.validatePieces (pieces);
console.log(' valid pieces are:..................\n ', validPieces );

while(validPieces.length) {
	try {
		testBin.insertPieces (validPieces);
	} catch (e) {
		let newBin = new Bin (binSize.height, binSize.width);
		bins.push(newBin);
		newBin.insertPieces(validPieces)
	}
}

bins.forEach( (bin,i) => {
	console.log('Bin Number ', i, ' With Occupancy ', bin.occupancy());
})

module.exports = bins;