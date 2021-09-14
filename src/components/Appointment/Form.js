import React, { useState } from 'react';
import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';

export default function Form(props) {
	const { interviewers, onSave, back } = props;
	const [ studentName, setStudentName ] = useState(props.name || '');
	const [ interviewer, setInterviewer ] = useState(props.interviewer || null);

	const reset = () => {
		setStudentName('');
		setInterviewer(null);
	};

	const cancel = () => {
		reset();
		back();
	};

	// const submit = event => event.preventDefault()

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
						/*
          This must be a controlled component
        */
					/>
				</form>
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
