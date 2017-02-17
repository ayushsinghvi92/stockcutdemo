import React from 'react';
import { Form, FormGroup, ControlLabel, Button, FormControl} from 'react-bootstrap';
import PieceForm from './PieceForm';
import CuttingPattern from './CuttingPattern';
import axios from 'axios';
export default class DataInput extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			height: 0,
			width: 0,
			pieces: [],
			bins: [],
			invalidPieces: []
		}
		this.onCalculate = this.onCalculate.bind(this);
		this.onHeightChange = this.onHeightChange.bind(this);
		this.onWidthChange = this.onWidthChange.bind(this);
		this.addPiece = this.addPiece.bind(this);
		this.changePieceHeight = this.changePieceHeight.bind(this);
		this.changePieceQuantity = this.changePieceQuantity.bind(this);
		this.changePieceWidth = this.changePieceWidth.bind(this);
	}

	onCalculate (e) {
		e.preventDefault();
		const pieces = this.state.pieces.map( piece => piece );
		const binSize = { height: this.state.height, width: this.state.width };
		axios.post('/api/calculate/', { binSize, pieces })
		.then(result => result.data)
		.then(data => {
			this.setState({ bins : data.bins })
			this.setState({ invalidPieces: data.invalidPieces})
		})

	}

	onHeightChange (e) {
		e.preventDefault();
		const height = Number(e.target.value);
		this.setState ({ height })
	}

	onWidthChange (e) {
		e.preventDefault();
		const width = Number(e.target.value);
		this.setState ({ width })
	}

	addPiece (e) {
		e.preventDefault();
		const piece = { height: 0, width: 0, quantity: 0}
		const pieces = this.state.pieces.map( piece => piece);
		pieces.push(piece); 
		this.setState({ pieces })
	} 

	changePieceHeight (height, index) {
		const pieces = this.state.pieces.map( piece => piece);
		pieces[index].height = Number(height);
		this.setState ({ pieces });
	}

	changePieceQuantity (quantity, index) {
		const pieces = this.state.pieces.map( piece => piece);
		pieces[index].quantity = Number(quantity);
		this.setState ({ pieces });
	}

	changePieceWidth (width, index) {
		const pieces = this.state.pieces.map( piece => piece);
		pieces[index].width = Number(width);
		this.setState ({ pieces });
	}
	render () {
		return  (
		<div className='col-xs-12'>
		<Form inline onSubmit = { this.onCalculate }>
			<FormGroup className='col-xs-6' controlId="height">
				<ControlLabel>Slab Height</ControlLabel>
				<FormControl onChange = {this.onHeightChange} type="number" placeholder="3000" />
			</FormGroup>
			<FormGroup className='col-xs-6'controlId="width">
				<ControlLabel>Slab Width</ControlLabel>
				<FormControl onChange = { this.onWidthChange } type="number" placeholder="1800" />
			</FormGroup>
			{ this.state.pieces.map((piece, i) => <PieceForm 
				key= { i } 
				index = { i }
				onWidthChange = { this.changePieceWidth } 
				onQuantityChange = { this.changePieceQuantity }
				onHeightChange = { this.changePieceHeight }
			 />)}
			<Button onClick = { this.addPiece }>Add Piece </Button>
			<Button type="submit">
				Calculate
			</Button>
		</Form>
		<CuttingPattern bins={ this.state.bins } />
  		</div>
	)}
}