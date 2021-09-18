import { useReducer, useEffect } from 'react';
import axios from 'axios';
// import reducer from './useReducer';

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

const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const SET_INTERVIEW = 'SET_INTERVIEW';

export default function useApplicationData() {
	function reducer(state, action) {
		switch (action.type) {
			case SET_DAY:
				return {
					...state,
					day: action.value
				};
			case SET_APPLICATION_DATA:
				return {
					...state,
					days: action.value.days,
					appointments: action.value.appointments,
					interviewers: action.value.interviewers
				};
			case SET_INTERVIEW: {
				return {
					...state,
					appointments: action.value.appointments,
					days: action.value.days
				};
			}
			default:
				throw new Error(
					`Tried to reduce with unsupported action type: ${action.type}`
				);
		}
	}

	const [ state, dispatch ] = useReducer(reducer, {
		day: 'Monday',
		days: [],
		appointments: [],
		interviewers: {}
	});

	const setDay = (day) => dispatch({ type: SET_DAY, value: day });
	// === setState({...state, day})

	useEffect(() => {
		Promise.all([ axios(first), axios(second), axios(third) ]).then(
			(all) =>
				dispatch({
					type: SET_APPLICATION_DATA,
					value: {
						days: all[0].data,
						appointments: all[1].data,
						interviewers: all[2].data
					}
				})
			// {
			// 	setState((prev) => ({
			// 		...prev,
			// 		days: all[0].data,
			// 		appointments: all[1].data,
			// 		interviewers: all[2].data
			// 	}));
			// });
		);
	}, []);

	const updateSpots = (id, appointments) => {
		//this can be solved by using state.day comparison with state.days to get only the spots in a day to be updated, given state.day is dynamic
		let dayId = 0;
		if (id > 5) dayId++;
		if (id > 10) dayId++;
		if (id > 15) dayId++;
		if (id > 20) dayId++;

		const spotsInDay = Object.values(appointments).reduce((a, c, i) => {
			if (c.interview === null && i >= dayId * 5 && i < dayId * 5 + 5) a++;
			return a;
		}, 0);

		//array.map create a new array with new value based on previous
		const tempDays = state.days.map(
			(day) => (day.id === dayId + 1 ? { ...day, spots: spotsInDay } : day)
		);

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
		//combine update spots with appointments during setState to avoid error
		return axios(bookingConfig).then(
			() =>
				dispatch({
					type: SET_INTERVIEW,
					value: { appointments, days: updateSpots(id, appointments) }
				})
			// {
			// 	setState({ ...state, appointments, days: updateSpots(id, appointments) });
			// }
		);
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

		return axios(destroyApptConfig).then(
			() =>
				dispatch({
					type: SET_INTERVIEW,
					value: { appointments, days: updateSpots(id, appointments) }
				})
			// {
			// 	setState({
			// 		...state,
			// 		appointments,
			// 		days: updateSpots(id, appointments)
			// 	});
			// }
		);
	}

	return { setDay, state, bookInterview, cancelInterview };
}
