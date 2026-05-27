import Info from "@material-ui/icons/Info";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import Tooltip from "../shared/Tooltip";

const PlayedRuleCard = ({
  _id,
  description,
  characters,
  script,
  points,
  isUnique,
  ruleBinary,
}) => {
  const { t } = useTranslation();
  const AmountOfCharacters = ruleBinary
    .split("")
    .filter((item) => item === "1").length;

  const passed = points > 0;

  return (
    <Link
      to={`/share/${_id}`}
      className="block bg-white border-gray-600 border-3 hover:border-indigo-500 p-2"
      title={t("Open public share page")}
    >
      <div className="flex">
        <span className="text-sm items-center">
          <span className="not-sr-only">
            {t("charactersAndPoints", {
              characters: AmountOfCharacters,
              points,
            })}
          </span>
          <span className="sr-only">
            {t("charactersAndThisIsWorthXPoints", {
              characters: AmountOfCharacters,
              points,
            })}
          </span>
        </span>
      </div>

      <p className="truncate ml-2 my-2 text-2xl capitalize">{description}</p>

      <div className="flex justify-end">
        {isUnique && (
          <Tooltip
            title={t(
              "You were the first to propose this rule, making it unique. You win double points when you successfully test unique rules.",
            )}
            enterTouchDelay={100}
          >
            <div className="px-4 justify-self-end font-bold border-black rounded-full border-3 bg-crown text-white mr-4 flex items-center">
              {t("Unique")}
              <Info fontSize="small" className="ml-1" />
            </div>
          </Tooltip>
        )}
        {passed && (
          <div className="px-4 justify-self-end font-bold border-black rounded-full border-3 bg-primary text-white">
            {t("Passed")}
          </div>
        )}
        {!passed && (
          <div className="px-4 justify-self-end font-bold border-black rounded-full border-3 bg-orange text-black">
            {t("Failed")}
          </div>
        )}
      </div>
    </Link>
  );
};

export default PlayedRuleCard;
