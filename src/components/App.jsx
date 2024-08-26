import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import Homepage from "./Homepage";
import Footer from "./Footer";
import Product from "./Product";

import "../styles/App.scss";

import SharedDataContext from "../util/sharedDataContext";
import { supabase } from "../util/supabase";

import Cookies from "js-cookie";

export default function App() {
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("phones");
  const [language, setLanguage] = useState("sk");
  const [translations, setTranslations] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [addedToCart, setAddedToCart] = useState([]);

  async function fetchTranslations() {
    try {
      const response = await fetch("../languages.json");
      const data = await response.json();
      setTranslations(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching translations:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTranslations();
  }, [language]);

  function getTranslation(root) {
    if (!translations || !root) {
      return "";
    }

    const keys = root.split(".");
    let currentTranslation = translations[language];

    for (const key of keys) {
      if (currentTranslation[key]) {
        currentTranslation = currentTranslation[key];
      } else {
        return "";
      }
    }

    return currentTranslation;
  }

  const sharedData = {
    supabase,
    activeCategory,
    setActiveCategory,
    language,
    setLanguage,
    translations,
    setTranslations,
    favorites,
    setFavorites,
    addedToCart,
    setAddedToCart,
    getTranslation,
  };

  useEffect(() => {
    const favoritesFromCookies = Cookies.get("favorites");
    if (favoritesFromCookies) setFavorites(JSON.parse(favoritesFromCookies));

    const addedToCartFromCookies = Cookies.get("addedToCart");
    if (addedToCartFromCookies)
      setAddedToCart(JSON.parse(addedToCartFromCookies));
  }, []);

  if (loading) return <p>Loading</p>;

  return (
    <SharedDataContext.Provider value={sharedData}>
      <div className="app">
        <div className="main-content">
          <header>
            <Navbar />
          </header>

          <main className="content">
            <Routes>
              <Route index path="/" element={<Homepage />} />
              <Route path="/products/:id" element={<Product />} />
            </Routes>
          </main>
        </div>

        <Footer />
      </div>
    </SharedDataContext.Provider>
  );
}
