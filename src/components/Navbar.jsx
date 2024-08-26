import React, { useContext, useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { HoverIconEffect, Modal } from "../util/functions";

import { Icon } from "@iconify/react";

// styles & assets
import "../styles/Navbar.scss";
import Logo from "/logo.png";

import SharedDataContext from "../util/sharedDataContext";

export default function Navbar({}) {
  const data = useContext(SharedDataContext);
  const activeCategory = data.activeCategory;
  const setActiveCategory = data.setActiveCategory;
  const getTranslation = data.getTranslation;
  const favorites = data.favorites;
  const addedToCart = data.addedToCart;
  const supabase = data.supabase;

  const controls = useAnimation();
  const location = useLocation();

  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);

  const variants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
    visibleDefault: { opacity: 1, x: 0 },
  };

  useEffect(() => {
    if (activeCategory === "phones") controls.start("visibleDefault");
    else controls.start("hidden");
  }, [activeCategory, controls, location.pathname]);

  useEffect(() => {
    getFavoriteProducts();
  }, [favorites]);

  async function getFavoriteProducts() {
    let { data: products, error } = await supabase
      .from("products")
      .select("*")
      .in("id", favorites);

    if (!error) setFavoriteProducts(products);
  }

  useEffect(() => {
    getCartProducts();
  }, [addedToCart]);

  async function getCartProducts() {
    let { data: products, error } = await supabase
      .from("products")
      .select("*")
      .in("id", addedToCart);

    if (!error) setCartProducts(products);
  }

  async function animateItem() {
    await controls.start("hidden");
    controls.start("visible");
  }

  const restrictedPaths = ["/profile", "/dashboard", "/products"];

  return (
    <nav className="navbar">
      <div className="navbar--discount">
        <span
          dangerouslySetInnerHTML={{ __html: getTranslation("discount") }}
        />
      </div>

      <div className="container">
        <div className="container--left">
          <Link to="/" onClick={() => setActiveCategory("phones")}>
            <img className="container--left_logo" src={Logo} alt="Pear Logo" />
          </Link>

          {!restrictedPaths.some((path) =>
            location.pathname.startsWith(path)
          ) ? (
            <ul className="container--left_list">
              <li className="container--left_list-item">
                <button
                  onClick={() => {
                    setActiveCategory("phones");
                    animateItem();
                  }}
                >
                  <Icon
                    icon="tabler:device-mobile"
                    className="container--left_list-item-icon"
                  />
                  {getTranslation("navbar.phones")}
                </button>

                {activeCategory === "phones" && (
                  <motion.div
                    className="container--left_list-item-active"
                    variants={variants}
                    initial="hidden"
                    animate={controls}
                  />
                )}
              </li>
              <li className="container--left_list-item">
                <button
                  onClick={() => {
                    setActiveCategory("tablets");
                    animateItem();
                  }}
                >
                  <Icon
                    icon="tabler:device-tablet"
                    className="container--left_list-item-icon"
                  />
                  {getTranslation("navbar.tablets")}
                </button>

                {activeCategory === "tablets" && (
                  <motion.div
                    className="container--left_list-item-active"
                    variants={variants}
                    initial="hidden"
                    animate={controls}
                  />
                )}
              </li>
              <li className="container--left_list-item">
                <button
                  onClick={() => {
                    setActiveCategory("watches");
                    animateItem();
                  }}
                >
                  <Icon
                    icon="tabler:device-watch"
                    className="container--left_list-item-icon"
                  />
                  {getTranslation("navbar.watches")}
                </button>

                {activeCategory === "watches" && (
                  <motion.div
                    className="container--left_list-item-active"
                    variants={variants}
                    initial="hidden"
                    animate={controls}
                  />
                )}
              </li>
            </ul>
          ) : (
            <ul className="container--left_list">
              <li className="container--left_list-item">
                <Link
                  className="button"
                  to="/"
                  onClick={() => setActiveCategory("phones")}
                >
                  <Icon icon="tabler:home" />
                  Domov
                </Link>
              </li>
            </ul>
          )}
        </div>

        <ul className="container--right">
          <li className="container--right_item">
            <Modal
              out={
                <Icon
                  icon="tabler:heart"
                  className="container--right_item-icon"
                />
              }
            >
              <ListOfItems
                items={favoriteProducts}
                message="Žiadne obľúbené produkty."
              />
            </Modal>
          </li>
          <li className="container--right_item">
            <Modal
              out={
                <Icon
                  icon="tabler:shopping-cart"
                  className="container--right_item-icon"
                />
              }
            >
              <ListOfItems
                items={cartProducts}
                message="Žiadne produkty v košíku."
                cart={true}
              />
            </Modal>
          </li>
          <li className="container--right_item">
            <HoverIconEffect
              root="/profile"
              iconOutline={
                <Icon
                  icon="tabler:user"
                  className="container--right_item-icon"
                />
              }
              iconSolid={
                <Icon
                  icon="tabler:user-filled"
                  className="container--right_item-icon"
                />
              }
            />
          </li>
        </ul>
      </div>

      <div className="divider" />
    </nav>
  );
}

function ListOfItems({ items, message, cart = false }) {
  const cartItemsExist = items && items.length > 0;

  return (
    <div className="container--right_item-products">
      {cartItemsExist ? (
        items.map((product, id) => {
          return (
            <a
              className="container--right_item-products-product"
              href={`/products/${product.id}`}
              key={id}
            >
              <img src={product.image} alt="Product Image" />
              <div className="container--right_item-products-product-info">
                <span className="container--right_item-products-product-info-name">
                  {product.name}
                </span>

                <span className="container--right_item-products-product-info-price">
                  {product.price}€
                </span>
              </div>
            </a>
          );
        })
      ) : (
        <span>{message}</span>
      )}

      {cartItemsExist && cart && (
        <>
          <div className="divider" />

          <div className="flex justify-between">
            <span>
              <strong>Celkovo</strong>
            </span>
            <span>{items.reduce((total, item) => total + item.price, 0)}€</span>
          </div>

          <button className="container--right_item-products-button">
            <Icon icon="tabler:shopping-cart" />
            Prejsť do košíka
          </button>
        </>
      )}
    </div>
  );
}
