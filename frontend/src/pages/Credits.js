import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { NarrowWrapper } from "../components/layout";

function Credits() {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <NarrowWrapper>
      <button onClick={history.goBack} className="text-primary text-xl mb-10">
        {t("Back")}
      </button>
      <div>
        <h3 className="pb-10 text-4xl font-bold">{t("Credits")}</h3>
        <p className="my-4">{t("Glyph was developed by the authors and contributors listed below.")}</p>
        <ul className="list-disc list-inside my-4">
          <li>Max Planck Institute — The Mint Group</li>
          <li>PSL Scripta</li>
          <li>Development and design contributors</li>
        </ul>
        <p className="my-4">{t("Contact")}: <a className="text-primary hover:underline" href="mailto:glyph.science@proton.me">glyph.science@proton.me</a></p>
      </div>
    </NarrowWrapper>
  );
}

export default Credits;
