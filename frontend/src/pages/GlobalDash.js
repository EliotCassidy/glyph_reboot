import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/Close";
import InfoIcon from "@material-ui/icons/Info";
import { groupBy, shuffle } from "lodash";
import { useState, useEffect, useContext, Fragment } from "react";
import { useTranslation } from "react-i18next";

import { AuthContext } from "../AuthContext";
import { Tutorial, LanguageSelect } from "../components/partials";
import { UserContext } from "../UserContext";

const SCRIPTS_COUNT_KEY = "scriptsCount";

const buildScriptsSections = (t, scripts) => {
  const scriptsByPointsToUnlock = groupBy(
    scripts,
    ({ pointsToUnlock }) => pointsToUnlock,
  );

  const sortedPoints = Object.keys(scriptsByPointsToUnlock).sort(
    (a, b) => parseInt(a) - parseInt(b),
  );

  const groupAndSortedScripts = sortedPoints.reduce((sections, key, index) => {
    if (index === 0)
      return [
        {
          title: t("Scripts to play"),
          pointsToUnlock: parseInt(key),
          scripts: scriptsByPointsToUnlock[key],
        },
      ];

    if (index === 1)
      return [
        sections[0],
        {
          title: t("More scripts to play!"),
          pointsToUnlock: parseInt(key),
          scripts: scriptsByPointsToUnlock[key],
        },
      ];

    return [
      sections[0],
      sections[1],
      {
        title: t("Even more scripts to play!"),
        pointsToUnlock: parseInt(key),
        scripts: [
          ...(sections[2]?.scripts || []),
          ...scriptsByPointsToUnlock[key],
        ],
      },
    ];
  }, []);

  return groupAndSortedScripts;
};

function GlobalDash() {
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);
  const { user, userId } = useContext(UserContext);

  const [error, setError] = useState(null);
  const [scripts, setScripts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [previousScriptCount, setPreviousScriptCount] = useState(
    parseInt(localStorage.getItem(`${userId}-${SCRIPTS_COUNT_KEY}`)) || 0,
  );

  useEffect(() => {
    if (!previousScriptCount) return;

    localStorage.setItem(`${userId}-${SCRIPTS_COUNT_KEY}`, previousScriptCount);
  }, [userId, previousScriptCount]);

  useEffect(() => {
    const fetchScripts = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const result = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/scripts`,
          {
            method: "GET",
            headers: {
              Authorization: authenticated,
            },
          },
        ).then((response) => response.json());

        if (result.scripts) {
          setScripts(result.scripts);
        }
      } catch (error) {
        setError(error.message);
      }

      setIsLoading(false);
    };

    fetchScripts();
  }, [authenticated]);

  if (isLoading) {
    return (
      <div className="flex align-center justify-center my-16">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex align-center justify-center my-16">
        <h1>{error}</h1>
      </div>
    );
  }

  if (scripts.length === 0) {
    return (
      <div className="flex align-center justify-center my-16">
        <h1>{t("No scripts available")}</h1>
      </div>
    );
  }

  const greekId = process.env.REACT_APP_TUTORIAL_SCRIPT_ID;
  const trialScript = scripts.find((script) => script._id === greekId);
  const remainingScripts = scripts.filter((script) => script._id !== greekId);
  const scriptsWithUnplayedRules = remainingScripts.filter((script) =>
    script.rules.some((rule) => rule.remainingAttempts > 0),
  );
  const scriptsWithNoRulesToPlay = remainingScripts.filter(
    (script) =>
      script.rules.length === 0 ||
      script.rules.every((rule) => rule.remainingAttempts === 0),
  );

  const dismissNotification = () => {
    setPreviousScriptCount(remainingScripts.length);
  };

  const isTrialActive = trialScript.playCount < 2;
  const displayTrialOverBanner =
    !isTrialActive && previousScriptCount < remainingScripts.length;

  const sections = buildScriptsSections(t, scriptsWithNoRulesToPlay);
  const sortedSections = [
    ...sections
      .filter(({ pointsToUnlock }) => user.totalPoints >= pointsToUnlock)
      .sort((a, b) => b.pointsToUnlock - a.pointsToUnlock),
    ...sections.filter(
      ({ pointsToUnlock }) => user.totalPoints < pointsToUnlock,
    ),
  ];

  return (
    <>
      <Tutorial
        hasCreatedRules={trialScript.rules.length > 0}
        isTrialActive={isTrialActive}
      />
      {!isTrialActive && (
        <div className="bg-gray-50">
          <div className="container mx-auto px-4 py-12">
            {displayTrialOverBanner && (
              <div className="bg-primary text-white text-xl flex items-start justify-between mb-8">
                <div className="flex p-4 ">
                  <InfoIcon className="mr-4" />
                  {t("Congratulations, you have now unlocked new scripts!")}
                </div>
                <button
                  onClick={() => dismissNotification()}
                  className="hover:bg-black hover:bg-opacity-50 p-4"
                >
                  <CloseIcon />
                </button>
              </div>
            )}
            {scriptsWithUnplayedRules.length > 0 && (
              <>
                <div className="flex flex-col md:flex-row items-center">
                  <h3 className="flex items-center text-2xl my-2 md:my-4">
                    <span className="mr-4 rounded-full bg-black border-3 border-black h-6 w-6 flex-shrink-0"></span>
                    {t("Scripts with unplayed rules")}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr md:mb-16 my-8">
                  {scriptsWithUnplayedRules.map(
                    ({ name, totalPoints, rules, html, _id }) => {
                      return (
                        <LanguageSelect
                          key={name}
                          name={name}
                          rule={html.slice(-5).join("")}
                          scriptId={_id}
                          rules={rules}
                          points={totalPoints}
                        />
                      );
                    },
                  )}
                </div>
              </>
            )}

            {sortedSections.map(({ title, scripts, pointsToUnlock }, index) => {
              const shuffled = shuffle(scripts);

              const isDisabled = user.totalPoints < pointsToUnlock;

              return (
                <Fragment key={index}>
                  <div
                    className="flex flex-col md:flex-row items-center"
                    id={`section-${index}`}
                  >
                    <h3 className="flex items-center text-2xl my-2 md:my-4">
                      <span className="mr-4 rounded-full bg-black border-3 border-black h-6 w-6"></span>
                      {title}
                    </h3>
                    {isDisabled && (
                      <p className="md:ml-8 my-2 md:my-4">
                        {t("Earn X more points to play these scripts", {
                          count: pointsToUnlock - user.totalPoints,
                        })}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr my-8">
                    {shuffled &&
                      shuffled.map(
                        ({ name, totalPoints, rules, html, _id }) => {
                          return (
                            <LanguageSelect
                              isDisabled={isDisabled}
                              key={name}
                              name={name}
                              rule={html.slice(-5).join("")}
                              scriptId={_id}
                              points={totalPoints}
                              rules={rules}
                            />
                          );
                        },
                      )}
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default GlobalDash;
