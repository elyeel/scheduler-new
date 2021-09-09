import React from 'react';
import './InterviewerList.scss';
import InterviewerListItem from './InterviewerListItem';

export default function InterviewerList({
	interviewers,
	interviewer,
	setInterviewer
}) {
	const populateInterviewers = interviewers.map((interviewee) => {
		return (
			<InterviewerListItem
				key={interviewee.id}
				name={interviewee.name}
				avatar={interviewee.avatar}
				setInterviewer={(e) => setInterviewer(interviewee.id)}
				selected={interviewee.id === interviewer}
			/>
		);
	});

	//   const interviewers = props.interviewers.map(interviewer => {
	//   return (
	//     <InterviewerListItem
	//       key={interviewer.id}
	//       name={interviewer.name}
	//       avatar={interviewer.avatar}
	//       selected={interviewer.id === props.interviewer}
	//       setInterviewer={event => props.setInterviewer(interviewer.id)}
	//     />
	//   );
	// });
	return (
		<section className="interviewers">
			<h4 className="interviewers__header text--light">Interviewer</h4>
			<ul className="interviewers__list">{populateInterviewers}</ul>
		</section>
	);
}
