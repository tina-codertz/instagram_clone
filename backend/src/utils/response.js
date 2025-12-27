// Utility for standardized responses if needed
export function success(res, data, status = 200) { return res.status(status).json(data); }
export function error(res, message, status = 400) { return res.status(status).json({ message }); }