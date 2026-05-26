import CircularProgress from "@material-ui/core/CircularProgress";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams, Link } from "react-router-dom";

import { AuthContext } from "../AuthContext";
import RuleEditor from "../components/partials/RuleEditor";
import useFetchScript from "../hooks/useFetchScript";

function CreateRule() {
  const { scriptId } = useParams();
  const history = useHistory();
  const { authenticated } = useContext(AuthContext);
  const { t } = useTranslation();

  const { data, isLoading, error } = useFetchScript(scriptId);
  const [queryError, setQueryError] = useState(false);

  const handleSubmit = ({ description, ruleBinary }) => {
    setQueryError(false);
    try {
      fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/rules`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authenticated,
        },
        body: JSON.stringify({
          description,
          scriptId,
          ruleBinary: ruleBinary.join(""),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.createdRule) {
            return history.push(`/rules/${scriptId}`);
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

  const { html, name, _id } = data;

  return (
    <>
      <div className="my-8 flex flex-wrap justify-between items-center container mx-auto px-4">
        <span className="flex flex-nowrap items-center md:text-xl">
          <Link to={`/`} className="flex" title={t("Home")}>
            {t("Home")}
          </Link>{" "}
          <KeyboardArrowRightIcon fontSize="large" />{" "}
          <Link
            to={`/rules/${_id}`}
            className="flex items-center"
            title={t("Rules")}
          >
            <span
              className={`capitalize ${
                name === "Afaka" ? "afaka-font" : "script-font"
              }`}
              dangerouslySetInnerHTML={{ __html: html.slice(-5).join("") }}
            ></span>
            {name && <span className="text-sm ml-2">{t(name)}</span>}
          </Link>
          <KeyboardArrowRightIcon fontSize="large" />
        </span>
      </div>
      <RuleEditor
        html={html}
        onSubmit={handleSubmit}
        error={queryError}
        scriptName={name}
        scriptId={_id}
      />
    </>
  );
}

export default CreateRule;
