import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/Navbar";
import VIPPass from "./pages/VipPass";
import Pass from "./pages/Pass";
import GLPass from "./pages/GlPass";
import HomePage from "./pages/Home";
import ProtectedRoute from "./component/ProtectedRoute";
import ProtectedRoute_Pass from "./component/ProtectedRoute_Pass";
import ProtectedRoute_GLPass from "./component/ProtectedRoute_GlPass";
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vippass" element={<ProtectedRoute element={VIPPass} />} />
        <Route path="/pass" element={<ProtectedRoute_Pass element = {Pass} />} />
        <Route path="/glpass" element={<ProtectedRoute_GLPass element = {GLPass}/>} />
      </Routes>
    </Router>
  );
};

export default App;