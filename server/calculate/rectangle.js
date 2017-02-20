const Rectangle = function (x, y, height, width) {
	this.x = x || 0;
	this.y = y || 0;
	this.height = height || 0;
	this.width = width || 0;
}

Rectangle.isContainedIn = function ( largerRect, smallerRect) {
	return largerRect.x >= smallerRect.x && largerRect.y >= smallerRect.y && 
	largerRect.x + largerRect.width <= smallerRect.x + smallerRect.width && 
	largerRect.y + largerRect.height <= smallerRect.y + smallerRect.height;
}

Rectangle.prototype.area = function() {
	return this.height * this.width;
};

module.exports = Rectangle;