import React, { useEffect, useState, useRef } from "react";
import CallbackModal from "../components/UI/CallbackModal/CallbackModal";
import styles from "./pageCSS/HomePage.module.css";
import heroPC from "@assets/img/hero-image.png";
import womanImg from "@assets/img/woman-img.png";
import aboutBack from "@assets/img/about-back.png";
import backgroundImg from "@assets/img/background-img.png";
import telegramIcon from "@assets/svg/telegram-icons.svg";
import whatsappIcon from "@assets/svg/whatsapp-icon.svg";
import oneImg from "@assets/img/one-img.png";
import miraImg from "@assets/img/mira-img.png";
import domFrankaImg from "@assets/img/dom-franka-img.png";
import kutuzovSityImg from "@assets/img/kutuzov-sity-img.png";
import PhoneInput from "../components/UI/PhoneInput/PhoneInput";
import Breadcrumbs from "../components/UI/Breadcrumbs/Breadcrumbs";


export default function HomePage() {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [areaFrom, setAreaFrom] = useState("");
  const [areaTo, setAreaTo] = useState("");
  const [queryText, setQueryText] = useState("");
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isIndModalOpen, setIsIndModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [offerPrefill, setOfferPrefill] = useState(null);
  const [filterPrefill, setFilterPrefill] = useState(null);
  const [indPrefill, setIndPrefill] = useState(null);
  const [requestPrefill, setRequestPrefill] = useState(null);
  const [requestName, setRequestName] = useState("");
  const [requestPhone, setRequestPhone] = useState("");
  const [requestErrors, setRequestErrors] = useState({ name: false, phone: false });
  const consentRef = useRef(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const formatThousands = (value) => {
    const digits = value.replace(/\D+/g, "");
    if (!digits) return "";
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handlePriceFrom = (e) => {
    setPriceFrom(formatThousands(e.target.value));
  };

  const handlePriceTo = (e) => {
    setPriceTo(formatThousands(e.target.value));
  };

  const handleAreaFrom = (e) => setAreaFrom(e.target.value.replace(/\D+/g, ""));
  const handleAreaTo = (e) => setAreaTo(e.target.value.replace(/\D+/g, ""));

  const buildQuerySummary = () => {
    const rooms = selectedRooms.length ? selectedRooms.join(", ") : "не выбрано";
    const area = [areaFrom && `от ${areaFrom} м²`, areaTo && `до ${areaTo} м²`]
      .filter(Boolean)
      .join(" ");
    const price = [priceFrom && `от ${priceFrom} ₽`, priceTo && `до ${priceTo} ₽`]
      .filter(Boolean)
      .join(" ");
    const search = queryText || "не указано";
    return `Комнат: ${rooms}; Площадь: ${area || "не указано"}; Цена: ${price || "не указано"}; Поиск: ${search}`;
  };

  const roomOptions = ["C", "1", "2", "3", "4", "5+"]; // можно выбрать несколько

  const toggleRoom = (value) => {
    setSelectedRooms((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const openOfferModal = (projectName) => {
    setOfferPrefill({
      showSummary: true,
      summary: `Оставьте контакт, и мы подробно расскажем про объект ${projectName}`
    });
    setIsOfferModalOpen(true);
  };

  const openFilterModal = () => {
    setFilterPrefill({
      showSummary: true,
      summary: buildQuerySummary()
    });
    setIsFilterModalOpen(true);
  };

  const openIndModal = () => {
    setIndPrefill({});
    setIsIndModalOpen(true);
  };

  const openRequestModal = () => {
    setRequestPrefill({});
    setIsRequestModalOpen(true);
  };

  const isPhoneComplete = (phone) => phone && phone.replace(/\D/g, "").length === 11;
  const isRequestFormValid = requestName.trim().length > 0 && isPhoneComplete(requestPhone);

  const handleRequestSubmit = (event) => {
    event.preventDefault();
    const hasName = requestName.trim().length > 0;
    const phoneValid = isPhoneComplete(requestPhone);
    setRequestErrors({ name: !hasName, phone: !phoneValid });
    if (!hasName || !phoneValid) return;
    // Здесь можно добавить реальную отправку формы
  };

  const handleNameChange = (event) => {
    const value = event.target.value;
    setRequestName(value);
    if (requestErrors.name && value.trim().length > 0) {
      setRequestErrors((prev) => ({ ...prev, name: false }));
    }
  };

  const handlePhoneAccept = (value) => {
    setRequestPhone(value);
    if (requestErrors.phone && isPhoneComplete(value)) {
      setRequestErrors((prev) => ({ ...prev, phone: false }));
    }
  };

  const handleConsentMouseEnter = () => setIsTooltipVisible(true);
  const handleConsentMouseLeave = () => {
    setIsTooltipVisible(false);
    if (!consentRef.current) return;
    const focusedLink = consentRef.current.querySelector("a:focus");
    if (focusedLink && typeof focusedLink.blur === "function") {
      focusedLink.blur();
    }
  };
  const handleConsentFocus = () => setIsTooltipVisible(true);
  const handleConsentBlur = () => setIsTooltipVisible(false);
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
      <Breadcrumbs />
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
        <div className={styles.darkSection}>
          <div className={styles.whiteRectangle}>
            <div className={styles.circleContainer}>
              <div className={styles.circle}></div>
            </div>
            <img src={womanImg} alt="woman" className={styles.womanImage} loading="lazy" decoding="async" />

            <div className={styles.leftTopContent}>
              <h2 className={styles.leftTitle}>Индивидуальное<br />сопровождение</h2>
            </div>
            
            <div className={styles.leftBottomContent}>
              <p className={styles.leftDescription}>
                Ваш комфорт — наша цель<br />
                мы подбираем лучшие варианты<br />
                жилья и обеспечиваем<br />
                обслуживание на высшем уровне
              </p>
            </div>
            
            <button
              className={styles.detailsBtn}
              onClick={openIndModal}
            >
              Подробнее
            </button>

            <div className={styles.container}>
              <div className={styles.buttonRow}>
                <button className={styles.btn}>Рассрочка</button>
                <button className={styles.btn}>Закрытые продажи</button>
              </div>
              <div className={styles.buttonRow}>
                <button className={styles.btn}>Онлайн-показ</button>
                <button className={styles.btn}>Инвестиции</button>
              </div>
              <div className={styles.buttonRow}>
                <button className={styles.btnWide}>Эксклюзив на предстарте</button>
              </div>
            </div>
          </div>
        </div>
      {/* Filter block */}
      <section className={styles.filterWrap}>
        <section className={styles.filterSection}>
        <button className={styles.filterTitleBtn}>ПОДОБРАТЬ НЕДВИЖИМОСТЬ</button>
        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <div className={styles.groupLabel}>Количество комнат</div>
            <div className={styles.segmented}>
              {roomOptions.map((room) => (
                <button
                  key={room}
                  type="button"
                  aria-pressed={selectedRooms.includes(room)}
                  className={
                    selectedRooms.includes(room)
                      ? `${styles.chip} ${styles.chipSelected}`
                      : styles.chip
                  }
                  onClick={() => toggleRoom(room)}
                >
                  {room}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.groupLabel}>Площадь, м²</div>
            <div className={styles.doubleField}>
              <input
                className={styles.inputField}
                name="areaFrom"
                id="filter-area-from"
                placeholder="ОТ"
                inputMode="numeric"
                value={areaFrom}
                onChange={handleAreaFrom}
              />
              <input
                className={styles.inputField}
                name="areaTo"
                id="filter-area-to"
                placeholder="ДО"
                inputMode="numeric"
                value={areaTo}
                onChange={handleAreaTo}
              />
            </div>
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.groupLabel}>Цена, ₽</div>
            <div className={styles.doubleField}>
              <input
                className={styles.inputField}
                name="priceFrom"
                id="filter-price-from"
                placeholder="ОТ"
                inputMode="numeric"
                pattern="[0-9 ]*"
                value={priceFrom}
                onChange={handlePriceFrom}
              />
              <input
                className={styles.inputField}
                name="priceTo"
                id="filter-price-to"
                placeholder="ДО"
                inputMode="numeric"
                pattern="[0-9 ]*"
                value={priceTo}
                onChange={handlePriceTo}
              />
            </div>
          </div>
          <div className={styles.filterGroup}>
            <div className={styles.groupLabel}>Поиск</div>
            <input
              className={styles.inputFieldWide}
              name="filterQuery"
              id="filter-query"
              placeholder="ЖК, РАЙОН, МЕТРО"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
            />
          </div>
          <div className={styles.filterActions}>
            <button
              className={styles.searchBtn}
              type="button"
              onClick={openFilterModal}
            >
              ПОИСК
            </button>
          </div>
        </div>
        </section>
      <CallbackModal
        isOpen={isIndModalOpen}
        onClose={() => setIsIndModalOpen(false)}
        prefill={indPrefill}
      />
      <CallbackModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        prefill={filterPrefill}
      />
      <CallbackModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        prefill={offerPrefill}
      />
      <CallbackModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        prefill={requestPrefill}
      />
      </section>

      {/* About block */}
      <section
        className={styles.aboutSection}
        style={{ backgroundImage: `url(${aboutBack})` }}
        role="img"
        aria-label="О компании"
      >
        <div className={styles.aboutInner}>
          <h2 className={styles.aboutTitle}>О КОМПАНИИ</h2>
          <p className={styles.aboutText}>
            С <span className={styles.gold}>2023</span> года мы помогаем клиентам
            приобретать<br /> элитную недвижимость в Москве —
            <span className={styles.gold}> без скрытых<br /> комиссий</span> и с полной
            прозрачностью условий. Личный<br /> брокер, на связи 24/7, открывает доступ
            к лучшим<br /> объектам и закрытым продажам, а также помогает<br /> получить
            <span className={styles.gold}> наилучшую цену</span> от застройщика
          </p>
          <p className={styles.aboutTextMobile}>
            С <span className={styles.gold}>2023</span> года помогаем покупать элитную недвижимость в Москве <span className={styles.gold}>без скрытых комиссий</span>.
            Личный брокер, на связи 24/7, доступ к закрытым продажам и помощь в получении <span className={styles.gold}>
            наилучшей цены</span> от застройщика
          </p>
        </div>
      </section>

      {/* CTA banner */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerText}>ОСТАВЬТЕ СВОИ КОНТАКТЫ, И БРОКЕР FLATCHER СВЯЖЕТСЯ<br /> С ВАМИ, ЧТОБЫ ПОМОЧЬ В ПОДБОРЕ НЕДВИЖИМОСТИ</div>
        <div className={styles.ctaBannerTextMobile}>Оставьте свои контакты, и брокер Flatcher ПОМОЖЕТ ВАМ</div>
        <button
          type="button"
          className={styles.ctaBannerBtn}
          onClick={openRequestModal}
        >
          ОСТАВИТЬ ЗАЯВКУ
        </button>
      </section>

      {/* Offers section */}
      <section className={styles.offersSection} aria-label="Лучшие предложения">
        <h2 className={styles.offersTitle}>ЛУЧШИЕ ПРЕДЛОЖЕНИЯ</h2>
        <div className={styles.offersGrid}>
          {/* 1. ЖК Мира */}
          <article className={styles.offerCard}>
            <div className={styles.offerContent}>
              <div className={styles.offerHeadline}><span className={styles.offerPrefix}>ЖК</span>&nbsp;<span className={styles.gold}>МИРА</span></div>
              <div className={styles.offerSub}>КВАРТИРЫ ОТ 18 080 000 ₽ ОТ 18 М²</div>
              <button type="button" className={styles.offerBtn} onClick={() => openOfferModal('ЖК Mira')}>ПОДРОБНЕЕ</button>
            </div>
            <div className={styles.offerMediaRight}>
              <img src={miraImg} alt="ЖК Мира" loading="lazy" decoding="async" />
            </div>
          </article>

          {/* 2. ONE TOWER */}
          <article className={`${styles.offerCard} ${styles.offerCardDark}`}>
            <div className={styles.offerContentDark}>
              <div className={styles.offerHeadline}>ONE TOWER</div>
              <div className={styles.offerSub}>КВАРТИРЫ ОТ<br/>48 860 000 ₽</div>
              <button type="button" className={`${styles.offerBtn} ${styles.offerBtnDark}`} onClick={() => openOfferModal('One tower')}>ПОДРОБНЕЕ</button>
            </div>
            <div className={styles.offerMediaRight}>
              <img src={oneImg} alt="ONE TOWER" loading="lazy" decoding="async" />
            </div>
          </article>

          {/* 3. ЖК Дом Франка */}
          <article className={styles.offerCard}>
            <div className={styles.offerMedia}>
              <img src={domFrankaImg} alt="ЖК Дом Франка" loading="lazy" decoding="async" />
            </div>
            <div className={styles.offerContent}>
              <div className={styles.offerHeadline}><span className={styles.offerPrefix}>ЖК</span>&nbsp;<span className={styles.gold}>ДОМ</span><br/><span className={styles.gold}>ФРАНКА</span></div>
              <div className={styles.offerSub}>КВАРТИРЫ ОТ<br/>106 820 000 ₽</div>
              <button type="button" className={styles.offerBtn} onClick={() => openOfferModal('ЖК Дом Франка')}>ПОДРОБНЕЕ</button>
            </div>
          </article>

          {/* 4. Кутузов Сити ЖК */}
          <article className={styles.offerCard}>
            <div className={styles.offerContent}>
              <div className={styles.offerHeadline}><span className={styles.gold}>КУТУЗОВ</span><br/>СИТИ <span className={styles.black}>ЖК</span></div>
              <div className={styles.offerSub}>КВАРТИРЫ ОТ 18 МЛН<br/>ОТ 30 М²</div>
              <button type="button" className={styles.offerBtn} onClick={() => openOfferModal('ЖК Кутузов Сити')}>ПОДРОБНЕЕ</button>
            </div>
            <div className={styles.offerMediaRight}>
              <img src={kutuzovSityImg} alt="Кутузов Сити ЖК" loading="lazy" decoding="async" />
            </div>
          </article>
        </div>
      </section>

      {/* Request CTA block */}
      <section className={styles.requestSection}>
        <div
          className={styles.requestOverlay}
          style={{ backgroundImage: `url(${backgroundImg})` }}
        />
        <div className={styles.requestGlass} />
        <div className={styles.requestBottom} />
        <div className={styles.requestInner}
          role="form"
          aria-labelledby="request-title"
        >
          <h2 id="request-title" className={styles.requestTitle}>Оставить заявку</h2>
          <form className={styles.requestForm} onSubmit={handleRequestSubmit} noValidate>
            <input
              className={`${styles.requestInput} ${requestErrors.name ? styles.inputError : ""}`}
              type="text"
              name="requestName"
              id="request-name"
              placeholder="Ваше имя"
              aria-label="Ваше имя"
              value={requestName}
              onChange={handleNameChange}
            />
            {requestErrors.name && (
              <span className={styles.requestError} role="alert">Укажите имя</span>
            )}
            <div className={styles.requestRow}>
              <PhoneInput
                className={`${styles.requestInput} ${requestErrors.phone ? styles.inputError : ""}`}
                name="requestPhone"
                id="request-phone"
                aria-label="Телефон"
                value={requestPhone}
                onAccept={(value) => {
                  setRequestPhone(value);
                }}
                onComplete={(value) => {
                  setRequestPhone(value);
                  if (isPhoneComplete(value)) {
                    setRequestErrors((prev) => ({ ...prev, phone: false }));
                  }
                }}
                onBlur={() => {
                  if (isPhoneComplete(requestPhone)) {
                    setRequestErrors((prev) => ({ ...prev, phone: false }));
                  } else {
                    setRequestErrors((prev) => ({ ...prev, phone: true }));
                  }
                }}
                inputMode="tel"
                autoComplete="tel"
              />
              <input className={styles.requestInput} type="email" name="requestEmail" id="request-email" placeholder="E-mail" aria-label="E-mail" />
            </div>
            {requestErrors.phone && (
              <span className={styles.requestError} role="alert">Укажите телефон полностью</span>
            )}
            <button
              type="submit"
              className={`${styles.requestSubmit} ${!isRequestFormValid ? styles.requestSubmitDisabled : ""}`}
              disabled={!isRequestFormValid}
            >
              Отправить заявку
            </button>
          </form>
          <p className={styles.requestPolicy}>
            Отправляя заявку, вы даёте своё{" "}
            <span
              className={styles.requestConsent}
              ref={consentRef}
              onMouseEnter={handleConsentMouseEnter}
              onMouseLeave={handleConsentMouseLeave}
              onFocus={handleConsentFocus}
              onBlur={handleConsentBlur}
              data-visible={isTooltipVisible}
            >
              <span className={styles.requestConsentText}>согласие</span>
              <span className={styles.requestTooltip} role="tooltip">
                Я полностью ознакомился и согласен с <a href="/user-agreement" target="_blank">Пользовательским соглашением</a>, <a href="/data-processing" target="_blank">Политикой обработки персональных данных и файлов Cookie</a>, и предоставляю конкретное, предметное, информированное, сознательное и однозначное <a href="/consent" target="_blank">Согласие на обработку моих персональных данных</a>.
              </span>
            </span>{" "}
            на обработку персональных данных.
          </p>
          <div className={styles.requestContacts}>
            <span>Или напишите нам в</span>
            <div className={styles.requestIcons}>
              <a href="https://wa.me/74950322199" className={styles.requestIconBtn} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
                <img src={whatsappIcon} alt="WhatsApp" className={styles.whatsappIcon} />
              </a>
              <span>или</span>
              <a href="https://t.me/FlatcherEstateBot" className={styles.requestIconBtn} aria-label="Telegram" target="_blank" rel="noopener noreferrer">
                <img src={telegramIcon} alt="Telegram" className={styles.telegramIcon} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
