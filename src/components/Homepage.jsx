import React, { useContext, useEffect, useState } from "react";

import "../styles/Homepage.scss";

import SharedDataContext from "../util/sharedDataContext";

import { Link } from "react-router-dom";

import { Icon } from "@iconify/react";

import Cookies from "js-cookie";

import { CartButton } from "../util/functions";

export default function Homepage({}) {
  const data = useContext(SharedDataContext);
  const supabase = data.supabase;
  const activeCategory = data.activeCategory;
  const getTranslation = data.getTranslation;
  const favorites = data.favorites;
  const setFavorites = data.setFavorites;

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  async function fetchProducts() {
    try {
      let { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", activeCategory);

      if (!error) {
        setProducts(products);
        setProductsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  const handleToggleFavorites = (productId) => {
    let updatedFavorites;

    if (favorites.includes(productId))
      updatedFavorites = favorites.filter((id) => id !== productId);
    else updatedFavorites = [...favorites, productId];

    setFavorites(updatedFavorites);
    Cookies.set("favorites", JSON.stringify(updatedFavorites), { expires: 7 });
  };

  return (
    <div className="homepage container">
      <section className="products">
        <h2 className="products--heading">
          {getTranslation("home.products.header")}
        </h2>

        {!productsLoading ? (
          products.length > 0 ? (
            <ul className="products--list">
              {products.map((product) => (
                <li key={product.id} className="products--list_item">
                  <button
                    className="products--list_item-favourite"
                    onClick={() => handleToggleFavorites(product.id)}
                  >
                    {favorites.includes(product.id) ? (
                      <Icon
                        className="products--list_item-favourite-icon"
                        icon="tabler:heart-filled"
                      />
                    ) : (
                      <Icon
                        className="products--list_item-favourite-icon"
                        icon="tabler:heart"
                      />
                    )}
                  </button>

                  <Link to={`products/${product.id}`}>
                    {product.recommended && (
                      <span className="products--list_item-recommended">
                        <Icon
                          icon="tabler:star-filled"
                          className="products--list_item-recommended-icon"
                        />{" "}
                        {getTranslation("home.products.recommended")}
                      </span>
                    )}
                    <img
                      className="products--list_item-image"
                      src={product.image}
                      alt="Product Image"
                    />
                    <span className="products--list_item-name">
                      {product.name}
                    </span>
                    <span className="products--list_item-price">
                      {product.price}€{" "}
                      <span className="products--list_item-price-stock">
                        ({product.in_stock}{" "}
                        {getTranslation("home.products.in_stock")})
                      </span>
                    </span>
                  </Link>

                  <CartButton product={product} />
                </li>
              ))}
            </ul>
          ) : (
            <h1>
              Momentálne sa v tejto kategórii nenachádzajú žiadne produkty.
            </h1>
          )
        ) : (
          <h1>Loading...</h1>
        )}
      </section>
    </div>
  );
}
