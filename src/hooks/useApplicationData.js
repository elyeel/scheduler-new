import { useReducer, useEffect } from 'react';
import axios from 'axios';

// disabled, to avoid axios is not function error when doing test
// const first = {
// 	method: 'get',
// 	url: '/api/days',
// 	headers: {}
// };
// const second = {
// 	method: 'get',
// 	url: '/api/appointments',
// 	headers: {}
// };
// const third = {
// 	method: 'get',
// 	url: '/api/interviewers',
// 	headers: {}
// };

const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const SET_INTERVIEW = 'SET_INTERVIEW';

let webSocket;

export default function useApplicationData() {
	function reducer(state, action) {
		const { id, interview } = action.value;

		const appointment = interview
			? {
					...state.appointments[id],
					interview: { ...interview }
				}
			: { ...state.appointments[id], interview };
		const appointments = {
			...state.appointments,
			[id]: appointment
		};

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
					appointments,
					days: tempDays
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
		webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
		Promise.all([
			axios.get('/api/days'),
			axios.get('/api/appointments'),
			axios.get('/api/interviewers')
		]).then((all) => {
			dispatch({
				type: SET_APPLICATION_DATA,
				value: {
					days: all[0].data,
					appointments: all[1].data,
					interviewers: all[2].data
				}
			});

			webSocket.onmessage = (response) => {
				const { id, interview } = JSON.parse(response.data);

				// console.log(response.data);
				dispatch({
					type: SET_INTERVIEW,
					value: { id, interview }
				});
			};
		});

		return () => webSocket.close();
	}, []);

	function bookInterview(id, interview) {
		// const bookingConfig = {
		// 	method: 'put',
		// 	url: `http://localhost:8001/api/appointments/${id}`,
		// 	data: { interview }
		// };
		//combine update spots with appointments during setState to avoid error
		return axios.put(`/api/appointments/${id}`, { interview }).then(() =>
			webSocket.send(
				JSON.stringify({
					type: SET_INTERVIEW,
					value: { id, interview }
				})
			)
		);
	}

	function cancelInterview(id, interview = null) {
		// const destroyApptConfig = {
		// 	method: 'delete',
		// 	url: `http://localhost:8001/api/appointments/${id}`
		// };

		return axios.delete(`/api/appointments/${id}`).then(() =>
			webSocket.send(
				JSON.stringify({
					type: SET_INTERVIEW,
					value: { id, interview }
				})
			)
		);
	}

	return { setDay, state, bookInterview, cancelInterview };
}
