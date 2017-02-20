import React from 'react';
export default class Bin extends React.Component {

	constructor(props) {
		super(props);
	}

	findCenter (rectangle) {
		const centerX = rectangle.x + rectangle.width/2;
		const centerY = rectangle.y + rectangle.height/2;
		return {centerX, centerY}
	}

	findScaleFactor (bin) {

		// to find the right scaling factor, we need the
		// difference between idealHeight and height and the
		// difference between idealWidth and width. Then, we find 
		// whatever whichever difference is smaller and use that
		// to calculate the scaling factor
		var width = Math.min(document.documentElement.clientWidth, window.innerWidth || 0);
		var height = Math.min(document.documentElement.clientHeight, window.innerHeight || 0);
		const idealWidth = width * 0.45;
		const idealHeight = height * 0.45;

		if ( bin.width != idealWidth || bin.height!= idealHeight) {
			const heightDiff = idealHeight - bin.height;
			const widthDiff = idealWidth - bin.width;
			return widthDiff < heightDiff ? idealWidth/bin.width : idealHeight/bin.height;
		}
		return 1;
	}

	componentDidUpdate () {
		const bin = this.props.bin;
		const elem = document.getElementById(this.props.uid);
		const params = { width: 1000, height: 1000 };
		const two = new Two(params).appendTo(elem);
		const group = two.makeGroup();

		bin.usedRectangles.map ( usedRect => {
			const { centerX, centerY} = this.findCenter(usedRect);
			const rect = two.makeRectangle(centerX, centerY, usedRect.width, usedRect.height);
			rect.fill = 'rgb(0, 200, 255)';
			rect.opacity = 0.75;
			rect.stroke = 'black';
			const heightLabel = two.makeText(usedRect.height, centerX, usedRect.y);
			const widthLabel = two.makeText(usedRect.width, usedRect.x, centerY);

			heightLabel.size = '8px';
			widthLabel.size = '8px';
			group.add(rect, heightLabel, widthLabel);
		})
		bin.freeRectangles.map ( freeRect => {
			const { centerX, centerY} = this.findCenter(freeRect);
			const rect = two.makeRectangle(centerX, centerY, freeRect.width, freeRect.height);
			rect.fill = 'gray';
			rect.noStroke();
			group.add(rect);
		})
		group.scale = this.findScaleFactor(bin) * 0.9;
		two.update();
	}

	componentDidMount () {	
		const bin = this.props.bin;
		const elem = document.getElementById(this.props.uid);
		const params = { width: 1000, height: 1000 };
		const two = new Two(params).appendTo(elem);
		const group = two.makeGroup();

		bin.usedRectangles.map ( usedRect => {
			const { centerX, centerY} = this.findCenter(usedRect);
			const rect = two.makeRectangle(centerX, centerY, usedRect.width, usedRect.height);
			rect.fill = 'rgb(0, 200, 255)';
			rect.opacity = 0.75;
			rect.stroke = 'black';
			const heightLabel = two.makeText(usedRect.height, centerX, usedRect.y);
			const widthLabel = two.makeText(usedRect.width, usedRect.x, centerY);

			heightLabel.size = '8px';
			widthLabel.size = '8px';
			group.add(rect, heightLabel, widthLabel);
		})
		bin.freeRectangles.map ( freeRect => {
			const { centerX, centerY} = this.findCenter(freeRect);
			const rect = two.makeRectangle(centerX, centerY, freeRect.width, freeRect.height);
			rect.fill = 'rgb(255, 0, 0)';
			rect.noStroke();
			group.add(rect);
		})
		group.scale = this.findScaleFactor(bin) * 0.9;
		two.update();
	}	
	render () { 
		return (
		<div>
			<div className='col-xs-6'>
				<svg id = { this.props.uid } className='big'></svg>
			</div>
			<p> Occupancy: {this.props.bin.occupiedArea} </p>
			<ul className='col-xs-5'> 
				{ this.props.bin.usedRectangles.map ((usedRect,i) => <li>Piece {i + 1} : {usedRect.height} x {usedRect.width}</li>)}
			</ul>
		</div>
		)		
	}
}

