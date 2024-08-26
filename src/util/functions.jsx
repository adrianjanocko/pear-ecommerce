import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import "../styles/functions.scss";

import SharedDataContext from "./sharedDataContext";

import { Icon } from "@iconify/react";

import Cookies from "js-cookie";

export function HoverIconEffect({ root, iconOutline, iconSolid }) {
  const location = useLocation();
  const [isHovering, setIsHovering] = useState(false);

  const variants = {
    hover: { scale: 1.1, opacity: 1 },
    initial: { scale: 1, opacity: 1 },
  };

  return (
    <motion.div
      variants={variants}
      animate={isHovering ? "hover" : "initial"}
      initial="initial"
      whileHover="hover"
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <Link to={root}>
        {isHovering || location.pathname === root ? iconSolid : iconOutline}
      </Link>
    </motion.div>
  );
}

export function Modal({ out, children }) {
  const [modalOpened, setModalOpened] = useState(false);

  const variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="modal">
      <button
        onMouseOver={() => setModalOpened(true)}
        onMouseOut={() => setModalOpened(false)}
        className="modal--out"
      >
        {out}
      </button>
      <motion.div
        onMouseOver={() => setModalOpened(true)}
        onMouseOut={() => setModalOpened(false)}
        className="modal--modal"
        variants={variants}
        initial="hidden"
        animate={modalOpened ? "visible" : "hidden"}
        style={{
          pointerEvents: modalOpened ? "all" : "none",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function CartButton({ product }) {
  const context = useContext(SharedDataContext);
  const addedToCart = context.addedToCart;
  const setAddedToCart = context.setAddedToCart;

  const handleAddToCart = (productId) => {
    let updatedAddedToCart;

    if (addedToCart.includes(productId))
      updatedAddedToCart = addedToCart.filter((id) => id !== productId);
    else updatedAddedToCart = [...addedToCart, productId];

    setAddedToCart(updatedAddedToCart);
    Cookies.set("addedToCart", JSON.stringify(updatedAddedToCart), {
      expires: 7,
    });
  };

  return (
    <button
      className={
        "cart-button" + (addedToCart.includes(product.id) ? " green" : "")
      }
      onClick={() => handleAddToCart(product.id)}
    >
      <Icon icon="tabler:shopping-cart" />
      {addedToCart.includes(product.id) ? "V košíku" : "Do košíka"}
    </button>
  );
}
