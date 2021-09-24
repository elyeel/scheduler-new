import React from 'react';
// import axios from 'axios';

import {
	render,
	cleanup,
	waitForElement,
	fireEvent,
	getByText,
	prettyDOM,
	getAllByTestId,
	getByPlaceholderText,
	getByAltText,
	queryByText
} from '@testing-library/react';

import Application from 'components/Application';
// import axios from '__mocks__/axios';

afterEach(cleanup);

describe('Application', () => {
	it('defaults to Monday and changes the schedule when a new day is selected', async () => {
		const { getByText } = render(<Application />);

		await waitForElement(() => getByText('Monday'));
		fireEvent.click(getByText('Tuesday'));
		expect(getByText('Leopold Silvers')).toBeInTheDocument();
	});

	it('loads data, books an interview and reduces the spots remaining for the first day by 1', async () => {
		// 1. Render the Application.
		const { container, debug } = render(<Application />);
		// 2. Wait until the text "Archie Cohen" is displayed.
		await waitForElement(() => getByText(container, 'Archie Cohen'));
		const appointments = getAllByTestId(container, 'appointment');
		const appointment = getAllByTestId(container, 'appointment')[0];
		// 3. Click the "Add" button on the first empty appointment.
		fireEvent.click(getByAltText(appointment, 'Add'));
		// 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
		fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
			target: { value: 'Lydia Miller-Jones' }
		});
		// 5. Click the first interviewer in the list.
		fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));
		// 6. Click the "Save" button on that same appointment.
		fireEvent.click(getByText(appointment, 'Save'));
		// console.log(prettyDOM(appointment));
		// 7. Check that the element with the text "Saving" is displayed.
		expect(getByText(appointment, 'Saving...')).toBeInTheDocument();
		// 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
		await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));
		// 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
		const day = getAllByTestId(container, 'day').find((day) =>
			queryByText(day, 'Monday')
		);
		// debug();
		console.log(prettyDOM(day));
		expect(getByText(day, 'no spots remaining')).toBeInTheDocument();
	});
});
