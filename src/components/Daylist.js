import React from 'react';
import DayListItem from './DayListItem';

export default function Daylist(props) {
	const populateDays = () => {
		return props.days.map((day) => (
			<DayListItem
				name={day.name}
				key={day.id}
				spots={day.spots}
				selected={day.name === props.day}
				setDay={props.setDay}
			/>
		));
	};

	return <ul>{populateDays()}</ul>;
}
