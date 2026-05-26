import ClearIcon from "@material-ui/icons/Clear";
import Info from "@material-ui/icons/Info";
import i18next from "i18next";
import { Trans, useTranslation } from "react-i18next";

import Star from "../../assets/ic_star.svg";
import Tooltip from "../shared/Tooltip";

const ordinalRules = {
  de: {
    rules: new Intl.PluralRules("de", { type: "ordinal" }),
    suffixes: {
      other: ".",
    },
  },
  en: {
    rules: new Intl.PluralRules("en", { type: "ordinal" }),
    suffixes: {
      one: "st",
      two: "nd",
      few: "rd",
      other: "th",
    },
  },
  es: {
    rules: new Intl.PluralRules("es", { type: "ordinal" }),
    suffixes: {
      other: "o",
    },
  },
  fr: {
    rules: new Intl.PluralRules("fr", { type: "ordinal" }),
    suffixes: {
      one: "er",
      other: "ème",
    },
  },
  it: {
    rules: new Intl.PluralRules("it", { type: "ordinal" }),
    suffixes: {
      other: "o",
      many: "o",
    },
  },
  ja: {
    rules: new Intl.PluralRules("ja", { type: "ordinal" }),
    suffixes: {
      other: "目",
    },
  },
  ru: {
    rules: new Intl.PluralRules("ru", { type: "ordinal" }),
    suffixes: {
      other: "",
    },
  },
};

function suffix(locale, number) {
  const suffix =
    ordinalRules[locale].suffixes[ordinalRules[locale].rules.select(number)];
  return suffix;
}

function LeaderBoardHeader({
  totalPoints,
  uniqueRuleCount,
  position,
  testedRuleCount,
  passedRuleCount,
  username,
}) {
  const { t } = useTranslation();

  const numberFormat = new Intl.NumberFormat(i18next.language);
  const rules = Array.from(new Array(uniqueRuleCount)).fill(null);
  return (
    <div className="text-white flex flex-col md:flex-row flex-nowrap justify-evenly md:items-center mb-8 bg-primary rounded-lg py-8 px-4 text-center md:text-left">
      <div className="py-2 flex justify-center">
        <div className="flex items-center justify-center rounded-full bg-black h-24 w-24 text-white text-4xl font-bold capitalize">
          {username.split("")[0]}
        </div>
      </div>
      <div className="flex flex-col py-2 flex-shrink-0">
        <p>
          <Trans
            i18nKey="X Overall"
            defaults="<bold>{{rank}}<super>{{suffix}}</super></bold> Overall"
            values={{
              rank: position,
              suffix: suffix(i18next.language, position),
            }}
            components={{ bold: <strong />, super: <sup /> }}
          />
        </p>
        <p>
          {t("X Rules Played", {
            count: testedRuleCount,
          })}
        </p>
        <p>
          {t("X Rules Passed", {
            count: passedRuleCount,
          })}
        </p>
      </div>
      <div className="flex flex-col py-2">
        {rules.length > 0 && (
          <>
            <Tooltip
              title={t("These are rules that you were the first to propose.")}
              enterTouchDelay={100}
            >
              <p className="mb-1">
                {t("Unique Rules")}
                <Info className="ml-2" />
              </p>
            </Tooltip>
            <div className="flex items-center justify-center">
              <img src={Star} alt="star" className="mr-1 w-10 h-10" />
              <span className="text-xl">
                <ClearIcon fontSize="small" /> {rules.length}
              </span>
            </div>
          </>
        )}
        {rules.length === 0 && <p>{t("No unique rules yet")}</p>}
      </div>
      <div className="flex flex-col py-2 flex-shrink-0">
        <span className="">{t("Total Points")}</span>
        <span className="text-6xl font-bold">
          {totalPoints && numberFormat.format(totalPoints)}
        </span>
      </div>
    </div>
  );
}

export default LeaderBoardHeader;
