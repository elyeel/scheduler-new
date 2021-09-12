import React, { useState, useEffect } from 'react';
import Daylist from './Daylist';
import Appointment from './Appointment';
import 'components/Application.scss';
import axios from 'axios';
import { getAppointmentsForDay } from 'helpers/selectors';

// const appointments = [
// 	{
// 		id: 1,
// 		time: '12pm'
// 	},
// 	{
// 		id: 2,
// 		time: '1pm',
// 		interview: {
// 			student: 'Lydia Miller-Jones',
// 			interviewer: {
// 				id: 1,
// 				name: 'Sylvia Palmer',
// 				avatar: 'https://i.imgur.com/LpaY82x.png'
// 			}
// 		}
// 	},
// 	{
// 		id: 3,
// 		time: '2pm'
// 	},
// 	{
// 		id: 4,
// 		time: '3pm',
// 		interview: {
// 			student: 'Mike Cantina',
// 			interviewer: {
// 				id: 4,
// 				name: 'Cohana Roy',
// 				avatar: 'https://i.imgur.com/FK8V841'
// 			}
// 		}
// 	},
// 	{
// 		id: 5,
// 		time: '4pm'
// 	}
// ];

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
// let schedule;

export default function Application(props) {
	const [ state, setState ] = useState({
		day: 'Monday',
		days: [],
		appointments: []
	});
	const setDay = (day) => setState({ ...state, day });
	// let dailyAppointments = [];

	useEffect(() => {
		Promise.all([ axios(first), axios(second), axios(third) ]).then((all) => {
			setState((prev) => ({
				...prev,
				days: all[0].data,
				appointments: all[1].data
			}));
		});

		// return () => {
		// 	schedule = getAppointmentsForDay(state, state.day).map((appointment) => (
		// 		<Appointment key={appointment.id} {...appointment} />
		// 	));
		// };
	}, []);

	const schedule = getAppointmentsForDay(
		state,
		state.day
	).map((appointment) => <Appointment key={appointment.id} {...appointment} />);

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
