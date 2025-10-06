import React from 'react';
import { Link } from 'react-router-dom';
import styles from './pageCSS/NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <p className={styles.preTitle}>Ошибка 404</p>
          <h1 className={styles.title}>Страница не найдена</h1>
          <p className={styles.subtitle}>
            Возможно, страница была удалена, переименована или временно недоступна.
          </p>
          <Link to="/" className={styles.backBtn}>
            Вернуться на главную
          </Link>
        </div>
      </div>
    </section>
  );
}

