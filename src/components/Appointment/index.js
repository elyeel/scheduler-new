import React from 'react';
import Empty from './Empty';
import Show from './Show';
import Header from './Header';
import Form from './Form';
import './styles.scss';
import useVisualMode from 'hooks/useVisualMode';

const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';

// import { Header, Show, Empty } from '../Appointment';

export default function Appointment({ id, time, interview }) {
	const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);

	return (
		<article className="appointment">
			<Header time={time} />
			{mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
			{mode === SHOW && (
				<Show student={interview.student} interviewer={interview.interviewer} />
			)}
			{mode === CREATE && <Form interviewers={[]} back={back} />}
		</article>
	);
}
