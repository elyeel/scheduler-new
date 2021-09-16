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
			data: { id, interview }
		};
		return axios(bookingConfig).then((response) => {
			if (response.status >= 200 && response.status < 210)
				setState({ ...state, appointments });
		});
	}

	function cancelInterview(id) {
		const appointment = {
			...state.appointments[id],
			interview: null
		};
		const appointments = {
			...state.appointments,
			[id]: appointment
		};

		const destroyApptConfig = {
			method: 'delete',
			url: `http://localhost:8001/api/appointments/${id}`
		};

		return axios(destroyApptConfig).then((response) => {
			if (response.status > 199 && response.status < 210)
				setState({ ...state, appointments });
		});
	}

	return { setDay, state, bookInterview, cancelInterview };
}
