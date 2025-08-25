import React from 'react';
import style from "./pageCSS/CompanyPage.module.css";
import logo from "@assets/img/flatcher-icon.jpg";

function CompanyPage() {
  return (
    <div className={style.container}>
      {/* Hero Section */}
      <div className={style.hero}>
        <div className={style.heroContent}>
          <div className={style.logoSection}>
            <img src={logo} alt="FLATCHER" className={style.logo} />
          </div>
          <h1 className={style.heroTitle}>О компании FLATCHER</h1>
          <p className={style.heroSubtitle}>
            Ваш надежный партнер в мире элитной недвижимости Москвы
          </p>
        </div>
      </div>

      {/* About Section */}
      <section className={style.section}>
        <div className={style.sectionContent}>
          <h2 className={style.sectionTitle}>Кто мы</h2>
          <div className={style.aboutGrid}>
            <div className={style.aboutCard}>
              <div className={style.cardIcon}>🏢</div>
              <h3 className={style.cardTitle}>Экспертиза</h3>
              <p className={style.cardText}>
                Более 10 лет опыта работы с элитной недвижимостью в Москве. 
                Мы знаем каждый район, каждую улицу и каждый дом.
              </p>
            </div>
            <div className={style.aboutCard}>
              <div className={style.cardIcon}>🎯</div>
              <h3 className={style.cardTitle}>Специализация</h3>
              <p className={style.cardText}>
                Фокусируемся исключительно на премиум-сегменте: 
                элитные квартиры, офисы и коммерческая недвижимость.
              </p>
            </div>
            <div className={style.aboutCard}>
              <div className={style.cardIcon}>🤝</div>
              <h3 className={style.cardTitle}>Индивидуальный подход</h3>
              <p className={style.cardText}>
                Каждый клиент получает персонального менеджера и 
                индивидуальную стратегию поиска недвижимости.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={style.section}>
        <div className={style.sectionContent}>
          <h2 className={style.sectionTitle}>Наши услуги</h2>
          <div className={style.servicesList}>
            <div className={style.serviceItem}>
              <h3 className={style.serviceTitle}>Подбор элитных квартир</h3>
              <p className={style.serviceDescription}>
                Поиск и подбор квартир премиум-класса в лучших районах Москвы. 
                От студий до пентхаусов с видом на город.
              </p>
            </div>
            <div className={style.serviceItem}>
              <h3 className={style.serviceTitle}>Коммерческая недвижимость</h3>
              <p className={style.serviceDescription}>
                Офисы, торговые помещения и другие коммерческие объекты 
                в престижных локациях столицы.
              </p>
            </div>
            <div className={style.serviceItem}>
              <h3 className={style.serviceTitle}>Новостройки</h3>
              <p className={style.serviceDescription}>
                Доступ к закрытым продажам и эксклюзивным предложениям 
                от ведущих застройщиков Москвы.
              </p>
            </div>
            <div className={style.serviceItem}>
              <h3 className={style.serviceTitle}>Консультации</h3>
              <p className={style.serviceDescription}>
                Профессиональные консультации по вопросам инвестиций 
                в недвижимость и рыночной аналитике.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={style.section}>
        <div className={style.sectionContent}>
          <h2 className={style.sectionTitle}>Наши ценности</h2>
          <div className={style.valuesGrid}>
            <div className={style.valueItem}>
              <h3 className={style.valueTitle}>Честность</h3>
              <p className={style.valueText}>
                Полная прозрачность в работе с клиентами. 
                Никаких скрытых комиссий и неожиданных сюрпризов.
              </p>
            </div>
            <div className={style.valueItem}>
              <h3 className={style.valueTitle}>Профессионализм</h3>
              <p className={style.valueText}>
                Команда экспертов с глубоким знанием рынка 
                и многолетним опытом работы в сфере недвижимости.
              </p>
            </div>
            <div className={style.valueItem}>
              <h3 className={style.valueTitle}>Результат</h3>
              <p className={style.valueText}>
                Мы не просто показываем объекты, мы находим 
                именно то, что нужно нашим клиентам.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className={style.ctaSection}>
        <div className={style.ctaContent}>
          <h2 className={style.ctaTitle}>Готовы найти свою идеальную недвижимость?</h2>
          <p className={style.ctaText}>
            Свяжитесь с нами, и мы поможем воплотить ваши мечты в реальность
          </p>
          <div className={style.ctaButtons}>
            <a href="tel:+79771740179" className={style.ctaButton}>
              Позвонить
            </a>
            <a href="/contacts" className={style.ctaButtonSecondary}>
              Написать
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CompanyPage;
