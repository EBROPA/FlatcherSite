import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import Navbar from './components/UI/Navbar/Navbar';
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import HomePage from './pages/HomePage';
import FlatCatalogPage from "./pages/FlatCatalogPage";
import ContactsPage from "./pages/ContactsPage";
import CompanyPage from "./pages/CompanyPage";
import RetailCatalogPage from "./pages/RetailCatalogPage";
import SitePrivacyPage from "./pages/SitePrivacyPage";
import Footer from "./components/UI/Footer/Footer";
import './styles.css'

export default function App() {
    const { pathname } = useLocation();
    const isHome = pathname === "/";

  return (
    <>
      <Navbar />
      <ScrollToTop />
        <main className={`page-content ${isHome ? 'fullscreen' : ''}`}>
            <Routes>
                <Route path="/" element={<HomePage />}/>
                <Route path="/catalog/flat" element={<FlatCatalogPage />}/>
                <Route path="/catalog/retail" element={<RetailCatalogPage />}/>
                <Route path="/company" element={<CompanyPage />}/>
                <Route path="/contacts" element={<ContactsPage />}/>
                <Route path="/privacy" element={<SitePrivacyPage />} />
            </Routes>
        </main>
        <Footer />
    </>
  );
}
