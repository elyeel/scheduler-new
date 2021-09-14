import React, { useState, useEffect } from 'react';
import Daylist from './Daylist';
import Appointment from './Appointment';
import 'components/Application.scss';
import axios from 'axios';
import {
	getAppointmentsForDay,
	getInterview,
	getInterviewersForDay
} from 'helpers/selectors';

const first = {
	method: 'get',
	url: 'http://localhost:8001/api/days',
	headers: {}
};
const second = {
	method: 'get',
	url: 'http://localhost:8001/api/appointments',
	headers: {}
};
const third = {
	method: 'get',
	url: 'http://localhost:8001/api/interviewers',
	headers: {}
};

export default function Application(props) {
	const [ state, setState ] = useState({
		day: 'Monday',
		days: [],
		appointments: [],
		interviewers: {}
	});
	const setDay = (day) => setState({ ...state, day });

	useEffect(() => {
		Promise.all([ axios(first), axios(second), axios(third) ]).then((all) => {
			setState((prev) => ({
				...prev,
				days: all[0].data,
				appointments: all[1].data,
				interviewers: all[2].data
			}));
		});

		// return () => {
		// 	schedule = getAppointmentsForDay(state, state.day).map((appointment) => (
		// 		<Appointment key={appointment.id} {...appointment} />
		// 	));
		// };
	}, []);

	function bookInterview(id, interview) {
		const appointment = {
			...state.appointments[id],
			interview: { ...interview }
		};
		const appointments = {
			...state.appointments,
			[id]: appointment
		};
		setState({ ...state, appointments });
		console.log(id, interview);
		axios.put(`api/appointments/${id}`, { id, interview });
	}

	function cancelInterview(id, interview) {
		console.log(id, interview);
	}

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
