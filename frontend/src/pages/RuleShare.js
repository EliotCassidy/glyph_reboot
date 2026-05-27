import CircularProgress from "@material-ui/core/CircularProgress";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import { RuleShareActions } from "../components/partials/RuleShareActions";
import NotFound from "./NotFound";

function RuleShare() {
  const { t } = useTranslation();
  const { ruleId } = useParams();
  const [rule, setRule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchRule = async () => {
      setIsLoading(true);

      try {
        const result = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/rules/public/${ruleId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
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
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRule();
  }, [ruleId]);

  const shareUrl = useMemo(() => {
    if (!rule?._id || typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/share/${rule._id}`;
  }, [rule?._id]);

  const foundLetters = useMemo(() => {
    const scriptLetters = rule?.script?.html || [];
    const binary = rule?.ruleBinary || "";

    return scriptLetters
      .filter((_, index) => binary[index] === "1")
      .map((character, index) => ({ character, index }));
  }, [rule]);

  if (isLoading) {
    return (
      <div className="flex align-center justify-center my-16">
        <CircularProgress />
      </div>
    );
  }

  if (errorMessage || !rule) {
    return <NotFound />;
  }

  const selectedCharacters = foundLetters.length;

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border-3 border-black bg-white shadow-[0_20px_0_rgba(0,0,0,0.14)]">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#596cff] via-[#ff6a00] to-[#111111]" />

        <div className="p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            {t("Public rule page")}
          </p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{rule.description}</h1>

          <div className="mt-6 grid grid-cols-1 gap-4 text-lg sm:grid-cols-3">
            <div className="rounded-2xl border border-black/10 bg-[#f5f6fb] p-4">
              <p className="text-sm uppercase tracking-wide text-gray-500">{t("Score")}</p>
              <p className="mt-1 text-3xl font-semibold">{rule.points}</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[#f5f6fb] p-4">
              <p className="text-sm uppercase tracking-wide text-gray-500">
                {t("Differentiated letters")}
              </p>
              <p className="mt-1 text-3xl font-semibold">{selectedCharacters}</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-[#f5f6fb] p-4">
              <p className="text-sm uppercase tracking-wide text-gray-500">{t("First found")}</p>
              <p className="mt-1 text-3xl font-semibold">
                {rule.isUnique ? t("Yes") : t("No")}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
            <div className="space-y-5 text-base text-gray-700 sm:text-lg">
              <p className="leading-relaxed">
                {rule.isUnique
                  ? t("This rule was the first matching rule proposed for this script.")
                  : t("This rule matched, but it was not the first discovered version.")}
              </p>

              <p>
                {t("Shared by")} {" "}
                <span className="font-semibold capitalize">
                  {rule.user?.username || t("Anonymous")}
                </span>
                {rule.script?.name ? (
                  <>
                    {" "}
                    {t("for")} {" "}
                    <span className="font-semibold">{rule.script.name}</span>
                  </>
                ) : null}
              </p>
            </div>

            <div>
              <RuleShareActions
                rule={rule}
                shareUrl={shareUrl}
                foundLetters={foundLetters}
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4 flex-wrap">
            <Link to="/" className="underline text-primary">
              {t("Back home")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RuleShare;