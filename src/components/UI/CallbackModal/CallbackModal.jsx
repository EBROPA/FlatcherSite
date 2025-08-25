import React, { useState } from "react";
import styles from "./CallbackModal.module.css";
import image from "@assets/img/flatcher-icon.jpg";

export default function CallbackModal({ isOpen, onClose }) {
  const [step, setStep] = useState("form");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/callback", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Network response was not OK");
      setStep("thanks");
    } catch (err) {
      setError("Произошла ошибка, попробуйте ещё раз");
      setStep("error");
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.container}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>
        {step === "form" && (
          <form
            className={styles.form}
            action="https://flatcher.com/form/callback"
            method="POST"
            onSubmit={handleSubmit}
          >
            <h2 className={styles.title}>Закажите звонок эксперта</h2>
            <p className={styles.subtitle}>
              Укажите свои контакты и эксперт проекта свяжется с вами в первую
              свободную минуту
            </p>
            <input
              type="text"
              name="phone"
              placeholder="+7 (959) 959-95-95"
              className={styles.input}
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Ваше имя"
              className={styles.input}
              required
            />
            <button type="submit" className={styles.submitBtn}>
              Заказать звонок
            </button>
            <p className={styles.note}>
              Обычно перезваниваем в течение 15 минут
            </p>
          </form>
        )}
        {step === "thanks" && (
          <div className={styles.feedback}>
            <img
              src={image}
              alt="check"
              className={styles.feedbackIcon}
            />
            <p className={styles.feedbackText}>Приняли заявку, скоро перезвоним</p>
            <button
              className={styles.backBtn}
              onClick={() => setStep("form")}
            >
              &lt; вернуться к форме
            </button>
          </div>
        )}
        {step === "error" && (
          <div className={styles.feedback}>
            <img
              src="/images/illustrations/error.png"
              alt="error"
              className={styles.feedbackIcon}
            />
            <p className={styles.feedbackText}>{error}</p>
            <button
              className={styles.backBtn}
              onClick={() => setStep("form")}
            >
              &lt; вернуться к форме
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
