import React from 'react';
import Empty from './Empty';
import Show from './Show';
import Header from './Header';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';
import './styles.scss';
import useVisualMode from 'hooks/useVisualMode';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const DELETING = 'DELETING';
const CONFIRM = 'CONFIRM';
const EDIT = 'EDIT';
const ERROR_SAVE = 'ERROR_SAVE';
const ERROR_DELETE = 'ERROR_DELETE';
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
		Promise.resolve(bookInterview(id, interview))
			.then(() => transition(SHOW))
			.catch((err) => transition(ERROR_SAVE, true));
	}

	function destroyAppointment() {
		transition(DELETING);
		Promise.resolve(cancelInterview(id))
			.then(() => transition(EMPTY))
			.catch((err) => transition(ERROR_DELETE, true));
	}

	const onClose = () => {
		back();
	};

	return (
		<article className="appointment" data-testid="appointment">
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
			{mode === EDIT && (
				<Form
					interviewers={interviewers}
					save={save}
					back={back}
					name={interview.student}
					interviewer={interview.interviewer.id}
				/>
			)}
			{mode === ERROR_SAVE && (
				<Error message="Could not save the appointment" onClose={onClose} />
			)}
			{mode === ERROR_DELETE && (
				<Error message="Could not cancel the appointment" onClose={onClose} />
			)}
		</article>
	);
}
