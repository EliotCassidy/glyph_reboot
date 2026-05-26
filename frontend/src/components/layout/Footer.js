import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import MPILogo from "../../assets/MPI_logo.svg";
import PSLScriptaLogo from "../../assets/PSL_Scripta_logo.png";
import TwitterLogo from "../../assets/twitter.svg";
import { AuthContext } from "../../AuthContext";
import LanguageSelector from "./LanguageSelector";
import SignedinLinks from "./SignedinLinks";
import SignedoutLinks from "./SignedoutLinks";

const Footer = () => {
  const { authenticated } = useContext(AuthContext);

  const { t } = useTranslation();
  return (
    <footer>
      <div className="text-white py-4 sm:py-8 bg-primary">
        <div className="container mx-auto px-4">
          <div className="justify-between flex flex-col md:flex-row items-center">
            <a
              href="https://www.shh.mpg.de/94549/themintgroup"
              target="_blank"
              rel="noreferrer"
              className="flex items-center mr-8 justify-start"
            >
              <img
                className="my-2 sm:my-4 "
                src={MPILogo}
                alt="Max Plank Logo"
                width="500"
              />
            </a>
            <a
              href="https://scripta.psl.eu/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-start"
            >
              <img
                src={PSLScriptaLogo}
                className="my-2 sm:my-4"
                alt="PSL Scripta logo"
                height="65"
              />
            </a>
          </div>
          <div className="mr-4 my-4">
            {authenticated ? <SignedinLinks /> : <SignedoutLinks />}
          </div>
          <div className="my-8">
            <a
              href="https://twitter.com/GlyphMPI"
              target="_blank"
              rel="noreferrer"
              className="flex hover:underline text-white font-bold"
            >
              {/* eslint-disable i18next/no-literal-string */}
              @GlyphMPI
              {/* eslint-enable */}{" "}
              <img className="mx-4" src={TwitterLogo} alt="twitter logo" />
            </a>
          </div>
          <div className="my-4">
            <p>{t("Questions?")}</p>
            <p>
              {t("Email us at")}{" "}
              <a
                className="text-white font-bold hover:underline"
                href="mailto:glyph@shh.mpg.de"
              >
                {/* eslint-disable i18next/no-literal-string */}
                glyph@shh.mpg.de
                {/* eslint-enable */}
              </a>
            </p>
          </div>
          <div className="my-4">
            <LanguageSelector isFooter />
          </div>
          <div className="flex md:justify-end flex-col md:flex-row">
            <div className="mr-4">
              <Link
                className="text-white  hover:underline"
                to="/data-privacy-statement"
              >
                {t("Data privacy statement")}
              </Link>
            </div>
            <div>
              <Link
                className="text-white  hover:underline"
                to="/terms-and-conditions"
              >
                {t("Terms and Conditions")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
