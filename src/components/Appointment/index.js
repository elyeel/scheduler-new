import React from 'react';
import Empty from './Empty';
import Show from './Show';
import Header from './Header';
import Form from './Form';
import Status from './Status';
import './styles.scss';
import useVisualMode from 'hooks/useVisualMode';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVING';

// import { Header, Show, Empty } from '../Appointment';

export default function Appointment({
	id,
	time,
	interview,
	bookInterview,
	interviewers
}) {
	const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);

	function save(name, interviewer) {
		const interview = {
			student: name,
			interviewer
		};
		transition(SAVING);
		bookInterview(id, interview);
		transition(SHOW);
	}

	return (
		<article className="appointment">
			<Header time={time} />
			{mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
			{mode === SHOW && (
				<Show student={interview.student} interviewer={interview.interviewer} />
			)}
			{mode === CREATE && (
				<Form interviewers={interviewers} back={back} save={save} />
			)}
			{mode === SAVING && <Status message="Saving..." />}
		</article>
	);
}
