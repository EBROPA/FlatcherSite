import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import textLogo from "@assets/svg/logo-text.svg";
import noTextLogo from "@assets/svg/logo-notext-logo.svg";
import watsapp_icon from "@assets/svg/whatsapp-icon.svg";
import phone_icon from "@assets/svg/phone-icon-test.svg";
import burger_icon from "@assets/svg/burger.svg";

const Navbar = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 900);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 900);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isDesktop && isMenuOpen && !e.target.closest(`.${styles.mobileMenu}`) && !e.target.closest(`.${styles.burgerButton}`)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen, isDesktop]);

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.leftLogoGroup}>
            <div className={styles.logo}>
              <Link to="/" className={styles.bigLink}>
                <img
                    src={noTextLogo}
                    alt="FLATCHER"
                    className={styles.logoNoText}
                    style={{ height: "1.7rem", width: "auto" }}
                />
                <img
                    src={textLogo}
                    alt="FLATCHER"
                    className={styles.textLogo}
                    style={{ width: "auto", display: "inline-block" }}
                />
              </Link>
            </div>
          </div>
          <div className={styles.leftGroup}>
            <div className={styles.menu}>
              <Link to="/flats" className={styles.menuItem}>
                <span className={styles.link}>НОВОСТРОЙКИ</span>
              </Link>
              <Link to="/services" className={styles.menuItem}>
                <span className={styles.link}>УСЛУГИ</span>
              </Link>
              <Link to="/company" className={styles.menuItem}>
                <span className={styles.link}>О КОМПАНИИ</span>
              </Link>
              <Link to="/contacts" className={styles.menuItem}>
                <span className={styles.link}>КОНТАКТЫ</span>
              </Link>
            </div>
          </div>

          <div className={styles.rightGroup}>
            {isDesktop ? (
              <a href="tel:+74950322199" className={styles.phoneBlock}>
                <img
                  src={phone_icon}
                  alt="phone" 
                  className={styles.phoneIcon}
                />
                <span className={styles.phoneNumber}>+7 (495) 032-21-99</span>
              </a>
            ) : (
              <>
                <a href="https://wa.me/74950322199" target="_blank" rel="noopener noreferrer" className={styles.phoneBlock}>
                  <img
                    src={watsapp_icon}
                    alt="WhatsApp"
                    className={styles.phoneIcon}
                  />
                  <span className={styles.phoneNumber}>WhatsApp</span>
                </a>
                <a href="tel:+74950322199" className={styles.phoneBlock}>
                  <img
                    src={phone_icon}
                    alt="phone"
                    className={styles.phoneIcon}
                  />
                  <span className={styles.phoneNumber}>+7 (495) 032-21-99</span>
                </a>
                <button 
                  onClick={toggleMenu} 
                  className={`${styles.burgerButton} ${isMenuOpen ? styles.active : ''}`}
                >
                  <img
                    src={burger_icon}
                    alt="menu"
                    className={styles.phoneIcon}
                  />
                </button>
              </>
            )}

            <div className={styles.iconContainer}>
              <div className={styles.icon}>
                <a href="https://wa.me/74950322199" target="_blank" rel="noopener noreferrer">
                  <img
                    src={watsapp_icon}
                    alt="WATSAPP"
                    className={styles.watsappIcon}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {!isDesktop && (
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileMenuContent}>
            <Link to="/flats" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
              <span className={styles.mobileMenuLink}>НОВОСТРОЙКИ</span>
            </Link>
            <Link to="/services" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
              <span className={styles.mobileMenuLink}>УСЛУГИ</span>
            </Link>
            <Link to="/company" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
              <span className={styles.mobileMenuLink}>О КОМПАНИИ</span>
            </Link>
            <Link to="/contacts" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
              <span className={styles.mobileMenuLink}>КОНТАКТЫ</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
