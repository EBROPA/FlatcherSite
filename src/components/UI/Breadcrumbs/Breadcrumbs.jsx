import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Breadcrumbs.module.css";

const breadcrumbNameMap = {
  "/": "Главная",
  "/flats": "Новостройки",
  "/retail": "Коммерческая недвижимость",
  "/services": "Услуги",
  "/company": "О компании",
  "/contacts": "Контакты",
  "/privacy": "Политика конфиденциальности",
  "/user-agreement": "Пользовательское соглашение",
  "/data-processing": "Политика обработки данных и Cookie",
  "/consent": "Согласие на обработку данных",
};

export default function Breadcrumbs() {
  const location = useLocation();
  const { pathname } = location;

  if (pathname === "/" || pathname.startsWith("/404")) {
    return null;
  }

  const pathnames = pathname.split("/").filter(Boolean);
  const crumbs = pathnames.map((_, index) => {
    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
    const label = breadcrumbNameMap[to] || decodeURIComponent(pathnames[index]).replace(/-/g, " ");
    const isLast = index === pathnames.length - 1;

    return (
      <li key={to} className={styles.item}>
        {isLast ? (
          <span className={styles.current}>{label}</span>
        ) : (
          <Link to={to} className={styles.link}>
            {label}
          </Link>
        )}
      </li>
    );
  });

  return (
    <nav className={styles.wrapper} aria-label="breadcrumb">
      <ol className={styles.list}>
        <li className={styles.item}>
          <Link to="/" className={styles.link}>
            {breadcrumbNameMap["/"]}
          </Link>
        </li>
        {crumbs}
      </ol>
    </nav>
  );
}
