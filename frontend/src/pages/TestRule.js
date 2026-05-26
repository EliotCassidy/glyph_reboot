import CircularProgress from "@material-ui/core/CircularProgress";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { add, isFuture } from "date-fns";
import { shuffle } from "lodash";
import React, { useState, useEffect, useContext } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useParams, useHistory, Link } from "react-router-dom";

import { AuthContext } from "../AuthContext";
import { CharsSelection, ResultsModal } from "../components/partials";
import { MINUTES_TO_WAIT_BEFORE_PLAY } from "../components/partials/UnplayedRuleCard";
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from "../components/shared";
import { UserContext } from "../UserContext";
import NotFound from "./NotFound";

const MAX_ATTEMPTS = 3;

function TestRule() {
  const { t } = useTranslation();
  const { ruleId } = useParams();
  const history = useHistory();
  const { authenticated } = useContext(AuthContext);
  const { refreshUser } = useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [attempts, setAttempts] = useState([]);

  const [characters, setCharacters] = useState([]);
  const [shuffledCharacters, setShuffledCharacters] = useState([]);

  const [testBinary, setTestBinary] = useState([]);
  const [shuffledRuleBinary, setShuffledRuleBinary] = useState([]);
  const [script, setScript] = useState(null);

  const [potentialScore, setPotentialScore] = useState(0);

  const [rule, setRule] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleCloseModal = async (giveUp) => {
    if (giveUp) {
      handleGiveUp();
    } else {
      if (rule.remainingAttempts === 0) {
        const isGreek =
          rule.script === process.env.REACT_APP_TUTORIAL_SCRIPT_ID;
        const playedRules = scriptRules.filter(
          ({ remainingAttempts }) => remainingAttempts === 0,
        );
        if (isGreek && playedRules.length > 1) {
          history.push("/");
        } else {
          history.replace(`/rules/${characters._id}`);
        }
      } else {
        setIsModalOpen(false);
      }
    }
  };

  const handleGiveUp = async () => {
    await forfeitRule();
    history.replace(`/rules/${characters._id}`);
  };

  const forfeitRule = async () => {
    try {
      const result = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/rules/forfeit/${rule._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authenticated,
          },
        },
      ).then((response) => response.json());

      if (result.rule) {
        setRule(result.rule);
      }

      if (result.error) {
        setErrorMessage(result.error.message);
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const testRule = async () => {
    try {
      const result = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/rules/test/${rule._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authenticated,
          },
          body: JSON.stringify({ testBinary: testBinary.join("") }),
        },
      ).then((response) => response.json());

      if (result.rule) {
        setRule(result.rule);

        if (result.rule.points > 0) {
          refreshUser();
        }
      }

      if (result.error) {
        setErrorMessage(result.error.message);
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const handleSubmit = async () => {
    if (!attempts.includes(testBinary.join(""))) {
      setAttempts([...attempts, testBinary.join("")]);
    } else {
      return setErrorMessage(
        t("You've already tried this selection. Try something else!"),
      );
    }

    await testRule();
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchRule = async () => {
      setIsLoading(true);

      const ruleResult = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/rules/${ruleId}`,
        {
          method: "GET",
          headers: {
            Authorization: authenticated,
          },
        },
      )
        .then((response) => response.json())
        .catch((error) => {
          setErrorMessage(error.error.message);
          return;
        });

      const scriptResult = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/scripts/${ruleResult.rule?.script}`,
        {
          method: "GET",
          headers: {
            Authorization: authenticated,
          },
        },
      )
        .then((response) => response.json())
        .catch((error) => {
          setErrorMessage(error.error.message);
          return;
        });

      if (scriptResult.error) {
        setErrorMessage(scriptResult.error.message);
        setIsLoading(false);
        return;
      }

      setCharacters(scriptResult.script);
      setShuffledCharacters(shuffle(scriptResult.script?.html));
      setScript(scriptResult.script);

      const blankBinary = new Array(
        parseInt(scriptResult.script?.html.length, 10),
      ).fill(0);

      setTestBinary(blankBinary);
      setShuffledRuleBinary(blankBinary);
      setPotentialScore(
        ruleResult.rule.ruleBinary
          .split("")
          .map((item) => parseInt(item, 10))
          .filter(Boolean).length,
      );

      setRule(ruleResult.rule);
      setIsLoading(false);
    };

    fetchRule();
  }, [authenticated, ruleId]);

  const [scriptRules, setScriptRules] = useState([]);
  useEffect(() => {
    if (!rule) return;

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/rules`, {
      method: "GET",
      headers: {
        Authorization: authenticated,
      },
    })
      .then((response) => response.json())
      .then((data) => data.rules.filter(({ script }) => script === rule.script))
      .then((scriptRules) => setScriptRules(scriptRules))
      .catch((error) => {
        setErrorMessage(error.error.message);
        return;
      });
  }, [authenticated, rule]);

  useEffect(() => {
    if (!rule) return;

    const isGreek = rule.script === process.env.REACT_APP_TUTORIAL_SCRIPT_ID;

    if (isGreek) return;

    const ruleAvailableDate = add(new Date(rule.updatedAt), {
      minutes: MINUTES_TO_WAIT_BEFORE_PLAY,
    });

    if (isFuture(ruleAvailableDate)) {
      history.replace(`/rules/${rule.script}`);
    }
  }, [rule, history, script, scriptRules]);

  if (isLoading) {
    return (
      <div className="flex align-center justify-center my-16">
        <CircularProgress />
      </div>
    );
  }

  if (!rule) {
    return <NotFound />;
  }

  if (rule.remainingAttempts === 0 && !isModalOpen) {
    return (
      <div className="flex flex-col align-center justify-center my-16">
        <h5 className="text-4xl font-bold text-center mb-8">
          {t("Rule has already been tested")}
        </h5>
        <div className="flex items-center justify-center">
          <div className="mx-2">
            <PrimaryButton onClick={history.goBack}>{t("Back")}</PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  if (rule) {
    function onClickCharacter(characterIndex) {
      const originalCharacter = shuffledCharacters[characterIndex];

      const originalPosition = characters.html.findIndex(
        (character) => character === originalCharacter,
      );

      const newArray = testBinary.map((item, index) => {
        if (index === originalPosition) {
          if (item === 0) {
            return 1;
          }
          if (item === 1) {
            return 0;
          }
        }
        return item;
      });
      setTestBinary(newArray);

      if (newArray.filter((item) => item === 1).length > potentialScore) {
        setErrorMessage(t("Too many selected characters"));
      } else {
        setErrorMessage(null);
      }

      const newShuffledArray = shuffledRuleBinary.map((item, index) => {
        if (index === characterIndex) {
          if (item === 0) {
            return 1;
          }
          if (item === 1) {
            return 0;
          }
        }
        return item;
      });
      setShuffledRuleBinary(newShuffledArray);
    }

    const handleClearSelection = () => {
      setTestBinary((prev) => prev.map(() => 0));
      setShuffledRuleBinary((prev) => prev.map(() => 0));
      setErrorMessage(null);
    };

    return (
      <div className="container mx-auto my-8 px-4">
        <ResultsModal
          rule={rule}
          isOpen={isModalOpen}
          closeModal={handleCloseModal}
        />
        <div className="my-8 flex flex-wrap justify-between items-center container mx-auto">
          <span className="flex flex-nowrap items-center md:text-xl">
            <Link to={`/`} className="flex" title={t("Home")}>
              {t("Home")}
            </Link>{" "}
            <KeyboardArrowRightIcon fontSize="large" />{" "}
            <Link
              to={`/rules/${rule.script}`}
              className="flex items-center"
              title={t("Rules")}
            >
              <span
                className={`capitalize ${
                  script.name === "Afaka" ? "afaka-font" : "script-font"
                }`}
                dangerouslySetInnerHTML={{
                  __html: script.html.slice(-5).join(""),
                }}
              ></span>
              {script.name && (
                <span className="text-sm ml-2">({t(script.name)})</span>
              )}
            </Link>
            <KeyboardArrowRightIcon fontSize="large" />
          </span>
        </div>
        <form
          className=""
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <h5 className="text-4xl font-bold">
            {t("Rule description")}
            <span>{rule.description}</span>
          </h5>
          <p>{t("Attempts Left", { count: rule.remainingAttempts })}</p>
          <CharsSelection
            charset={shuffledCharacters}
            ruleBinary={shuffledRuleBinary}
            updateSelected={onClickCharacter}
            scriptName={script.name}
          />
          <div>
            <div className="flex flex-col items-center">
              <p className="text-center mt-2">
                <Trans
                  i18nKey="selectedCharacters"
                  defaults="<bold>{{count}}/{{total}} characters</bold> selected"
                  values={{
                    count: testBinary.filter(Boolean).length,
                    total: potentialScore,
                  }}
                  components={{ bold: <strong /> }}
                />
              </p>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-center my-2">{errorMessage}</p>
            )}
            <div className="flex items-stretch sm:items-center justify-center my-2 flex-wrap">
              <div className="flex items-center flex-grow sm:w-auto sm:flex-grow-0 flex-wrap">
                <div className="flex-grow mx-2 md:mx-4 mb-8 sm:mb-0 my-2">
                  {rule.remainingAttempts < MAX_ATTEMPTS ? (
                    <TertiaryButton type="button" onClick={handleGiveUp}>
                      {t("Forfeit")}
                    </TertiaryButton>
                  ) : (
                    <SecondaryButton type="button" onClick={history.goBack}>
                      {t("Back")}
                    </SecondaryButton>
                  )}
                </div>
                <div className="flex-grow mx-2 md:mx-4 mb-8 sm:mb-0 my-2">
                  <button
                    type="button"
                    className="rounded-full px-8 sm:px-12 py-4 min-w-full bg-white text-xl font-normal border-tertiary disabled:opacity-50 text-center border-3 justify-center transition hover:bg-tertiary hover:bg-opacity-50 hover:text-white flex items-center whitespace-nowrap"
                    onClick={handleClearSelection}
                    disabled={testBinary.filter(Boolean).length < 2}
                  >
                    {t("Clear selection")}
                  </button>
                </div>
              </div>

              <div className="w-full md:w-auto mx-2 md:mx-4 my-2">
                <PrimaryButton
                  type="submit"
                  disabled={
                    testBinary.filter(Boolean).length !== potentialScore
                  }
                >
                  {t("Submit")}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default TestRule;
