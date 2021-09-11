export function getAppointmentsForDay(state, day) {
	if (state.days.length === 0) return [];
	const selectedDay = state.days.filter((d) => d.name === day);
	if (selectedDay.length === 0) return [];
	return selectedDay[0].appointments.map((dayId) => state.appointments[dayId]);
}