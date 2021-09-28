const SET_DAY = 'SET_DAY';
const SET_APPLICATION_DATA = 'SET_APPLICATION_DATA';
const SET_INTERVIEW = 'SET_INTERVIEW';

export default function reducer(state, action) {
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
			const { id, interview = null } = action.value;
			// console.log(id, interview);

			const appointment = {
				...state.appointments[id],
				interview: interview ? { ...interview } : null
			};
			const appointments = {
				...state.appointments,
				[id]: appointment
			};

			//this can be solved by using state.day comparison with state.days to get only the spots in a day to be updated, given state.day is dynamic

			const selectedDay = state.days.find((day) => day.name === state.day);
			const nullAppts = selectedDay.appointments.reduce((a, c) => {
				if (appointments[c].interview === null) a++;
				return a;
			}, 0);
			const tempDays = state.days.map(
				(day) => (day.name === state.day ? { ...day, spots: nullAppts } : day)
			);

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

export { SET_APPLICATION_DATA, SET_DAY, SET_INTERVIEW };
