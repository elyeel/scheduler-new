import { useState, useEffect } from 'react';
import axios from 'axios';

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

export default function useApplicationData() {
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
	}, []);

	const updateSpots = (id, appointments) => {
		let dayId = 0;
		if (id > 5) dayId++;
		if (id > 10) dayId++;
		if (id > 15) dayId++;
		if (id > 20) dayId++;

		const spotsInDay = Object.values(appointments).reduce((a, c, i) => {
			if (c.interview === null && i >= dayId * 5 && i < dayId * 5 + 5) a++;
			return a;
		}, 0);

		const tempDay = state.days[dayId];
		tempDay.spots = spotsInDay;
		const tempDays = state.days;
		tempDays[dayId] = tempDay;
		// console.log(spotsInDay, tempDay);
		// console.log({ [dayId]: tempDay }, state.days);
		// setState(...state, { days: tempDays }); // best candidate
		// setState((prev) => ({ ...prev, days: { [dayId]: tempDay }}));
		return tempDays;
	};

	function bookInterview(id, interview) {
		const appointment = {
			...state.appointments[id],
			interview: { ...interview }
		};
		const appointments = {
			...state.appointments,
			[id]: appointment
		};

		const bookingConfig = {
			method: 'put',
			url: `http://localhost:8001/api/appointments/${id}`,
			data: { interview }
		};
		return axios(bookingConfig).then(() => {
			setState({ ...state, appointments, days: updateSpots(id, appointments) });
		});
	}

	function cancelInterview(id, interview = null) {
		const appointment = {
			...state.appointments[id],
			interview
		};
		const appointments = {
			...state.appointments,
			[id]: appointment
		};

		const destroyApptConfig = {
			method: 'delete',
			url: `http://localhost:8001/api/appointments/${id}`
		};

		return axios(destroyApptConfig).then(() => {
			console.log(appointment, state.appointments);
			setState({
				...state,
				appointments,
				days: updateSpots(id, appointments)
			});
		});
	}

	return { setDay, state, bookInterview, cancelInterview };
}
