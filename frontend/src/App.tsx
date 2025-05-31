import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Coordinates from "./pages/coordinates/Coordinates";


import AreaVisualizer from "./components/AreaVisualizer";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/coordinates" element={<Coordinates />} />
            <Route
                path="/area" // <-- Nowa ścieżka
                element={<AreaVisualizer/>}
                />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
