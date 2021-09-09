import React from 'react';
import 'components/InterviewerListItem.scss';
import classNames from 'classnames';

export default function({ avatar, name, selected, onChange }) {
	const interviewerClass = classNames('interviewers__item', {
		'interviewers__item--selected': selected
	});
	const imageItemClass = classNames('interviewers__item-image');

	return (
		<li className={interviewerClass} onClick={onChange}>
			<img className={imageItemClass} src={avatar} alt={name} />
			{selected && name}
		</li>
	);
}
