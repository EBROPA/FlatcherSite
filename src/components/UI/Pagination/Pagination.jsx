import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Pagination.module.css";

const Pagination = ({ currentPage, totalPages }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToPage = (page) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", page);
    navigate({ pathname: location.pathname, search: searchParams.toString() });

    window.scrollTo(0, 0);
  };

  const renderPageButton = (page) => (
    <li
      key={page}
      className={`${styles.pagerItem} ${currentPage === page ? styles.active : ""}`}
    >
      <button onClick={() => goToPage(page)}>{page}</button>
    </li>
  );

  const renderEllipsis = (key) => (
    <li key={key} className={styles.pagerItem} role="presentation">
      …
    </li>
  );

  const pagesToShow = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    pages.push(1); // Always show first page

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages); // Always show last page

    return pages;
  };


  return (
    <nav className={styles.pager}>
      <ul className={styles.pagerItems}>
        <li className={styles.pagerItem}>
          <button onClick={() => goToPage(1)} title="На первую страницу">«</button>
        </li>
        <li className={styles.pagerItem}>
          <button
            onClick={() => goToPage(Math.max(1, currentPage - 1))}
            title="Предыдущая"
          >
            ‹
          </button>
        </li>

        {pagesToShow().map((page, index) =>
          page === "..." ? renderEllipsis(`ellipsis-${index}`) : renderPageButton(page)
        )}

        <li className={styles.pagerItem}>
          <button
            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
            title="Следующая"
          >
            ›
          </button>
        </li>
        <li className={styles.pagerItem}>
          <button onClick={() => goToPage(totalPages)} title="На последнюю страницу">»</button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
