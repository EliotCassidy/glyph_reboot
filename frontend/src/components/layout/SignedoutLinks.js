import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const SignedoutLinks = () => {
  const { t } = useTranslation();
  return (
    <ul>
      <li>
        <NavLink className="text-white font-bold hover:underline" to="/signup">
          {t("Create an Account")}
        </NavLink>
      </li>
      <li>
        <NavLink className="text-white font-bold hover:underline" to="/signin">
          {t("Sign In")}
        </NavLink>
      </li>
    </ul>
  );
};

export default SignedoutLinks;
