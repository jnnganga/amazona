const getError = (err) =>
	err.response && err.response.daa && err.response.data.message
		? err.response.data.message
		: err.message;
export { getError };
