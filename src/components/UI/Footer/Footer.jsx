import React, { useState } from 'react';
import styles from './Footer.module.css';

import flatcherFooter from '../../../../assets/svg/flatcher-foter.svg';
import flatcherFooterMobile from '../../../../assets/img/flathcer-mobile-foter.png';
import whatsappIcon from '../../../../assets/svg/whatsapp-icon.svg';
import telegramIcon from '../../../../assets/svg/telegram-icons.svg';
import CallbackModal from '../CallbackModal/CallbackModal';

export default function Footer() {
  const year = new Date().getFullYear();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCtaClick = (event) => {
    event.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.bgWrap} aria-hidden="true">
        <img src={flatcherFooter} alt="" className={styles.bgImageBase} loading="lazy" decoding="async" />
        <img src={flatcherFooter} alt="" className={styles.bgImageBlur} loading="lazy" decoding="async" />
        <div className={styles.bgShade} />
      </div>

      <div className={styles.content}>
        <div className={styles.mobileHero}>
          <img
            src={flatcherFooterMobile}
            alt="Flatcher"
            className={styles.mobileLogo}
            loading="lazy"
            decoding="async"
          />
          <a className={styles.mobilePhone} href="tel:+74950322199">+7 (495) 032-21-99</a>
          <button type="button" className={styles.mobileCallBtn} onClick={handleCtaClick}>Заказать звонок</button>
          <div className={styles.mobileSocials}>
            <a href="https://wa.me/74950322199" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <img src={whatsappIcon} alt="WhatsApp" loading="lazy" decoding="async" className={`${styles.whatsappIcon} ${styles.mobileIcon}`} />
            </a>
            <a href="https://t.me/FlatcherEstateBot" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <img src={telegramIcon} alt="Telegram" loading="lazy" decoding="async" className={`${styles.telegramIcon} ${styles.mobileIcon}`} />
            </a>
          </div>
        </div>

        <div className={styles.primaryRow}>
          <nav className={styles.links} aria-label="Footer navigation">
            <ul className={styles.linkCol}>
              <li><a href="/company">О компании</a></li>
              <li><a href="/contacts">Контакты</a></li>
              <li><a href="/company#team">Команда</a></li>
            </ul>
            <ul className={styles.linkCol}>
              <li><a href="/flats">Новостройки</a></li>
              <li><a href="/services">Услуги</a></li>
            </ul>
          </nav>

          <div className={styles.phoneBlock}>
            <a className={styles.phone} href="tel:+74950322199">+7 (495) 032-21-99</a>
            <button type="button" className={styles.callBtn} onClick={handleCtaClick}>ЗАКАЗАТЬ ЗВОНОК</button>
            <div className={styles.socials}>
              <a href="https://wa.me/74950322199" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <img src={whatsappIcon} alt="WhatsApp" loading="lazy" decoding="async" className={styles.whatsappIcon} />
              </a>
              <a href="https://t.me/FlatcherEstateBot" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <img src={telegramIcon} alt="Telegram" loading="lazy" decoding="async" className={styles.telegramIcon} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p className={styles.disclaimer}>
          Сайт носит исключительно информационный характер и ни при каких условиях не является публичной офертой, определяемой положениями пункта 2 статьи 437 Гражданского кодекса Российской Федерации. Использование сайта означает согласие с&nbsp;
          <a href="/user-agreement" target="_blank">Пользовательским соглашением</a>
          ,&nbsp;
          <a href="/data-processing" target="_blank">Политикой обработки персональных данных и файлов Cookie</a>
          &nbsp;и&nbsp;
          <a href="/consent" target="_blank">Согласием на обработку персональных данных</a>.
        </p>
        <div className={styles.copyright}>©FLATCHER, {year}</div>
      </div>

      <CallbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prefill={{
          source: 'footer_cta',
          summary: 'Заказ звонка из футера',
          section: 'footer',
          id: 'footer-call-to-action'
        }}
      />
    </footer>
  );
}


