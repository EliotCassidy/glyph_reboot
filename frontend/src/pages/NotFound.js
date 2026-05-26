import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { NarrowWrapper } from "../components/layout";
import { PrimaryButton } from "../components/shared";

function NotFound() {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <NarrowWrapper>
      <h3 className="pb-10 text-3xl">{t("Not found")}</h3>
      <p className="pb-4">
        {t("Sorry, we couldn't find the page you were looking for.")}
      </p>
      <div className="flex flex-col py-4">
        <PrimaryButton onClick={() => history.push("/")}>
          {t("Continue")}
        </PrimaryButton>
      </div>
    </NarrowWrapper>
  );
}

export default NotFound;
