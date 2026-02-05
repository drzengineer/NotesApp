import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minute window
	limit: 100, // Limit each IP to 100 requests per `window`
});

export default limiter;
