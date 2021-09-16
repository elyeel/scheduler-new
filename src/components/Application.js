import React from 'react';
import Daylist from './Daylist';
import Appointment from './Appointment';
import 'components/Application.scss';
import {
	getAppointmentsForDay,
	getInterview,
	getInterviewersForDay
} from 'helpers/selectors';
import useApplicationData from 'hooks/useApplicationData';

export default function Application(props) {
	const {
		state,
		setDay,
		bookInterview,
		cancelInterview
	} = useApplicationData();

	const appointments = getAppointmentsForDay(state, state.day);
	const interviewers = getInterviewersForDay(state, state.day);
	const schedule = appointments.map((appointment) => {
		const interview = getInterview(state, appointment.interview);

		return (
			<Appointment
				key={appointment.id}
				{...appointment}
				interview={interview}
				bookInterview={bookInterview}
				interviewers={interviewers}
				cancelInterview={cancelInterview}
			/>
		);
	});

	return (
		<main className="layout">
			<section className="sidebar">
				<img
					className="sidebar--centered"
					src="images/logo.png"
					alt="Interview Scheduler"
				/>
				<hr className="sidebar__separator sidebar--centered" />
				<nav className="sidebar__menu">
					<Daylist days={state.days} day={state.day} setDay={setDay} />
				</nav>
				<img
					className="sidebar__lhl sidebar--centered"
					src="images/lhl.png"
					alt="Lighthouse Labs"
				/>
			</section>
			<section className="schedule">
				{schedule}
				<Appointment key="last" time="5pm" />
			</section>
		</main>
	);
}
