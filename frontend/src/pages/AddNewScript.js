import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../AuthContext";
import { NarrowWrapper } from "../components/layout";
import ScriptForm from "../components/partials/ScriptForm";
import { PrimaryButton } from "../components/shared";

function AddNewScript() {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null);

  const history = useHistory();

  const { t } = useTranslation();

  const { authenticated } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.name ||
      !formData.isoNumber ||
      !formData.isoCode ||
      !formData.family ||
      !formData.ancestor ||
      !formData.place ||
      !formData.scriptType ||
      !formData.characters ||
      isNaN(formData.pointsToUnlock) ||
      formData.characters.length === 0
    ) {
      return setError(t("All fields are required"));
    }

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/scripts`, {
      method: "POST",
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
        if (data.createdScript) {
          return history.push("/admin");
        }

        if (data.error) {
          return setError(data.error.message);
        }
      })
      .catch((error) => {
        setError(t("Something went wrong."));
      });
  };

  return (
    <NarrowWrapper>
      <button onClick={history.goBack} className="text-primary text-xl mb-10">
        {t("Back")}
      </button>
      <h3 className="pb-10 text-4xl font-bold">{t("Add new script")}</h3>
      <form onSubmit={handleSubmit}>
        <ScriptForm value={formData} onChange={setFormData} />

        {error && (
          <div className="text-red-500 text-center py-2">
            <p> {error} </p>
          </div>
        )}

        <div className="flex flex-col py-4">
          <PrimaryButton type="submit">{t("Add new script")}</PrimaryButton>
        </div>
      </form>
    </NarrowWrapper>
  );
}

export default AddNewScript;
