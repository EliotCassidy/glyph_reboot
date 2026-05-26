import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../AuthContext";
import { UserContext } from "../../UserContext";

const SignedinLinks = () => {
  const { setAuthenticated } = useContext(AuthContext);
  const { setUserId, isAdmin } = useContext(UserContext);
  const { t } = useTranslation();
  return (
    <ul>
      <li>
        <NavLink className="text-white font-bold hover:underline" to="/">
          {t("Home")}
        </NavLink>
      </li>
      <li>
        <NavLink
          className="text-white font-bold hover:underline"
          to="/promo-video"
        >
          {t("Promotional Video")}
        </NavLink>
      </li>
      <li>
        <NavLink
          className="text-white font-bold hover:underline"
          to="/the-science-behind-glyph-video"
        >
          {t("The Science Behind Glyph Video")}
        </NavLink>
      </li>
      <li>
        <NavLink
          className="text-white font-bold hover:underline"
          to="/leaderboard"
        >
          {t("Leaderboard")}
        </NavLink>
      </li>
      <li>
        <NavLink
          className="text-white font-bold hover:underline"
          to="/account-settings"
        >
          {t("Account Settings")}
        </NavLink>
      </li>
      {isAdmin && (
        <li>
          <NavLink className="text-white font-bold hover:underline" to="/admin">
            {t("Admin")}
          </NavLink>
        </li>
      )}
      <li>
        <NavLink
          className="text-white font-bold hover:underline"
          to="/"
          onClick={() => {
            setUserId("");
            setAuthenticated("");
          }}
        >
          {t("Sign out")}
        </NavLink>
      </li>
    </ul>
  );
};

export default SignedinLinks;
