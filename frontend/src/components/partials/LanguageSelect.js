import { min, isValid, sub } from "date-fns";
import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ReactComponent as ClockIcon } from "../../assets/clock.svg";
import ConditionalLink from "./ConditionalLink";
import { MINUTES_TO_WAIT_BEFORE_PLAY } from "./UnplayedRuleCard";

function LanguageSelect({ rule, scriptId, rules, name, isDisabled = false }) {
  const { t } = useTranslation();

  const playedRules = rules.filter(
    (rule) => rule.remainingAttempts === 0,
  ).length;

  const [now, setNow] = useState(new Date());

  const thresholdTime = useMemo(
    () => sub(now, { minutes: MINUTES_TO_WAIT_BEFORE_PLAY }),
    [now],
  );
  const playableRules = useMemo(
    () => rules.filter((rule) => rule.remainingAttempts > 0),
    [rules],
  );
  const earliestPlayableRuleDate = useMemo(
    () => min(playableRules.map((rule) => new Date(rule.updatedAt))),
    [playableRules],
  );

  const state = useMemo(() => {
    if (playableRules.length === 0) return null;

    if (
      isValid(earliestPlayableRuleDate) &&
      earliestPlayableRuleDate > thresholdTime
    )
      return <ClockIcon className="m-2" />;

    return (
      <div className="rounded-full bg-primary text-white px-8 py-2 transition hover:bg-indigo-800 flex-shrink-0">
        {t("Play Now!")}
      </div>
    );
  }, [thresholdTime, earliestPlayableRuleDate, playableRules, t]);

  useEffect(() => {
    if (
      !isValid(earliestPlayableRuleDate) ||
      earliestPlayableRuleDate - thresholdTime < 0
    )
      return;

    const timeout = setTimeout(() => {
      setNow(new Date());
    }, earliestPlayableRuleDate - thresholdTime);

    return () => clearTimeout(timeout);
  }, [thresholdTime, earliestPlayableRuleDate]);

  const hasNoPlaybaleRules = playedRules === rules.length;

  return (
    <ConditionalLink condition={!isDisabled} to={`/rules/${scriptId}`}>
      <div
        className={`${
          !isDisabled ? "hover:border-indigo-500" : "opacity-50 select-none"
        }  border-gray-600 border-3 p-3 grid gap-2`}
      >
        <p>{t(name)}</p>
        <p
          className={`text-3xl tracking-widest truncate ${
            name === "Afaka" ? "afaka-font" : "script-font"
          }`}
          dangerouslySetInnerHTML={{ __html: rule }}
        ></p>
        <div className="flex justify-between items-center flex-wrap">
          {!hasNoPlaybaleRules && (
            <span className="text-primary flex-shrink-0 py-2 pr-2">
              {t("X unplayed rules", {
                count: rules.length - playedRules,
              })}
            </span>
          )}
          {hasNoPlaybaleRules && (
            <>
              <span className="text-primary flex-shrink-0">
                {playedRules > 0 && (
                  <>
                    {t("X played rules", {
                      count: playedRules,
                    })}
                  </>
                )}
              </span>
              <span className="text-primary flex-shrink-0">
                {t("Create a rule")}
              </span>
            </>
          )}
          {state}
        </div>
      </div>
    </ConditionalLink>
  );
}

export default LanguageSelect;
