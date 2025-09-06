import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import logoUrl from "@assets/img/flatcher-icon.jpg";
import CallbackModal from "../CallbackModal/CallbackModal";

export default function Footer() {
  const services = [
    { label: "О Компании", to: "/company" },
    { label: "Аналитика", to: "/catalog/flat" },
    { label: "Консалтинг", to: "/catalog/flat" },
    { label: "Инвестиции", to: "/catalog/retail" },
    { label: "Контакты", to: "/contacts/" },
  ];

  const city = [
    { label: "Квартира",   to: "/catalog/flat"   },
    { label: "Пентхаус",   to: "/catalog/flat"   },
    { label: "Апартаменты",to: "/catalog/flat"   },
    { label: "Новостройки",to: "/catalog/flat"   },
  ];
  const abroad = [
    { label: "Таунхаус",   to: "/catalog/flat"   },
    { label: "Квартира",   to: "/catalog/flat"   },
    { label: "Особняк",    to: "/catalog/flat"   },
    { label: "Пентхаус",   to: "/catalog/flat"   },
  ];
  const comm = [
    { label: "Коммерческая",    to: "/catalog/retail" },
    { label: "Офис",            to: "/catalog/retail" },
    { label: "Особняк",         to: "/catalog/retail" },
    { label: "Ритейл",          to: "/catalog/retail" },
  ];

  const [modalOpen, setModalOpen] = useState(false);

  return (
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <Link to="/" aria-label="home">
            <img src={logoUrl} alt="FLATCHER" className={styles.logo}/>
          </Link>
          <div className={styles.contactBlock}>
            <a href="tel:+79771740179" className={styles.phone}>
              +7 977 174‑01‑79
            </a>
            <button className={styles.cta} onClick={() => setModalOpen(true)}>Заказать звонок</button>
            <CallbackModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
          </div>
        </div>

        <ul className={styles.servicesMenu}>
          {services.map((s) => (
              <li key={s.to}>
                <Link to={s.to} className={styles.servicesLink}>
                  {s.label}
                </Link>
              </li>
          ))}
        </ul>

        <div className={styles.infoWrap}>
          <div className={styles.columns}>
            {[city, abroad, comm].map((col, idx) => (
                <ul key={idx} className={styles.column}>
                  {col.map(({label, to}) => (
                      <li key={label}>
                        <Link to={to} className={styles.columnLink}>
                          {label}
                        </Link>
                      </li>
                  ))}
                </ul>
            ))}
          </div>
        </div>

        <ul className={styles.footerEnd}>
          <li className={styles.footerEndItem}>©FLATCHER, 2025</li>
          <li className={styles.footerEndItem}>
            <Link to="/privacy/" className={styles.footerLink}>
              Политика конфиденциальности
            </Link>
          </li>
        </ul>
      </footer>
  );
}
