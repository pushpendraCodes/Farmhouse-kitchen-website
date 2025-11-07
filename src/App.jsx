import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import FacilityPage from "./pages/FacilityPage";
import MenuPage from "./pages/MenuPage";
import BookingPage from "./pages/BookingPage";
import ContactUs from "./pages/ContactPage";
import SignupPage from "./pages/SignupPage";


export default function App() {


  return (
    <Router className="">
      <div className="flex flex-col min-h-screen">
        {/* Topbar */}
        {/* <Topbar /> */}

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/facilities" element={<FacilityPage />} />
            <Route path="/menus" element={<MenuPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/SignUp" element={<SignupPage />} />
          
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}
