import React, { useContext } from "react";
import { Link } from "react-router-dom";
import iso from "iso-639-1";
import "../styles/Footer.scss";
import Logo from "/logo.png";

import { Icon } from "@iconify/react";

import SharedDataContext from "../util/sharedDataContext";

import { Modal } from "../util/functions";

export default function Footer({}) {
  const data = useContext(SharedDataContext);
  const language = data.language;
  const setLanguage = data.setLanguage;
  const translations = data.translations;
  const getTranslation = data.getTranslation;

  function capitalizeFirstLetter(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  return (
    <>
      <div className="divider" />
      <footer className="footer container">
        <div className="footer--left">
          <div className="footer--left_flex">
            <Link to="/">
              <img
                className="footer--left_flex-logo"
                src={Logo}
                alt="Pear Logo"
              />
            </Link>
            {language && (
              <Modal
                className="footer--left_flex-language"
                out={
                  <>
                    <Icon
                      icon="tabler:language"
                      className="footer--left_flex-language-icon"
                    />{" "}
                    {capitalizeFirstLetter(iso.getNativeName(language))}
                  </>
                }
              >
                <ul>
                  {Object.keys(translations).map((key) => (
                    <li key={key}>
                      <button
                        className={`${
                          language === key
                            ? "footer--left_flex-language-active"
                            : ""
                        }`}
                        onClick={() => setLanguage(key)}
                      >
                        {capitalizeFirstLetter(iso.getNativeName(key))}
                      </button>
                    </li>
                  ))}
                </ul>
              </Modal>
            )}
          </div>
          <p className="footer--left_description">
            {getTranslation("footer.description")}
          </p>
          <span className="footer--left_copyright">
            &copy; {new Date().getFullYear()} Pear.com
          </span>
        </div>
        <div className="footer--right">
          <div>
            <span className="footer--right_header">
              <strong>
                {getTranslation("footer.subpages.socials.header")}
              </strong>
            </span>
            <ul className="footer--right_items">
              <li className="footer--right_items-item">
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="tabler:arrow-badge-right-filled" />
                  Facebook
                </a>
              </li>
              <li className="footer--right_items-item">
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon="tabler:arrow-badge-right-filled" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
