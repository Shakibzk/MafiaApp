import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                {/* مسیر /welcome حذف شد */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
