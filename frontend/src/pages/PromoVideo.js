import { useTranslation } from "react-i18next";

import { NarrowWrapper } from "../components/layout";
import VideoSmall from "../videos/Glyph_App_Short_Video_compressed.mp4";

function PromoVideo() {
  const { t } = useTranslation();

  return (
    <NarrowWrapper>
      <h3 className="pb-10 text-3xl">{t("Promotional Video")}</h3>
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
    </NarrowWrapper>
  );
}

export default PromoVideo;
