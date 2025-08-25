import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import textLogo from "@assets/svg/logo-text.svg";
import noTextLogo from "@assets/svg/logo-notext-logo.svg";
import phone_icon from "@assets/svg/phone-icon.svg";
import mobile_phone_icon from "@assets/svg/phone-mobile-icon.svg";
import watsapp_icon from "@assets/svg/whatsapp-icon.svg";

const Navbar = () => {
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
                     style={{ height: "1.7rem", width: "auto", display: "inline-block" }}
                />
                <img
                    src={textLogo}
                    alt="FLATCHER"
                    style={{ height: "1.3rem", width: "auto", display: "inline-block" }}
                />
              </Link>
            </div>
          </div>
          <div className={styles.leftGroup}>
            <div className={styles.menu}>
              <Link to="/catalog/flat" className={styles.menuItem}>
                <span className={styles.link}>НОВОСТРОЙКИ</span>
              </Link>
              <Link to="/catalog/services" className={styles.menuItem}>
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
            <a href="tel:+74950322199" className={styles.phoneBlock}>
              <div className={styles.phoneIconWrapper}>
                <img
                  src={phone_icon}
                  alt="phone"
                  className={`${styles.phoneIcon} ${styles.phoneIconDesktop}`}
                />
                <img
                  src={mobile_phone_icon}
                  alt="phone"
                  className={`${styles.phoneIcon} ${styles.phoneIconMobile}`}
                />
              </div>
              <span className={styles.phoneNumber}>+7 (495) 032-21-99</span>
            </a>

            <div className={styles.iconContainer}>
              <div className={styles.icon}>
                <img
                  src={watsapp_icon}
                  alt="WATSAPP"
                  className={styles.watsappIcon}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
