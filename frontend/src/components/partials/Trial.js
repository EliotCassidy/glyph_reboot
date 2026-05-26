import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function Trial({ trialScript }) {
  const { _id, html } = trialScript;
  const { t } = useTranslation();
  return (
    <div className="bg-primary">
      <div className="container mx-auto px-4 sm:py-12 ">
        <h3 className="flex items-center text-2xl mb-4 text-white">
          <span className="mr-4 rounded-full bg-black border-3 border-black h-6 w-6 flex-shrink-0"></span>
          {t("Create and play two rules to unlock the rest of the game")}
        </h3>
        <Link to={`/rules/${_id}`}>
          <div className="bg-white border-gray-600 border-3 hover:border-indigo-500 p-4">
            <div className="mb-4 flex justify-between items-center">
              <span className="truncate text-xs">{t("Practice Round")}</span>
              <span className="text-primary text-2xl flex-shrink-0">
                {t("Try Me")}
              </span>
            </div>

            <p
              className="text-3xl tracking-widest truncate script-font"
              dangerouslySetInnerHTML={{ __html: html.join("") }}
            ></p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Trial;
