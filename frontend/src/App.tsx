import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Coordinates from "./pages/coordinates/Coordinates";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/coordinates" element={<Coordinates />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
