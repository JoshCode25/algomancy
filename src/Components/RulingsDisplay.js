import React from 'react';
import '../CSS/rulingsDisplay.css';

const RulingsDisplay = ({ cardName, rulings, useDefaultRuling }) => {
	return (
		<div className="rulingsDisplayWrapper">
			<h3>{cardName} Ruling Clarifications</h3>
			{useDefaultRuling ? (
				<ul className="rulingsDisplayListWrapper">
					<li>
						<a href="https://discord.gg/VWwdWheXbQ">{rulings}</a>
					</li>
				</ul>
			) : (
				<ul className="rulingsDisplayListWrapper">
					{rulings.map((ruling, i) => {
						return <li key={`${cardName}Ruling${i}`}>{ruling}</li>;
					})}
				</ul>
			)}
		</div>
	);
};

export default RulingsDisplay;
