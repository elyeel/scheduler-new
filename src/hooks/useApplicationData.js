import { useReducer, useEffect } from 'react';
import axios from 'axios';
import reducer, {
	SET_INTERVIEW,
	SET_DAY,
	SET_APPLICATION_DATA
} from 'reducers/application';
// disabled, to avoid axios is not function error when doing test

let webSocket;

export default function useApplicationData() {
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
