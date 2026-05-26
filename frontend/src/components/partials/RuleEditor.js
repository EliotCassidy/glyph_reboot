import { shuffle } from "lodash";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

import { CharsSelection } from ".";
import { AuthContext } from "../../AuthContext";
import { Character, PrimaryButton, SecondaryButton } from "../shared";

const useFetchRules = (scriptId) => {
  const { authenticated } = useContext(AuthContext);
  const [response, setResponse] = useState({
    data: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    const fetchRule = async () => {
      setResponse((prev) => ({ ...prev, isLoading: true }));

      try {
        const rulesResult = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/rules`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: authenticated,
            },
          },
        )
          .then((response) => response.json())
          .then((response) =>
            response.rules.filter(({ script }) => script === scriptId),
          );

        setResponse({
          data: rulesResult,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setResponse({
          data: null,
          isLoading: false,
          error: error.message,
        });
      }
    };

    fetchRule();
  }, [authenticated, scriptId]);

  return response;
};

const RuleEditor = ({
  id,
  html,
  initialValue,
  onSubmit,
  error,
  scriptName,
  scriptId,
}) => {
  const { data } = useFetchRules(scriptId);
  const [wizardStep, setWizardStep] = useState(0);
  const [firstStepError, setFirstStepError] = useState(null);
  const { t } = useTranslation();
  const displayedIndices = useState(() => shuffle([...html.keys()]))[0];
  const shuffledCharset = displayedIndices.map((index) => html[index]);
  const emptyRuleBinary = new Array(html.length).fill(0);
  const toDisplayBinary = (originalBinary) =>
    displayedIndices.map((index) => originalBinary[index]);
  const toOriginalBinary = (displayBinary) => {
    const originalBinary = new Array(html.length).fill(0);

    displayBinary.forEach((value, displayIndex) => {
      originalBinary[displayedIndices[displayIndex]] = value;
    });

    return originalBinary;
  };
  const [ruleBinary, setRuleBinary] = useState(
    initialValue?.ruleBinary
      ? toDisplayBinary(initialValue.ruleBinary)
      : emptyRuleBinary,
  );
  const [description, setDescription] = useState(
    initialValue?.description || "",
  );
  const history = useHistory();

  const descriptionInputRef = useRef(null);
  useEffect(() => {
    if (wizardStep === 1) {
      descriptionInputRef.current.focus();
    }
  }, [wizardStep]);

  const maxRuleSize =
    html.length % 2 === 0 ? html.length / 2 - 1 : Math.floor(html.length / 2);
  const potentialScore = ruleBinary.filter((item) => item === 1).length;

  const ruleBinaryCharacters = ruleBinary.reduce((acc, item, index) => {
    if (item === 1) {
      return [...acc, shuffledCharset[index]];
    }
    return acc;
  }, []);
  const descriptionTooLong = description.length > 150;

  const onClickCharacter = (characterIndex) => {
    const newArray = ruleBinary.map((item, index) => {
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
    setRuleBinary(newArray);

    if (newArray.filter((item) => item === 1).length > maxRuleSize) {
      setFirstStepError(
        t("Select at least 2 characters but no more than X to make a rule", {
          maxRuleSize,
        }),
      );
    } else {
      setFirstStepError(null);
    }
  };

  const clearSelection = () => {
    setRuleBinary(emptyRuleBinary);
    setFirstStepError(null);
  };

  const handleNextClick = () => {
    const ruleBinaryText = toOriginalBinary(ruleBinary).join("");
    if (
      data &&
      data.find((rule) => rule._id !== id && rule.ruleBinary === ruleBinaryText)
    ) {
      setFirstStepError(
        t(
          "You've already used these exact letters for a different rule! Can you think of a different rule that would select other characters?",
        ),
      );
    } else {
      setWizardStep((prev) => prev + 1);
    }
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <form
        className=""
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {wizardStep === 0 && (
          <>
            <p className="text-2xl pb-5">
              {t(
                "Select at least 2 characters but no more than X to make a rule_",
                { maxRuleSize },
              )}
            </p>

            <div className="char-selection">
              <CharsSelection
                charset={shuffledCharset}
                ruleBinary={ruleBinary}
                updateSelected={(characterIndex) => {
                  onClickCharacter(characterIndex);
                }}
                scriptName={scriptName}
              />
            </div>

            <div className="py-4">
              <div className="flex flex-col items-center">
                <p className="text-center mt-2">
                  {t("This rule is worth X points", {
                    count: potentialScore,
                  })}
                </p>
              </div>

              {firstStepError && (
                <p className="text-red-500 text-center my-2">
                  {firstStepError}
                </p>
              )}

              <div className="flex items-stretch sm:items-center justify-center my-2 flex-wrap">
                <div className="flex items-center flex-grow sm:w-auto sm:flex-grow-0 flex-wrap">
                  <div className="flex-grow mx-2 md:mx-4 mb-8 sm:mb-0 my-2">
                    <SecondaryButton type="button" onClick={history.goBack}>
                      {t("Back")}
                    </SecondaryButton>
                  </div>
                  <div className="flex-grow mx-2 md:mx-4 mb-8 sm:mb-0 my-2">
                    <button
                      type="button"
                      className="rounded-full px-8 sm:px-12 py-4 min-w-full bg-white text-xl font-normal border-tertiary disabled:opacity-50 text-center border-3 justify-center transition hover:bg-tertiary hover:bg-opacity-50 hover:text-white flex items-center whitespace-nowrap"
                      onClick={clearSelection}
                      disabled={ruleBinary.filter(Boolean).length < 2}
                    >
                      {t("Clear selection")}
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-auto mx-2 md:mx-4 my-2">
                  <PrimaryButton
                    type="button"
                    onClick={handleNextClick}
                    disabled={potentialScore < 2 || firstStepError}
                  >
                    {t("Next")}
                  </PrimaryButton>
                </div>
              </div>
            </div>
            </>
          )}
          {wizardStep === 1 && (
            <>
              <div className="rule-description-wrapper">
                <p className="text-2xl pb-5">{t("Text description of rule")}</p>
                <input
                  type="text"
                  id="description"
                  aria-label={t("Description")}
                  autoComplete="off"
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  value={description}
                  name="description"
                  required={true}
                  ref={descriptionInputRef}
                  className="w-full px-8 py-5 text-2xl"
                />
                <p className="text-right">
                  {t("Characters_")}
                  <span className={descriptionTooLong ? "text-red-500 " : " "}>
                    {description.length}
                  </span>
                  {t("/150")}
                </p>

                <p className="text-2xl pb-5">
                  {t("Selected characters")}
                  <button
                    className="ml-8 text-primary hover:underline"
                    type="button"
                    onClick={() => setWizardStep(wizardStep - 1)}
                  >
                    {t("Edit")}
                  </button>
                </p>
                <div className="flex flex-wrap mb-16">
                  {ruleBinaryCharacters.map((item) => (
                    <Character
                      key={item}
                      isActive="true"
                      item={item}
                      disabled={true}
                      scriptName={scriptName}
                    />
                  ))}
                </div>

                {descriptionTooLong && (
                  <p className="text-red-500 text-center my-2">
                    {t("Your description exceeds the 150 character limit.")}
                  </p>
                )}
                {error && (
                  <p className="text-red-500 text-center my-2">{error}</p>
                )}

                <p className="text-center my-2">
                  {t("This rule is worth X points", { count: potentialScore })}
                </p>
              </div>
              <div className="flex items-center justify-center my-2">
                <div>
                  <PrimaryButton
                    type="submit"
                    className="my-2"
                    onClick={() => {
                      onSubmit({
                        description,
                        ruleBinary: toOriginalBinary(ruleBinary),
                      });
                    }}
                    disabled={description === "" || descriptionTooLong}
                  >
                    {t("Finish Rule")}
                  </PrimaryButton>
                </div>
              </div>
            </>
          )}
      </form>
    </div>
  );
};

export default RuleEditor;
