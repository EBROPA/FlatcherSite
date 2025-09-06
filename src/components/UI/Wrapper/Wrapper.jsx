import React from "react";
import classes from "./Wrapper.module.css";

const Wrapper = ({ items = [], renderItem }) => {
  if (!Array.isArray(items)) {
    console.error("Wrapper: 'items' должен быть массивом");
    return null;
  }

  return (
    <div className={classes.wrapperGrid}>
      {items.map((item, index) => (
        <div key={item.id || index} className={classes.card}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

export default Wrapper;
