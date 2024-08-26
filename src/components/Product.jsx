import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import SharedDataContext from "../util/sharedDataContext";
import { CartButton } from "../util/functions";

import "../styles/Product.scss";

function Product() {
  const context = useContext(SharedDataContext);
  const supabase = context.supabase;
  const getTranslation = context.getTranslation;

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getProduct() {
    let { data: products, error } = await supabase
      .from("products")
      .select()
      .eq("id", id);

    if (!error) {
      setProduct(products[0]);
      setLoading(false);
    }
  }

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="container">
      {loading ? (
        <p>Loading..</p>
      ) : (
        <>
          {product ? (
            <div className="product">
              <img src={product.image} alt="Product Image" />
              <div className="product--info">
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <span>
                  <strong>{product.price}€</strong>{" "}
                  <span>
                    ({product.in_stock}{" "}
                    {getTranslation("home.products.in_stock")})
                  </span>
                </span>
                <CartButton product={product} />
              </div>
            </div>
          ) : (
            <p>Tento produkt neexistuje.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Product;
