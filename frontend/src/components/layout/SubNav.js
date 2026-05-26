import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function SubNav({ points, script, name }) {
  const { t } = useTranslation();

  return (
    <div className="my-8 flex flex-wrap justify-between items-center container mx-auto px-4">
      <span className="flex flex-nowrap items-center md:text-xl">
        <Link to={`/`} className="flex" title={t("Home")}>
          {t("Home")}
        </Link>{" "}
        <KeyboardArrowRightIcon fontSize="large" />{" "}
        <span
          className={`capitalize ${
            name === "Afaka" ? "afaka-font" : "script-font"
          }`}
          dangerouslySetInnerHTML={{ __html: script }}
        ></span>
        {name && <span className="text-sm ml-2">{t(name)}</span>}
      </span>
      <span className="flex flex-nowrap items-center space-x-1 text-primary text-right md:text-xl">
        <span>{t("Points for")}</span>
        <span
          className={`capitalize ${
            name === "Afaka" ? "afaka-font" : "script-font"
          }`}
          dangerouslySetInnerHTML={{ __html: script }}
        ></span>
        <span>: {points}</span>
      </span>
    </div>
  );
}

export default SubNav;
