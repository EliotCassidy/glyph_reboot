import CircularProgress from "@material-ui/core/CircularProgress";
import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import { AuthContext } from "../AuthContext";
import { NarrowWrapper } from "../components/layout";
import ScriptForm from "../components/partials/ScriptForm";
import { PrimaryButton } from "../components/shared";
import useFetchScript from "../hooks/useFetchScript";

function buildFormData(script) {
  return {
    name: script.name,
    enabled: script.enabled,
    isoNumber: script.isoNumber,
    isoCode: script.isoCode,
    family: script.family,
    ancestor: script.ancestor,
    place: script.place,
    scriptType: script.scriptType,
    pointsToUnlock: script.pointsToUnlock,
    characters: script.unicode.map((unicode, index) => ({
      utf_8: script.utf_8[index],
      unicode: unicode,
      html: script.html[index],
    })),
  };
}

function EditScript() {
  const { t } = useTranslation();
  const { scriptId } = useParams();
  const history = useHistory();

  const { authenticated } = useContext(AuthContext);

  const [formError, setFormError] = useState(null);

  const { data, isLoading, error } = useFetchScript(scriptId);

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (data) {
      setFormData(buildFormData(data));
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    if (
      !formData.name ||
      !formData.isoNumber ||
      !formData.isoCode ||
      !formData.family ||
      !formData.ancestor ||
      !formData.place ||
      !formData.scriptType ||
      isNaN(formData.pointsToUnlock) ||
      formData.characters.length === 0
    ) {
      return setFormError(t("All fields are required"));
    }

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/scripts/${scriptId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authenticated,
      },
      body: JSON.stringify({
        name: formData.name,
        enabled: formData.enabled,
        isoNumber: formData.isoNumber,
        isoCode: formData.isoCode,
        family: formData.family,
        ancestor: formData.ancestor,
        place: formData.place,
        scriptType: formData.scriptType,
        pointsToUnlock: formData.pointsToUnlock,
        unicode: formData.characters.map((character) => character.unicode),
        utf_8: formData.characters.map((character) => character.utf_8),
        html: formData.characters.map((character) => character.html),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.updatedScript) {
          return history.push("/admin");
        }

        if (data.error) {
          return setFormError(data.error.message);
        }
      })
      .catch((error) => {
        setFormError(t("Something went wrong."));
      });
  };

  if (isLoading) {
    return (
      <div className="flex align-center justify-center my-16">
        <CircularProgress />
      </div>
    );
  }

  if (!data || error) {
    return (
      <NarrowWrapper>
        <div className="text-red-500 text-center py-2">{error}</div>
      </NarrowWrapper>
    );
  }

  return (
    <NarrowWrapper>
      <button onClick={history.goBack} className="text-primary text-xl mb-10">
        {t("Back")}
      </button>
      <h3 className="pb-10 text-4xl font-bold">{t("Edit script")}</h3>
      <form onSubmit={handleSubmit}>
        <ScriptForm value={formData} onChange={setFormData} />

        {formError && (
          <div className="text-red-500 text-center py-2">
            <p> {formError} </p>
          </div>
        )}

        <div className="flex flex-col py-4">
          <PrimaryButton type="submit">{t("Save Changes")}</PrimaryButton>
        </div>
      </form>
    </NarrowWrapper>
  );
}

export default EditScript;
