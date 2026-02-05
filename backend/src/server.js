import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import limiter from "./middleware/ratelimiter.js";
import notesRoutes from "./routes/notesRoutes.js";

const app = express();
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

connectDB().then(() => {
	app.listen(PORT, () => {
		console.log("Server started on PORT:", PORT);
	});
});

app.use(
	cors({
		origin: FRONTEND_URL,
	}),
);
app.use(express.json());
app.use(limiter);

app.use("/api/notes", notesRoutes);
