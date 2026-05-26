import { useContext } from "react";
import Countdown from "react-countdown";
import { useTranslation } from "react-i18next";
import { Redirect, Link } from "react-router-dom";

import Arrow from "../assets/accents/Arrow.svg";
import Ellipse from "../assets/accents/Ellipse.svg";
import Moon from "../assets/accents/Moon.svg";
import LandingPic from "../assets/landing.svg";
import { AuthContext } from "../AuthContext";
import { Banner } from "../components/shared";
import { LanguageContext } from "../LanguageContext";
import VideoSmall from "../videos/Glyph_App_Short_Video_compressed.mp4";
import VideoLarge from "../videos/Glyphs_App_Long_Video_compressed.mp4";
import videoSubtitles_DE from "../videos/science-behind-subtitles-de.vtt";
import videoSubtitles_EN from "../videos/science-behind-subtitles-en.vtt";
import videoSubtitles_ES from "../videos/science-behind-subtitles-es.vtt";
import videoSubtitles_FR from "../videos/science-behind-subtitles-fr.vtt";
import videoSubtitles_IT from "../videos/science-behind-subtitles-it.vtt";
import videoSubtitles_RU from "../videos/science-behind-subtitles-ru.vtt";

const Landing = () => {
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);
  const { currentLanguage } = useContext(LanguageContext);
  const countDownDate = new Date("Feb 1, 2022");

  if (authenticated) {
    return <Redirect to="/home"></Redirect>;
  }

  const renderer = ({ days, hours, minutes, completed }) => {
    if (completed) {
      return (
        <Link to="/signup">
          <span className="font-medium text-4xl md:text-8xl hover:underline">
            {t("Play Glyph now!")}
          </span>
        </Link>
      );
    } else {
      return (
        <>
          <span className="font-medium text-2xl">{t("Launching in")}</span>{" "}
          <span className="font-bold text-3xl">{days}</span> {t("days")} :{" "}
          <span className="font-bold text-3xl">{hours}</span> {t("hours")} :{" "}
          <span className="font-bold text-3xl">{minutes}</span> {t("minutes")}
        </>
      );
    }
  };

  return (
    <div>
      <div className="bg-black">
        <div className="container mx-auto flex flex-col px-4">
          <div className="md:flex items-center py-10">
            <div className="md:mr-8 md:pr-20">
              <p className="text-white text-xl mb-8">
                {t("Introducing Glyph")}
              </p>
              <h1 className="text-white text-4xl md:text-6xl mb-8 break-words">
                {t(
                  "The Max Planck Society is launching a new game to investigate the shapes of letters! Join us!",
                )}
              </h1>
            </div>
            <img src={LandingPic} role="presentation" alt="" />
          </div>
        </div>
      </div>
      <Banner>
        <div className="container mx-auto px-4">
          <p className="text-xl m-0 py-8">
            <Countdown date={countDownDate} renderer={renderer} />
          </p>
        </div>
      </Banner>
      <div className="bg-gray-100 md:py-40 py-10">
        <div className="container mx-auto px-4 md:flex items-center">
          <div className="md:mr-8 pb-10">
            <div className="flex justify-center md:justify-start md:mb-4">
              <img src={Ellipse} alt="" className="pr-4" />
              <img src={Moon} alt="" />
            </div>
            <h2 className="text-2xl text-center font-medium md:text-left ">
              {t("Curious to learn more?")}
            </h2>
          </div>
          <div>
            <video
              id="video"
              controls
              preload="metadata"
              height="500"
              className="max-w-full"
            >
              <source src={VideoSmall} type="video/mp4" />
              <track
                label="English"
                kind="captions"
                srcLang="en"
                src="../videos/sintel-en.vtt"
                default
              />
            </video>
          </div>
        </div>
      </div>
      <Banner isYellow>
        <div className="flex items-center justify-center py-8">
          <img className="invisible md:visible" src={Ellipse} alt="" />
          <p className="m-0 px-0 sm:px-8 font-medium text-2xl">
            {t("The science behind Glyph")}
          </p>
          <img className="invisible md:visible" src={Arrow} alt="" />
        </div>
      </Banner>
      <div className="bg-black flex justify-center ">
        <video
          id="video"
          controls
          preload="metadata"
          height="500"
          className="max-w-full"
        >
          <source src={VideoLarge} type="video/mp4" />
          <track
            label="English"
            kind="captions"
            srcLang="en"
            src={videoSubtitles_EN}
            default={currentLanguage === "en"}
          />
          <track
            label="Deutsch"
            kind="subtitles"
            srcLang="de"
            src={videoSubtitles_DE}
            default={currentLanguage === "de"}
          />
          <track
            label="Español"
            kind="subtitles"
            srcLang="es"
            src={videoSubtitles_ES}
            default={currentLanguage === "es"}
          />
          <track
            label="Français"
            kind="subtitles"
            srcLang="fr"
            src={videoSubtitles_FR}
            default={currentLanguage === "fr"}
          />
          <track
            label="Italiano"
            kind="subtitles"
            srcLang="it"
            src={videoSubtitles_IT}
            default={currentLanguage === "it"}
          />
          <track
            label="Pусский"
            kind="subtitles"
            srcLang="ru"
            src={videoSubtitles_RU}
            default={currentLanguage === "ru"}
          />
        </video>
      </div>
    </div>
  );
};

export default Landing;
