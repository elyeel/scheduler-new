import React from 'react';
import 'components/InterviewerListItem.scss';
import classNames from 'classnames';

export default function(props) {
	const interviewerClass = classNames('interviewers__item', {
		'interviewers__item--selected': props.selected
	});
	const imageItemClass = classNames('interviewers__item-image');

	return (
		<li className={interviewerClass} onClick={() => props.setInterviewer()}>
			<img className={imageItemClass} src={props.avatar} alt={props.name} />
			{props.selected && props.name}
		</li>
	);
}
