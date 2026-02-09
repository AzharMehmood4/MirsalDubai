import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import View from "./components/View";
export default function App() {
  return (
    <Router>
      <TitleManager />

      <Routes>
        <Route path="/" element={<Login />} />
         <Route path="/view" element={<View />} />
      </Routes>
    </Router>
  );
}
TextTrackCueList