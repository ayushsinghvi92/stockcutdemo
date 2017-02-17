import React from 'react';
import Bin from './Bin';

const CuttingPattern = (props) => {
	const bins = props.bins.map( bin => bin);
	return (
		<div className='col-xs-12'>
			<h1>{ bins.length } Bins </h1>
			{bins.map((bin,i)=> {
				return <Bin
					bin={bin}
					uid={ 'bin' + i }
				/>
			}
				)}
		</div>
		)
}
						
export default CuttingPattern;