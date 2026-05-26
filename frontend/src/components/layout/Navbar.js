import StarOutlineIcon from "@material-ui/icons/StarOutline";
import i18next from "i18next";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import SmallLogo from "../../assets/g-logo.svg";
import Logo from "../../assets/glyph-logo-white.svg";
import { AuthContext } from "../../AuthContext";
import { UserContext } from "../../UserContext";
import { PrimaryButton, SecondaryButton } from "../shared";

const Navbar = () => {
  const { authenticated } = useContext(AuthContext);
  const { userId, user, isAdmin } = useContext(UserContext);
  const { t } = useTranslation();

  const numberFormat = new Intl.NumberFormat(i18next.language);

  const isLoggedIn = authenticated && userId;

  return (
    <nav className="bg-black px-4 sm:px-8 align-center flex justify-between ">
      <Link to="/" className="flex flex-shrink-0 py-8 items-center">
        <img src={Logo} alt="logo" className="hidden xs:block" />
        <img src={SmallLogo} alt="logo" className="xs:hidden" />
      </Link>
      <div className="flex text-white sm:text-xl items-center py-8 flex-wrap justify-end gap-2 sm:gap-4">
        {isLoggedIn && (
          <>
            {user && (
              <>
                <Link to="/leaderboard" className="flex mr-6">
                  <span className="mr-2 -mt-0.5">
                    <StarOutlineIcon />
                  </span>
                  {t("Total Points_X", {
                    count: numberFormat.format(user.totalPoints) || 0,
                  })}
                </Link>
                <Link to="/account-settings">
                  <div className="mr-4 flex items-center justify-center rounded-full bg-white h-8 w-8 text-black font-bold capitalize">
                    {user?.username.split("")[0]}
                  </div>
                </Link>
                {isAdmin && (
                  <div className="mr-6 hidden sm:block hover:underline">
                    <Link to="/admin">{t("Admin")}</Link>
                  </div>
                )}
              </>
            )}
          </>
        )}
        {!isLoggedIn && (
          <>
            <Link to="/signin" className="text-white hover:text-black txt-6xl">
              <SecondaryButton>
                <span className="md:text-4xl">{t("Sign In")}</span>
              </SecondaryButton>
            </Link>
            <Link to="/signup">
              <PrimaryButton>
                <span className="md:text-4xl">{t("Sign Up")}</span>
              </PrimaryButton>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
