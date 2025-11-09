import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import textLogo from "@assets/svg/logo-text.svg";
import noTextLogo from "@assets/svg/logo-notext-logo.svg";
import watsapp_icon from "@assets/svg/whatsapp-icon.svg";
import phone_icon from "@assets/svg/phone-icon-test.svg";

const Navbar = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 900);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 900);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      
    </nav>
  );
};

export default Navbar;
