import React from "react";
import classes from "./Input.module.css";

const Input = ({ inputType, children, ...props }) => {
  return (
    <input className={classes.myInput} type={inputType} {...props}>
      {children}
    </input>
  );
};

export default Input;