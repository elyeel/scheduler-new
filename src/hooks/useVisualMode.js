import { useState } from 'react';

export default function useVisualMode(initial) {
	const [ mode, setMode ] = useState(initial);
	const [ history, setHistory ] = useState([ initial ]);

	const transition = (newMode, replace = false) => {
		if (replace) {
			history.pop();
			setHistory(() => [ ...history, newMode ]);
		} else {
			setHistory((prev) => [ ...prev, newMode ]);
		}
		setMode(newMode);
	};

	const back = () => {
		if (history.length > 1) {
			history.pop();
		}
		setMode(history.slice(-1)[0]);
	};

	return { mode, transition, back };
}
