import { useContext } from "react";
import { useTranslation } from "react-i18next";

import { NarrowWrapper } from "../components/layout";
import { LanguageContext } from "../LanguageContext";
import VideoLarge from "../videos/Glyphs_App_Long_Video_compressed.mp4";
import videoSubtitles_DE from "../videos/science-behind-subtitles-de.vtt";
import videoSubtitles_EN from "../videos/science-behind-subtitles-en.vtt";
import videoSubtitles_ES from "../videos/science-behind-subtitles-es.vtt";
import videoSubtitles_FR from "../videos/science-behind-subtitles-fr.vtt";
import videoSubtitles_IT from "../videos/science-behind-subtitles-it.vtt";
import videoSubtitles_RU from "../videos/science-behind-subtitles-ru.vtt";

function ScienceBehindGlyphVideo() {
  const { t } = useTranslation();
  const { currentLanguage } = useContext(LanguageContext);

  return (
    <NarrowWrapper>
      <h3 className="pb-10 text-3xl">{t("The Science Behind Glyph Video")}</h3>
      <div>
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
    </NarrowWrapper>
  );
}

export default ScienceBehindGlyphVideo;
