import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import CNRSLogo from "../../assets/CNRS_logo.svg";
import MPILogo from "../../assets/MPI_logo.svg";
import PSLCultureLabLogo from "../../assets/PSL_CultureLab_logo.svg";
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
          <div className="grid w-full grid-cols-[auto_auto_1fr] items-start gap-x-8 overflow-hidden">
            <div className="flex items-center gap-4">
              <a
                href="https://www.cnrs.fr/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center"
              >
                <img
                  className="block h-20 w-auto object-contain md:h-24"
                  src={CNRSLogo}
                  alt="CNRS logo"
                />
              </a>

              <a
                href="https://www.mpg.de/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center"
              >
                <img
                  className="block h-20 w-auto object-contain md:h-24"
                  src={MPILogo}
                  alt="Max Planck Society logo"
                />
              </a>
            </div>

            <div />

            <div className="flex justify-end pr-0 md:pr-4 -mt-10 md:-mt-16">
              <a
                href="https://psl.eu/"
                target="_blank"
                rel="noreferrer"
                className="flex items-start justify-end"
              >
                <img
                  src={PSLCultureLabLogo}
                  className="block h-56 w-auto object-contain object-top md:h-64"
                  alt="PSL CultureLab logo"
                />
              </a>
            </div>
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
              {t("Email us at")} {" "}
              <a
                className="text-white font-bold hover:underline"
                href="mailto:glyph.science@proton.me"
              >
                {/* eslint-disable i18next/no-literal-string */}
                glyph.science@proton.me
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
            <div className="mr-4">
              <Link
                className="text-white  hover:underline"
                to="/terms-and-conditions"
              >
                {t("Terms and Conditions")}
              </Link>
            </div>
            <div>
              <Link className="text-white  hover:underline" to="/credits">
                {t("Credits")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
