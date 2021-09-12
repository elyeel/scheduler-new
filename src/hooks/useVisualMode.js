import { useState } from 'react';

export default function useVisualMode(initial) {
	const [ mode, setMode ] = useState(initial);
	const [ history, setHistory ] = useState([ initial ]);

	const transition = function(mode, replace = false) {
		if (replace) {
			history.pop();
			// setHistory(history);
			// setMode(mode);
			// setHistory(prev => [...prev, mode]);
		} //else {
		setMode(mode);
		setHistory((prev) => [ ...prev, mode ]);
		//}
	};

	const back = function(mode) {
		// console.log(mode, history); //test props
		if (history.length > 1) {
			history.pop();
			// setHistory(history);
			// setMode(history.slice(-1)[0]);
		} // else {
		setMode(history.slice(-1)[0]); // error when database on error mode
		// }
	};
	return { mode, transition, back };
}
