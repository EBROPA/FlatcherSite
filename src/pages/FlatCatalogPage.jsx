import React from "react";
import { useSearchParams } from "react-router-dom";
import Wrapper from "../components/UI/Wrapper/Wrapper";
import Pagination from "../components/UI/Pagination/Pagination";
import classes from "../components/UI/Wrapper/Wrapper.module.css";
import image from "../../assets/img/sav27.jpg";

function FlatCatalogPage() {
  const [searchParams] = useSearchParams();
  const pageFromURL = parseInt(searchParams.get("page")) || 1;

  const itemsPerPage = 18;

  const realEstateData = Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    title: `ЖК Example #${i + 1}`,
    price: `${(Math.random() * 100).toFixed(2)} млн ₽`,
    location: "Москва",
    image,
  }));

  const totalPages = Math.ceil(realEstateData.length / itemsPerPage);
  const currentItems = realEstateData.slice(
    (pageFromURL - 1) * itemsPerPage,
    pageFromURL * itemsPerPage
  );

  return (
    <>
      <Wrapper
        items={currentItems}
        renderItem={(item) => (
          <div className="card" key={item.id}>
            <img src={item.image} alt={item.title} className={classes.cardImage} loading="lazy" decoding="async" />
            <div className={classes.cardInfo}>
              <h3>{item.title}</h3>
              <p>{item.location}</p>
              <strong>{item.price}</strong>
            </div>
          </div>
        )}
      />
      <Pagination currentPage={pageFromURL} totalPages={totalPages} />
    </>
  );
}

export default FlatCatalogPage;
