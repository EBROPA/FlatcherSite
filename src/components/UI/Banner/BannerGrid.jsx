import React from "react";
import styles from "./BannerGrid.module.css";

const BannerGrid = ({ items }) => {
  return (
    <div className={styles.gridContainer}>
      {items.map((item) => (
        <div
          key={item.id}
          className={styles.banner}
          style={{
            backgroundImage: `url(${item.backgroundImage})`,
          }}
        >
          <div className={styles.overlay} />
          <div className={styles.content}>
            <h2 className={styles.title}>{item.title}</h2>
            {item.subtitle && (
              <p className={styles.subtitle}>{item.subtitle}</p>
            )}
            {item.buttonText && (
              <button className={styles.button}>{item.buttonText}</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BannerGrid;
