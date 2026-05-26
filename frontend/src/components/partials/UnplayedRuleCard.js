import CreateIcon from "@material-ui/icons/Create";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { add, isPast } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import Countdown from "react-countdown";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import ConditionalLink from "./ConditionalLink";
import DeleteRuleModal from "./DeleteRuleModal";

export const MINUTES_TO_WAIT_BEFORE_PLAY = 3;

const UnplayedRuleCard = ({
  description,
  _id,
  script,
  points,
  updatedAt,
  ruleBinary,
  fetchRules,
}) => {
  const { t } = useTranslation();
  const characters = ruleBinary.split("").filter((item) => item === "1").length;
  const ruleAvailableTime = useMemo(
    () =>
      add(new Date(updatedAt), {
        minutes: MINUTES_TO_WAIT_BEFORE_PLAY,
      }),
    [updatedAt],
  );
  const [isOlderThanThreshold, setIsOlderThanThreshold] = useState(
    isPast(ruleAvailableTime),
  );

  const trialScriptId = process.env.REACT_APP_TUTORIAL_SCRIPT_ID;
  const isTrialScript = script === trialScriptId;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsOlderThanThreshold(true);
    }, Math.max(0, ruleAvailableTime - new Date()));

    return () => clearTimeout(timeout);
  }, [ruleAvailableTime]);

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed || isTrialScript) {
      return (
        <Link to={`/test/${_id}`}>
          <span className="text-primary text-xl flex-shrink-0">
            <PlayArrowIcon />
            {t("Play")}
          </span>
        </Link>
      );
    }
    return (
      <span className="text-primary text-xl flex-shrink-0">
        {t("Play in")} {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    );
  };

  return (
    <div className="bg-white border-gray-600 border-3 hover:border-indigo-500 p-2">
      <div className="flex justify-between items-center flex-wrap">
        <span className="text-sm">
          <span className="not-sr-only">
            {t("charactersAndPoints", {
              characters,
              points,
            })}
          </span>
          <span className="sr-only">
            {t("charactersAndThisIsWorthXPoints", {
              characters,
              points,
            })}
          </span>
        </span>
        <span className="text-primary flex items-center justify-self-end">
          <Link
            to={`/edit/${_id}`}
            className="flex items-center"
            title={t("Edit rule")}
          >
            <CreateIcon />
            <span className="text-primary text-lg ml-0.5">{t("Edit")}</span>
          </Link>
        </span>
      </div>
      <ConditionalLink
        to={`/test/${_id}`}
        condition={isOlderThanThreshold || isTrialScript}
      >
        <p className="truncate ml-2 my-2 text-2xl">{description}</p>
      </ConditionalLink>

      <div className="flex justify-between flex-wrap">
        <DeleteRuleModal ruleId={_id} fetchRules={fetchRules} />
        <Countdown date={ruleAvailableTime} renderer={renderer} />
      </div>
    </div>
  );
};

export default UnplayedRuleCard;
