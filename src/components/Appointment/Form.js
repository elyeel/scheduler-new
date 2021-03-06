import React, { useState } from 'react';
import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';

export default function Form(props) {
	const { interviewers, back, save } = props;
	const [ studentName, setStudentName ] = useState(props.name || '');
	const [ interviewer, setInterviewer ] = useState(props.interviewer || null);
	const [ error, setError ] = useState('');

	const reset = () => {
		setStudentName('');
		setInterviewer(null);
	};

	const cancel = () => {
		reset();
		back();
	};

	const onSave = () => {
		if (studentName === '') {
			setError('Student name cannot be blank');
			return;
		}

		setError('');
		save(studentName, interviewer);
	};

	return (
		<main className="appointment__card appointment__card--create">
			<section className="appointment__card-left">
				<form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
					<input
						className="appointment__create-input text--semi-bold"
						name="name"
						type="text"
						placeholder="Enter Student Name"
						value={studentName}
						onChange={(e) => setStudentName(e.target.value)}
						data-testid="student-name-input"
						/*
          This must be a controlled component
        */
					/>
				</form>
				<section className="appointment__validation">{error}</section>
				<InterviewerList
					interviewers={interviewers}
					value={interviewer}
					onChange={setInterviewer}
				/>
			</section>
			<section className="appointment__card-right">
				<section className="appointment__actions">
					<Button danger onClick={cancel}>
						Cancel
					</Button>
					<Button confirm onClick={onSave}>
						Save
					</Button>
				</section>
			</section>
		</main>
	);
}
