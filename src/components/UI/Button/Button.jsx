import React from "react";
import classes from "./Button.module.css";

const Button = ({ children, styleBtn, ...props }) => {
  return (
    <div style={styleBtn} className={classes.myBtn} {...props}>
      {children}
    </div>
  );
};

export default Button;