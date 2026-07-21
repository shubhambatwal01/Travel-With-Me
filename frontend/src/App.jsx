import { BrowserRouter, Routes, Route } from "react-router-dom";
import Booking from "./pages/Booking";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/booking" element={<Booking />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
