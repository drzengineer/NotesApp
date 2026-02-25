import { Route, Routes } from "react-router";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import NoteDetailPage from "./pages/NoteDetailPage";

const App = () => {
	return (
		<div className="h-full w-full" data-theme="forest">
			<div className="absolute inset-0 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#111_60%,#135ffb70_100%)]" />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/create" element={<CreatePage />} />
				<Route path="/note/:id" element={<NoteDetailPage />} />
			</Routes>
		</div>
	);
};
export default App;
