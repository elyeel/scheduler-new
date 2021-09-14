import React from 'react';
import Empty from './Empty';
import Show from './Show';
import Header from './Header';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import './styles.scss';
import useVisualMode from 'hooks/useVisualMode';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const DELETING = 'DELETING';
const CONFIRM = 'CONFIRM';

// import { Header, Show, Empty } from '../Appointment';

export default function Appointment({
	id,
	time,
	interview,
	bookInterview,
	interviewers,
	cancelInterview
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

	function destroyAppointment(id, name, interviewer) {
		const interview = {
			student: name,
			interviewer
		};
		transition(DELETING);
		setTimeout(() => {
			cancelInterview(id, interview);
			transition(EMPTY);
		}, 1000);
	}

	return (
		<article className="appointment">
			<Header time={time} />
			{mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
			{mode === SHOW && (
				<Show
					student={interview.student}
					interviewer={interview.interviewer}
					transition={transition}
				/>
			)}
			{mode === CREATE && (
				<Form interviewers={interviewers} back={back} save={save} />
			)}
			{mode === SAVING && <Status message="Saving..." />}
			{mode === DELETING && <Status message="Deleting..." />}
			{mode === CONFIRM && (
				<Confirm
					destroyAppointment={destroyAppointment}
					transition={transition}
				/>
			)}
		</article>
	);
}
