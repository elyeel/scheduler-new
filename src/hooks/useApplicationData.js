import { useReducer, useEffect } from 'react';
import axios from 'axios';
import reducer, {
	SET_DAY,
	SET_APPLICATION_DATA,
	SET_INTERVIEW
} from 'reducers/application';

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
		Promise.all([
			axios.get('/api/days'),
			axios.get('/api/appointments'),
			axios.get('/api/interviewers')
		]).then((all) =>
			dispatch({
				type: SET_APPLICATION_DATA,
				value: {
					days: all[0].data,
					appointments: all[1].data,
					interviewers: all[2].data
				}
			})
		);
	}, []);

	function bookInterview(id, interview) {
		//combine update spots with appointments during setState to avoid error
		return axios.put(`/api/appointments/${id}`, { interview }).then(() =>
			dispatch({
				type: SET_INTERVIEW,
				value: { id, interview }
			})
		);
	}

	function cancelInterview(id, interview = null) {
		return axios.delete(`/api/appointments/${id}`).then(() =>
			dispatch({
				type: SET_INTERVIEW,
				value: { id }
			})
		);
	}

	return { setDay, state, bookInterview, cancelInterview };
}
