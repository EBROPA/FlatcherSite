import React, { useEffect } from "react";
import styles from "./pageCSS/HomePage.module.css";
import heroPC from "@assets/img/hero-image.png";
import heroMobile from "@assets/img/hero-mobile-image.png";

export default function HomePage() {
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <>
      <section
        className={styles.hero}
        style={{
          backgroundImage: `url(${heroPC})`
        }}
        role="img"
        aria-label="Фоновое изображение"
      >
        <div className={styles.heroBanner} aria-hidden="true">
          <div className={styles.bannerInner}>
            <h1 className={styles.heroTitle}>
              Агентство&nbsp;
              <br className={styles.mobileOnly} />
              элитной<br />
              недвижимости<br />
              в Москве
            </h1>
          </div>
        </div>
        <div className={styles.buttonsContainer}>
          <div className={styles.serviceButton}>
            <div className={styles.buttonIcon}></div>
            <h2>ИНДИВИДУАЛЬНОЕ<br /> СОПРОВОЖДЕНИЕ</h2>
          </div>
          <div className={styles.serviceButton}>
            <div className={styles.buttonIcon}></div>
            <h2>ПОДБИРАЕМ КВАРТИРЫ<br /> ПРЕМИУМ-КЛАССА</h2>
          </div>
          <div className={styles.serviceButton}>
            <div className={styles.buttonIcon}></div>
            <h2>ПРОЕКТЫ, КОТОРЫХ НЕТ<br /> В ОБЩЕМ ДОСТУПЕ</h2>
          </div>
        </div>
      </section>
      <div
        style={{
          height: "50vh",
          backgroundColor: "#080808",
          width: "100%",
        }}
      ></div>
    </>
  );
}
