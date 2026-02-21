import { setServers } from "node:dns";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import connectDB from "./config/db.js";
import limiter from "./middleware/rateLimiter.js";
import notesRoutes from "./routes/notesRoutes.js";

setServers(["1.1.1.1", "1.0.0.1"]);

const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || "";

const app = express();

app.use(helmet());
app.use(
	cors({
		origin: FRONTEND_URL,
	}),
);
app.use(express.json());
app.use(limiter);

app.use("/api/notes", notesRoutes);

connectDB().then(() => {
	app.listen(PORT, () => {
		console.log("Server started on PORT:", PORT);
	});
});
