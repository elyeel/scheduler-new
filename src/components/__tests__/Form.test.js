/*
  We are rendering `<Form />` down below, so we need React.createElement
*/
import React from 'react';

/*
  We import our helper functions from the react-testing-library
  The render function allows us to render Components
*/
import { render, cleanup } from '@testing-library/react';

/*
  We import the component that we are testing
*/
import Form from 'components/Appointment/Form';

/* with the rest of the imports */
import { fireEvent } from '@testing-library/react';
/*
  A test that renders a React Component
*/
afterEach(cleanup);

describe('Form', () => {
	const interviewers = [
		{
			id: 1,
			name: 'Sylvia Palmer',
			avatar: 'https://i.imgur.com/LpaY82x.png'
		}
	];

	it('renders without student name if not provided', () => {
		const { getByPlaceholderText } = render(
			<Form interviewers={interviewers} />
		);

		expect(getByPlaceholderText('Enter Student Name')).toHaveValue('');
	});

	it('renders with initial student name', () => {
		const { getByTestId } = render(
			<Form name="Lydia Miller-Jones" interviewers={interviewers} />
		);
		expect(getByTestId('student-name-input')).toHaveValue('Lydia Miller-Jones');
	});

	it('validates that the student name is not blank', () => {
		/* 1. Create the mock onSave function */
		const onSave = jest.fn();

		/* 2. Render the Form with interviewers and the onSave mock function passed as an onSave prop, the name prop should be blank or undefined */
		const { getByText } = render(
			<Form interviewers={interviewers} save={onSave} name="" />
		);
		/* 3. Click the save button */
		fireEvent.click(getByText('Save'));

		expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
		expect(onSave).not.toHaveBeenCalled();
	});

	it('can successfully save after trying to submit an empty student name', () => {
		const onSave = jest.fn();
		const { getByText, getByPlaceholderText, queryByText } = render(
			<Form interviewers={interviewers} save={onSave} />
		);

		fireEvent.click(getByText('Save'));

		expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
		expect(onSave).not.toHaveBeenCalled();

		fireEvent.change(getByPlaceholderText('Enter Student Name'), {
			target: { value: 'Lydia Miller-Jones' }
		});

		fireEvent.click(getByText('Save'));

		expect(queryByText(/student name cannot be blank/i)).toBeNull();

		expect(onSave).toHaveBeenCalledTimes(1);
		expect(onSave).toHaveBeenCalledWith('Lydia Miller-Jones', null);
	});

	it('calls back (onCancel) and resets the input field', () => {
		const back = jest.fn();
		const { getByText, getByPlaceholderText, queryByText } = render(
			<Form
				interviewers={interviewers}
				name="Lydia Mill-Jones"
				save={jest.fn()}
				back={back}
			/>
		);

		fireEvent.click(getByText('Save'));

		fireEvent.change(getByPlaceholderText('Enter Student Name'), {
			target: { value: 'Lydia Miller-Jones' }
		});

		fireEvent.click(getByText('Cancel'));

		expect(queryByText(/student name cannot be blank/i)).toBeNull();

		expect(getByPlaceholderText('Enter Student Name')).toHaveValue('');

		expect(back).toHaveBeenCalledTimes(1);
	});
});
