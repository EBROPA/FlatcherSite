import React from "react";
import styles from "./pageCSS/ContactsPage.module.css";

export default function ContactsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Контакты</h2>
        <div className={styles.divider} />

        <div className={styles.contactItem}>
          <a href="tel:+79104303366" className={styles.link}>
            +7 (495) 032‑21‑99
          </a>
        </div>

        <div className={styles.contactItem}>
          <a href="mailto:info@anwin.ru" className={styles.link}>
            info@flatcher.su
          </a>
        </div>

        <p className={styles.text}>
          Мы открыты для СМИ, поэтому вы всегда можете обратиться в пресс‑службу
          за комментариями, интервью и экспертными оценками.
        </p>
        <p className={styles.text}>
          Мы оперативно реагируем на запросы и помогаем редакциям в подготовке
          объективных и качественных материалов.
        </p>
      </div>

      </div>
  );
}
