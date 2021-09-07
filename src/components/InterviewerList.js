import React from 'react';
import './InterviewerList.scss';
import InterviewerListItem from './InterviewerListItem';

export default function InterviewerList({
	interviewers,
	interviewer,
	setInterviewer
}) {
	const populateInterviewers = () => {
		return interviewers.map((interviewee) => (
			<InterviewerListItem
				key={interviewee.id}
				name={interviewee.name}
				avatar={interviewee.avatar}
				setInterviewer={setInterviewer}
				selected={interviewee.id === interviewer}
			/>
		));
	};

	return (
		<section className="interviewers">
			<h4 className="interviewers__header text--light">Interviewer</h4>
			<ul className="interviewers__list">{populateInterviewers()}</ul>
		</section>
	);
}
