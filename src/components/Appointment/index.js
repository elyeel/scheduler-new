import React from 'react';
import Empty from './Empty';
import Show from './Show';
import Header from './Header';
import './styles.scss';

// import { Header, Show, Empty } from '../Appointment';

export default function Appointment({ id, time, interview }) {
	return (
		<article className="appointment">
			<Header time={time} />
			{!interview && <Empty />}
			{interview && (
				<Show student={interview.student} interviewer={interview.interviewer} />
			)}
		</article>
	);
}
