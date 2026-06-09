import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { NarrowWrapper } from "../components/layout";

function TermsAndConditions() {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <NarrowWrapper>
      <button onClick={history.goBack} className="text-primary text-xl mb-10">
        {t("Back")}
      </button>
      <div className="">
        <h3 className="pb-10 text-4xl font-bold">
          {t("Terms and Conditions")}
        </h3>
        <p className="my-4">
          {t(
            "By playing this game, you agree to take part in this research and understand the following terms and conditions",
          )}
          :
        </p>
        <ol className="list-decimal browser-default list-inside">
          <li className="my-4">
            {t(
              "I understand that my participation is voluntary and that I am free to withdraw at any time during the game, without giving any reason, and without any adverse consequences.",
            )}
          </li>
          <li className="my-4">
            {t(
              "I understand that data collected during the game (i.e., my alias and game movements) will be accessible to the researchers conducting this project and will be made open access after an initial embargo period. I understand that my data will be stored anonymously in compliance with the EU General Data Protection Regulation.",
            )}
          </li>
          <li className="my-4">
            {t(
              "I understand that the data will be used for publication in scientific journals as well as presentations at conferences.",
            )}
          </li>
          <li className="my-4">
            {t(
              "I understand that I can raise a concern or make a complaint by sending an email to",
            )}{" "}
            <a
              className="text-primary hover:underline"
              href="mailto:glyph.science@proton.me"
            >
              {/* eslint-disable i18next/no-literal-string */}
              glyph.science@proton.me
              {/* eslint-enable */}
            </a>
          </li>
        </ol>
      </div>
    </NarrowWrapper>
  );
}

export default TermsAndConditions;
