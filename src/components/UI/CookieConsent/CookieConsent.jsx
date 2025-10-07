import React, { useEffect, useState } from 'react';
import styles from './CookieConsent.module.css';

const COOKIE_STORAGE_KEY = 'flatcher_cookie_consent';
const COOKIE_STORAGE_VALUE = 'accepted';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (stored !== COOKIE_STORAGE_VALUE) {
        setVisible(true);
      }
    } catch (_) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, COOKIE_STORAGE_VALUE);
    } catch (_) {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-live="polite">
      <div className={styles.inner}>
        <p className={styles.message}>
          Мы используем файлы cookie. Продолжая работу с сайтом, вы подтверждаете, что полностью ознакомились и согласны с&nbsp;
          <a href="/data-processing" target="_blank" rel="noopener noreferrer">Политикой обработки персональных данных и файлов Cookie</a>.
        </p>
        <button type="button" className={styles.button} onClick={handleAccept}>
          Хорошо
        </button>
      </div>
    </div>
  );
}
