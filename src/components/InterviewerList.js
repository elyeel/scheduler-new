import React from 'react';
import './InterviewerList.scss';
import InterviewerListItem from './InterviewerListItem';
import PropTypes from 'prop-types';

export default function InterviewerList(props) {
	const populateInterviewers = props.interviewers.map((interviewee) => (
		<InterviewerListItem
			key={interviewee.id}
			name={interviewee.name}
			avatar={interviewee.avatar}
			onChange={(e) => props.onChange(interviewee.id)}
			selected={interviewee.id === props.value}
		/>
	));

	return (
		<section className="interviewers">
			<h4 className="interviewers__header text--light">Interviewer</h4>
			<ul className="interviewers__list">{populateInterviewers}</ul>
		</section>
	);
}

// to check prop types
InterviewerList.propTypes = {
	interviewers: PropTypes.array.isRequired
};
