import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router";
import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("Root element #root not found in index.html");
createRoot(root).render(
	<StrictMode>
		<BrowserRouter>
			<App />
			<Toaster />
		</BrowserRouter>
	</StrictMode>,
);
