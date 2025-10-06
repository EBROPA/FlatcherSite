import React, { useEffect, useState } from "react";
import styles from "./CallbackModal.module.css";
import phoneAnswer from "@assets/img/phone-answer.png";
import PhoneInput from "../PhoneInput/PhoneInput";

const getStorage = (key, fallback = "") => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (_) {
    return fallback;
  }
};

const setStorage = (key, value) => {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch (_) {}
};

export default function CallbackModal({ isOpen, onClose, prefill }) {
  const [step, setStep] = useState("form");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState(() => getStorage("leadPhone"));
  const [userName, setUserName] = useState(() => getStorage("leadName"));
  const [isConsentTooltipVisible, setIsConsentTooltipVisible] = useState(false);

  useEffect(() => setStorage("leadPhone", phone), [phone]);
  useEffect(() => setStorage("leadName", userName), [userName]);

  if (!isOpen) return null;

  const isPhoneComplete = (val) => (val || "").replace(/\D/g, "").length === 11;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isPhoneComplete(phone)) {
      setStatus("Пожалуйста, введите полный номер телефона");
      return;
    }

    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("name", userName);

    try {
      const response = await fetch("/api/callback", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Request failed");
      setStep("thanks");
    } catch (err) {
      setError("Произошла ошибка, попробуйте ещё раз");
      setStep("error");
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const showTooltip = () => setIsConsentTooltipVisible(true);
  const hideTooltip = () => setIsConsentTooltipVisible(false);

  const renderConsentDisclaimer = () => {
    const handleMouseLeave = (event) => {
      const nextTarget = event.relatedTarget;
      if (nextTarget && event.currentTarget.contains(nextTarget)) {
        return;
      }
      hideTooltip();
    };

    return (
      <>
        Отправляя заявку, вы даёте своё{" "}
        <span
          className={styles.consentWrapper}
          onMouseEnter={showTooltip}
          onMouseLeave={handleMouseLeave}
          onFocus={showTooltip}
          onBlurCapture={(event) => {
            const nextTarget = event.relatedTarget;
            if (nextTarget && event.currentTarget.contains(nextTarget)) {
              return;
            }
            hideTooltip();
          }}
          onTouchStart={showTooltip}
          tabIndex={0}
          data-visible={isConsentTooltipVisible}
        >
          <span className={styles.consentText}>согласие</span>
          <span
            className={styles.consentTooltip}
            role="tooltip"
            onMouseEnter={showTooltip}
            onMouseLeave={(event) => {
              const nextTarget = event.relatedTarget;
              const parent = event.currentTarget.parentElement;
              if (nextTarget && parent && parent.contains(nextTarget)) {
                return;
              }
              hideTooltip();
            }}
          >
            Я полностью ознакомился и согласен с <a href="/user-agreement" target="_blank" rel="noopener noreferrer">Пользовательским соглашением</a>, <a href="/data-processing" target="_blank" rel="noopener noreferrer">Политикой обработки персональных данных и файлов Cookie</a>, и предоставляю конкретное, предметное, информированное, сознательное и однозначное <a href="/consent" target="_blank" rel="noopener noreferrer">Согласие на обработку моих персональных данных</a>.
          </span>
        </span>{" "}
        на обработку персональных данных
      </>
    );
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.dialog} role="dialog" aria-modal="true">
        <div className={styles.mobileHeader}>
          <p className={styles.disclaimerTop}>{renderConsentDisclaimer()}</p>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Закрыть"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <button
          type="button"
          className={styles.desktopClose}
          aria-label="Закрыть"
          onClick={onClose}
        >
          ×
        </button>

        <div className={styles.contentPane}>
          {step === "form" && (
            <form className={styles.form} onSubmit={handleSubmit}>
              <h2 className={styles.title}>
                <span className={styles.titleLine}>ЗАКАЖИТЕ ЗВОНОК</span>
                <span className={styles.titleLine}>ЭКСПЕРТА</span>
              </h2>
              <p className={styles.subtitle}>
                Укажите свои контакты, и персональный консультант свяжется с вами в первую свободную минуту
              </p>

              {prefill?.showSummary && prefill?.summary && (
                <div className={styles.summaryBlock}>
                  <span className={styles.summaryLabel}>Ваш запрос</span>
                  <p className={styles.summaryText}>{prefill.summary}</p>
                </div>
              )}

              <PhoneInput
                id="callback-phone"
                name="phone"
                value={phone}
                onAccept={(val) => setPhone(val)}
                onComplete={() => setStatus("")}
                inputMode="tel"
                autoComplete="tel"
                className={styles.phoneInput}
                placeholder="+7 (999) 999-99-99"
              />

              {status && <p className={styles.error}>{status}</p>}

              <input
                id="callback-name"
                name="name"
                type="text"
                placeholder="Ваше имя"
                className={styles.textInput}
                autoComplete="name"
                required
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
              />

              <button type="submit" className={styles.submitBtn}>
                заказать звонок
              </button>

              <p className={styles.caption}>Обычно перезваниваем в течение 5 минут</p>
            </form>
          )}

          {step !== "form" && (
            <p className={styles.disclaimerTopSecondary}>{renderConsentDisclaimer()}</p>
          )}

          <p className={styles.disclaimerBottom}>{renderConsentDisclaimer()}</p>

          {step === "thanks" && (
            <div className={styles.resultPane}>
              <h3 className={styles.resultTitle}>Заявка отправлена</h3>
              <p className={styles.resultText}>
                Наш эксперт уже получил ваш запрос и свяжется с вами совсем скоро.
              </p>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setStep("form")}
              >
                отправить ещё один запрос
              </button>
            </div>
          )}

          {step === "error" && (
            <div className={styles.resultPane}>
              <h3 className={styles.resultTitle}>Что-то пошло не так</h3>
              <p className={styles.resultText}>{error}</p>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setStep("form")}
              >
                попробовать ещё раз
              </button>
            </div>
          )}

        </div>

        <div className={styles.imagePane}>
          <img
            src={phoneAnswer}
            alt="Входящий звонок эксперта"
            className={styles.phoneImage}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}
