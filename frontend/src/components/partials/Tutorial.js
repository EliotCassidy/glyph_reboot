import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import Another from "../../assets/another.svg";
import Before from "../../assets/before.svg";
import TutorialGlyphBlue from "../../assets/glyph-tutorial-blue.svg";
import TutorialGlyphSelected from "../../assets/glyph-tutorial-selected.svg";
import TutorialGlyphTest from "../../assets/glyph-tutorial-test.svg";
import TutorialGlyph from "../../assets/glyph-tutorial.svg";
import TutorialGraph from "../../assets/tutorial-graph.svg";
import { PrimaryButton } from "../shared";

function Tutorial({ hasCreatedRules, isTrialActive }) {
  const { t } = useTranslation();
  const [slide, setSlide] = useState(0);

  const SLIDESHOW_LENGTH = 6;

  const isLarge = isTrialActive || slide !== 0;

  /* Redirecting to rules list if the user already created a rule */
  const playLink = hasCreatedRules
    ? `/rules/${process.env.REACT_APP_TUTORIAL_SCRIPT_ID}`
    : `/rule/new/${process.env.REACT_APP_TUTORIAL_SCRIPT_ID}`;

  return (
    <div
      className={`  bg-black flex flex-nowrap flex-col items-center pt-4 justify-between text-center ${
        isLarge ? "main-tutorial" : ""
      }`}
    >
      <ul
        className={`${isLarge ? "tutorial-slider" : ""} container my-auto px-4`}
      >
        <li className={slide !== 0 ? "hidden" : ""}>
          <img
            className={`${isLarge ? "mt-24" : ""} mx-auto mb-4`}
            src={TutorialGraph}
            alt=""
            height="120"
          />
        </li>
        <li className={slide !== 1 ? "hidden" : ""}>
          <div className="flex justify-center">
            <p className="text-white text-xl max-w-sm">
              {t(
                "You will be presented with a set of characters, like the one you see below",
              )}
            </p>
          </div>
          <div className="flex justify-center align-center my-16">
            <img src={TutorialGlyph} alt="" />
          </div>
        </li>
        <li className={slide !== 2 ? "hidden" : ""}>
          <div className="flex justify-center">
            <p className="text-white text-xl max-w-xl">
              {t(
                "Select as many characters as possible in a way that you can easily remember. You must select at least as many as is indicated.",
              )}
            </p>
          </div>
          <div className="flex justify-center align-center my-16">
            <img src={TutorialGlyphBlue} alt="" />
          </div>
        </li>
        <li className={slide !== 3 ? "hidden" : ""}>
          <div className="flex flex-col items-center">
            <p className="text-white text-xl">
              {t("Type in a rule that describes the set.")}
            </p>

            <div className="flex flex-col justify-center align-center ">
              <div className="tutorial-input bg-white bg-opacity-25 border-8 w-full px-8 py-5 text-xl md:text-2xl text-white text-left mt-8">
                {t("All characters with a round edge.")}
              </div>
              <img
                className="lg:w-full my-16"
                src={TutorialGlyphSelected}
                alt=""
              />
            </div>
          </div>
        </li>
        <li className={slide !== 4 ? "hidden" : ""}>
          <div className="flex justify-center">
            <p className="text-white text-xl max-w-xl">
              {t("Here is another example of characters that can be selected.")}
            </p>
          </div>
          <div className="flex justify-center align-center my-16">
            <img src={Another} alt="" />
          </div>
        </li>
        <li className={slide !== 5 ? "hidden" : ""}>
          <div className="flex flex-col items-center">
            <p className="text-white text-xl max-w-screen-xl">
              {t(
                "Just like before, once you've selected your characters, you'll need to provide a description, as you see below.",
              )}
            </p>

            <div className="flex flex-col justify-start align-center w-full max-w-screen-xl">
              <div className="tutorial-input bg-white bg-opacity-25 border-8 w-full px-8 py-5 text-xl md:text-2xl text-white text-left mt-8">
                {t("All characters with parallel lines.")}
              </div>
              <img src={Before} alt="" className="w-full sm:w-1/2 my-16" />
            </div>
          </div>
        </li>
        <li className={slide !== 6 ? "hidden" : ""}>
          <div className="flex justify-center">
            <p className="text-white text-xl max-w-sm">
              {t(
                "Later, you'll be shown the same characters but in a different order, and you'll need to select the same characters as before",
              )}
            </p>
          </div>
          <div className="flex justify-center align-center my-16">
            <img src={TutorialGlyphTest} alt="" />
          </div>
        </li>
      </ul>

      <div className={isLarge ? "mb-12" : ""}>
        <div className="container mx-auto flex justify-center align-center ">
          {slide < SLIDESHOW_LENGTH && (
            <div className="flex flex-col items-center">
              <PrimaryButton onClick={() => setSlide(slide + 1)}>
                {slide === 0 && t("How to play")}
                {slide > 0 && slide <= SLIDESHOW_LENGTH && t("Next")}
              </PrimaryButton>
              {slide === 0 && isTrialActive && (
                <Link
                  to={playLink}
                  className="rounded-full px-8 sm:px-6 py-2 text-primary text-lg font-normal border-primary disabled:opacity-50 text-center border-3 justify-center transition hover:bg-primary hover:bg-opacity-50 hover:text-white flex items-center mt-8"
                >
                  {t("Play Now!")}
                </Link>
              )}
            </div>
          )}
          {slide === SLIDESHOW_LENGTH && isTrialActive && (
            <Link to={playLink} className="animate-bounce">
              <PrimaryButton>{t("Practice Round")}</PrimaryButton>
            </Link>
          )}
          {slide === SLIDESHOW_LENGTH && !isTrialActive && (
            <div>
              <PrimaryButton onClick={() => setSlide(1)}>
                {t("Back to the Start")}
              </PrimaryButton>
            </div>
          )}
        </div>

        <div
          className={
            "flex align-center justify-center my-4 " +
            (slide < 1 ? "invisible" : "")
          }
        >
          {Array(SLIDESHOW_LENGTH)
            .fill("")
            .map((_, index) => {
              return (
                <button
                  key={index}
                  className={
                    "h-4 w-4 cursor-pointer rounded-full mx-2 " +
                    (slide === index + 1 ? "bg-white" : "bg-gray-500")
                  }
                  onClick={() => setSlide(index + 1)}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
