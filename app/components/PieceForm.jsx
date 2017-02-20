import React from 'react';
import { Form, FormGroup, ControlLabel, Button, FormControl} from 'react-bootstrap';

const PieceForm = (props) => {

	function handleWidthChange (e) {
		e.preventDefault();
		const width = e.target.value;
		props.onWidthChange (width, props.index)
	}

	function handleHeightChange (e) {
		e.preventDefault();
		const height = e.target.value;
		props.onHeightChange (height, props.index)
	}

	function handleQuantityChange (e) {
		e.preventDefault();
		const quantity = e.target.value;
		props.onQuantityChange (quantity, props.index);
	}

	return (
		<div>
			<FormGroup className='col-xs-6' controlId="height">
				<ControlLabel>Piece Height</ControlLabel>
				<FormControl type="number" placeholder="3000" onChange = { handleHeightChange }/>
			</FormGroup>
			<FormGroup className='col-xs-6'controlId="width">
				<ControlLabel>Piece Width</ControlLabel>
				<FormControl type="number" placeholder="1800" onChange = { handleWidthChange }/>
			</FormGroup>

		</div>
	)
}

/*			
<FormGroup className='col-xs-4' controlId='quantity'>
	<ControlLabel>Quantity</ControlLabel>
	<FormControl type='number' onChange = { handleQuantityChange }/>
</FormGroup>
*/
export default PieceForm;