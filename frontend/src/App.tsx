import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Coordinates from "./pages/coordinates/Coordinates";
import AreaVisualizer from "./components/AreaVisualizer";
import { useState } from "react";
import Loader from "./components/Loader";

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoaderFinish = () => {
    setLoading(false);
  };

  return (
      <div className="flex flex-col min-h-screen">
      <Navbar />
      {loading && <Loader onFinish={handleLoaderFinish} />}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coordinates" element={<Coordinates />} />
          <Route path="/area" element={<AreaVisualizer />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
