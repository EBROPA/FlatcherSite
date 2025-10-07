import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { Helmet } from 'react-helmet';
import Navbar from './components/UI/Navbar/Navbar';
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Breadcrumbs from "./components/UI/Breadcrumbs/Breadcrumbs";
import HomePage from './pages/HomePage';
import ContactsPage from "./pages/ContactsPage";
import SitePrivacyPage from "./pages/SitePrivacyPage";
import UserAgreementPage from "./pages/UserAgreementPage";
import DataProcessingPolicy from "./pages/DataProcessingPolicy";
import PersonalDataConsentPage from "./pages/PersonalDataConsentPage";
import NotFoundPage from "./pages/NotFoundPage";
import Footer from './components/UI/Footer/Footer';
import CookieConsent from './components/UI/CookieConsent/CookieConsent';
import './styles.css'

export default function App() {
    const { pathname } = useLocation();
    const isHome = pathname === "/";

    const knownPaths = new Set([
      "/",
      "/flats",
      "/retail",
      "/services",
      "/company",
      "/contacts",
      "/privacy",
      "/user-agreement",
      "/data-processing",
      "/consent"
    ]);

    const showBreadcrumbs = !isHome && knownPaths.has(pathname);

  return (
    <>
      <Helmet>
        <html lang="ru" />
        <meta name="author" content="Flatcher" />
        <meta name="robots" content="index,follow" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flatcher.su" />
        <meta property="og:image" content="https://flatcher.su/preview.jpg" />
        <meta property="og:title" content="Агентство элитной недвижимости Flatcher в Москве" />
        <meta property="og:description" content="Премиальные квартиры, коммерческие объекты и инвестиционные проекты в Москве с полным сопровождением." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Агентство элитной недвижимости Flatcher в Москве" />
        <meta name="twitter:description" content="Премиальные квартиры, коммерческие объекты и инвестиционные проекты в Москве с полным сопровождением." />
        <meta name="twitter:image" content="https://flatcher.su/preview.jpg" />
        <title>Агентство элитной недвижимости Flatcher в Москве</title>
        <meta name="description" content="Агентство элитной недвижимости Flatcher в Москве: подбор квартир и коммерческих объектов, сопровождение сделок и инвестиционные консультации." />
        <meta
          name="keywords"
          content="элитная недвижимость Москва, Flatcher, премиальные квартиры, коммерческая недвижимость, агентство элитной недвижимости" />
      </Helmet>
      <Navbar />
      <ScrollToTop />
      <main className={`page-content ${isHome ? 'fullscreen' : ''}`}>
        {showBreadcrumbs && <Breadcrumbs />}
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/contacts" element={<ContactsPage />}/>
          <Route path="/privacy" element={<SitePrivacyPage />} />
          <Route path="/user-agreement" element={<UserAgreementPage />} />
          <Route path="/data-processing" element={<DataProcessingPolicy />} />
          <Route path="/consent" element={<PersonalDataConsentPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}
