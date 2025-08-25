import React, { useEffect } from "react";
import styles from "./pageCSS/HomePage.module.css";
import hero from '@assets/img/hero-image.png';

export default function HomePage() {
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${hero})` }}
      role="img"
      aria-label="Фоновое изображение"
    >
      <div className={styles.centerContent}>
      </div>
    </section>
  );
}
