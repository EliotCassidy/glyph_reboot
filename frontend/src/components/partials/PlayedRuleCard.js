import CloseIcon from "@material-ui/icons/Close";
import Info from "@material-ui/icons/Info";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";

import Tooltip from "../shared/Tooltip";

Modal.setAppElement("#root");

const PlayedRuleCard = ({
  description,
  characters,
  script,
  points,
  isUnique,
  ruleBinary,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const AmountOfCharacters = ruleBinary
    .split("")
    .filter((item) => item === "1").length;

  const afakaScriptId = "6138ca71dc2a42003d456777";

  const isAfaka = script === afakaScriptId;

  const selectedCharacters = useMemo(() => {
    if (!characters) {
      return "";
    }

    return ruleBinary
      .split("")
      .reduce((acc, position, index) => {
        if (position === "1") {
          return [...acc, characters[index]];
        }
        return acc;
      }, [])
      .join("");
  }, [characters, ruleBinary]);

  const passed = points > 0;

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        className="left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 absolute bg-white rounded-lg w-full md:w-1/2 h-auto"
        overlayClassName="bg-black fixed inset-0 bg-opacity-75"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <div className="h-full w-full relative p-4">
          <div className="flex items-center justify-center h-full">
            <div className="flex-col">
              <h1 className="text-2xl font-bold  my-8">
                {t("Rule_")}
                <span className="capitalize">{description}</span>
              </h1>
              <h1 className="text-2xl font-bold  my-8">
                {t("Characters_")}
                <span
                  className={`${
                    isAfaka ? "afaka-font" : "script-font"
                  } break-all`}
                  dangerouslySetInnerHTML={{ __html: selectedCharacters }}
                ></span>
              </h1>
              <h1 className="text-2xl font-bold my-8">
                {t("Status_")}
                {isUnique
                  ? `${t("Unique")}*`
                  : passed
                  ? t("Passed")
                  : t("Failed")}
              </h1>
              {isUnique && (
                <h2>
                  *
                  {t(
                    "You were the first to propose this rule, making it unique. You win double points when you successfully test unique rules.",
                  )}
                </h2>
              )}
            </div>
            <div className="absolute top-0 right-0">
              <button className="p-8">
                <CloseIcon
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <div
        tabIndex="0"
        className="bg-white border-gray-600 border-3 hover:border-indigo-500 p-2"
        role="button"
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(e) => {
          if (e.code === "Enter" || e.code === "Space") {
            setIsModalOpen(true);
          }
        }}
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
      </div>
    </>
  );
};

export default PlayedRuleCard;
