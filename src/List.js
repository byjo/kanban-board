import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from './Card.js'

export class List extends Component {
	render() {
		let cards = this.props.cards.map((card) => {
							return <Card key={card.id} 
										taskCallbacks={this.props.taskCallbacks} 
										id={card.id}
										title={card.title} 
										description={card.description} 
										color={card.color}
										tasks={card.tasks}
									 />
						});
		return (
			<div className='list'>
				<h1>{this.props.title}</h1>
				{cards}
			</div>
		);
	}
}

List.propTypes= {
	title:PropTypes.string.isRequired,
	cards:PropTypes.arrayOf(PropTypes.object),
	taskCallbacks : PropTypes.object
};

export default List;