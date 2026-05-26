import CircularProgress from "@material-ui/core/CircularProgress";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";

import { AuthContext } from "../AuthContext";
import RuleEditor from "../components/partials/RuleEditor";
import useFetchRule from "../hooks/useFetchRule";

const TIMER_RESET_REFRESH_RATE_MS = 15000;

function EditRule() {
  const { ruleId } = useParams();
  const { authenticated } = useContext(AuthContext);
  const history = useHistory();
  const { t } = useTranslation();

  const { data, isLoading, error } = useFetchRule(ruleId);
  const [queryError, setQueryError] = useState(null);

  /* Updates the rule's description with the same value just to refresh the updatedAt field, 
  thus resetting the count down of the rule */
  const touchRule = useCallback(() => {
    if (!data) return;

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/rules/${ruleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authenticated,
      },
      body: JSON.stringify({
        description: data.rule.description,
      }),
    }).then();
  }, [authenticated, ruleId, data]);

  useEffect(() => {
    touchRule();
    const handle = setInterval(touchRule, TIMER_RESET_REFRESH_RATE_MS);

    return () => clearInterval(handle);
  }, [touchRule]);

  const handleSubmit = (formData) => {
    setQueryError(false);
    try {
      /* TODO Only send changed data, also prevent sending the query when no data is changed */
      fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/rules/${ruleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authenticated,
        },
        body: JSON.stringify({
          description: formData.description,
          ruleBinary: formData.ruleBinary.join(""),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.rule) {
            return history.push(`/rules/${data.rule.script}`);
          }
          if (data.error) {
            if (
              data.error.message ===
              "Rules validation failed: ruleBinary: Rule already exists"
            ) {
              return setQueryError(
                t(
                  "You've already used these exact letters for a different rule! Can you think of a different rule that would select other characters?",
                ),
              );
            }
            return setQueryError(data.error.message);
          }
        });
    } catch (error) {
      setQueryError(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex align-center justify-center my-16 flex">
        <CircularProgress />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex align-center justify-center my-16 flex">
        {t("Script not found")}
      </div>
    );
  }

  return (
    <>
      <div className="my-8 flex flex-wrap justify-between items-center container mx-auto px-4">
        <span className="flex flex-nowrap items-center md:text-xl">
          <Link to={`/`} className="flex" title={t("Home")}>
            {t("Home")}
          </Link>{" "}
          <KeyboardArrowRightIcon fontSize="large" />{" "}
          <Link
            to={`/rules/${data.script._id}`}
            className="flex items-center"
            title={t("Rules")}
          >
            <span
              className={`capitalize ${
                data.script.name === "Afaka" ? "afaka-font" : "script-font"
              }`}
              dangerouslySetInnerHTML={{
                __html: data.script.html.slice(-5).join(""),
              }}
            ></span>
            {data.script.name && (
              <span className="text-sm ml-2">({t(data.script.name)})</span>
            )}
          </Link>
          <KeyboardArrowRightIcon fontSize="large" />
        </span>
      </div>
      <RuleEditor
        id={ruleId}
        scriptId={data.script._id}
        scriptName={data.script.name}
        html={data.script.html}
        initialValue={{
          description: data.rule.description,
          ruleBinary: data.rule.ruleBinary
            .split("")
            .map((value) => (value === "1" ? 1 : 0)),
        }}
        onSubmit={handleSubmit}
        error={queryError}
      />
    </>
  );
}

export default EditRule;
