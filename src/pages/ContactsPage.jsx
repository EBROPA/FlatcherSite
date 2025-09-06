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
            +7 (977) 174‑01‑79
          </a>
        </div>

        <div className={styles.contactItem}>
          <a href="mailto:info@anwin.ru" className={styles.link}>
            info@flatcher.com
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

      <div className={styles.card}>
        <h2 className={styles.title}>Реквизиты</h2>
        <div className={styles.divider} />

        <dl className={styles.detailsList}>
          <div className={styles.detailsItem}>
            <dt className={styles.dt}>Дата регистрации</dt>
            <dd className={styles.dd}>28.03.2025</dd>
          </div>
          <div className={styles.detailsItem}>
            <dt className={styles.dt}>ИНН</dt>
            <dd className={styles.dd}>772465913434</dd>
          </div>
          <div className={styles.detailsItem}>
            <dt className={styles.dt}>ОГРНИП</dt>
            <dd className={styles.dd}>325774600205503</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
