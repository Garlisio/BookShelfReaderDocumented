import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Books from "./pages/Books";
import Register from "./pages/Register";
import PdfReader from "./pages/PdfReader";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Books" element={<Books />} />
        <Route path="/reader" element={<PdfReader />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
