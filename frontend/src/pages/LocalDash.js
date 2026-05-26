import CircularProgress from "@material-ui/core/CircularProgress";
import InfoIcon from "@material-ui/icons/Info";
import { add } from "date-fns";
import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";

import { AuthContext } from "../AuthContext";
import { SubNav, NarrowWrapper } from "../components/layout";
import { UnplayedRuleCard, PlayedRuleCard } from "../components/partials";
import { MINUTES_TO_WAIT_BEFORE_PLAY } from "../components/partials/UnplayedRuleCard";
import { PrimaryButton } from "../components/shared";

function LocalDash() {
  const { scriptId } = useParams();
  const { authenticated } = useContext(AuthContext);

  const { t } = useTranslation();

  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [script, setCurrentScript] = useState();

  const untestedRules = useMemo(
    () => rules.filter((rule) => rule.remainingAttempts > 0),
    [rules],
  );
  const playedRules = useMemo(
    () => rules.filter((rule) => rule.remainingAttempts === 0),
    [rules],
  );

  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const earliestRuleUpdateTime = Math.min(
      ...untestedRules.map(({ updatedAt }) => new Date(updatedAt)),
    );

    const timeToUnlock = add(earliestRuleUpdateTime, {
      minutes: MINUTES_TO_WAIT_BEFORE_PLAY,
    });

    if (timeToUnlock >= new Date()) {
      setShowBanner(true);

      const timeout = setTimeout(() => {
        setShowBanner(false);
      }, timeToUnlock - new Date());

      return () => clearTimeout(timeout);
    }
  }, [untestedRules]);

  const fetchRules = useCallback(async () => {
    setIsLoading(true);

    const result = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/v1/rules`,
      {
        method: "GET",
        headers: {
          Authorization: authenticated,
        },
      },
    ).then((response) => response.json());

    const rulesForCurrentScript = result.rules.filter(
      (rule) => rule.script === scriptId,
    );

    setRules(rulesForCurrentScript);
    setIsLoading(false);
  }, [authenticated, scriptId]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  useEffect(() => {
    const fetchScripts = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const result = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/scripts/${scriptId}`,
          {
            method: "GET",
            headers: {
              Authorization: authenticated,
            },
          },
        ).then((response) => response.json());

        setCurrentScript(result.script);
      } catch (error) {
        setError(error);
      }

      setIsLoading(false);
    };

    fetchScripts();
  }, [authenticated, scriptId]);

  if (isLoading) {
    return (
      <div className="flex align-center justify-center my-16">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <NarrowWrapper>
        <div className="text-red-500 text-center py-2">{error}</div>
      </NarrowWrapper>
    );
  }

  const greekId = process.env.REACT_APP_TUTORIAL_SCRIPT_ID;

  const isGreek = scriptId === greekId;

  const isTrialActive = isGreek && playedRules.length < 2;

  const ttlPointsEarned = playedRules.reduce((acc, rule) => {
    return acc + rule.points;
  }, 0);

  return (
    <>
      <SubNav
        points={ttlPointsEarned}
        script={script?.html.slice(-5).join("")}
        name={script?.name}
      />
      <div className="container mx-auto px-4">
        {isTrialActive && (
          <div className="bg-primary p-4 text-white text-xl flex items-center">
            <InfoIcon className="mr-4" />
            {t("Create and play two rules to unlock the game!")}
          </div>
        )}

        {!isTrialActive && showBanner && (
          <div className="bg-primary p-4 text-white text-xl flex items-center">
            <InfoIcon className="mr-4" />
            {t(
              "You can make more rules here, or try out other scripts while you wait for your rules to become playable!",
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center my-4 md:mt-12">
          <h2 className="text-4xl font-bold order-1 sm:order-none">
            {t("Unplayed Rules")}
          </h2>
          <Link to={`/rule/new/${scriptId}`} className="my-2">
            <PrimaryButton>{t("Create New Rule")}</PrimaryButton>
          </Link>
        </div>
        {rules.length === 0 && (
          <div className="no-rules-box bg-gray-200 rounded-lg flex items-center text-center justify-center text-3xl text-gray-500 h-72 p-8 mb-8">
            {t("You have no rules yet")}.
          </div>
        )}

        {untestedRules.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr my-8">
            {untestedRules &&
              untestedRules.map((rule) => {
                return (
                  <div key={rule._id} className="">
                    <UnplayedRuleCard fetchRules={fetchRules} {...rule} />
                  </div>
                );
              })}
          </div>
        )}

        {playedRules.length > 0 && (
          <div>
            <h2 className="text-2xl mt-12 mb-4">{t("Played Rules")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr my-8">
              {playedRules &&
                playedRules.map((rule) => {
                  return (
                    <div key={rule._id} className="">
                      <PlayedRuleCard
                        fetchRules={fetchRules}
                        characters={script?.html}
                        {...rule}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default LocalDash;
