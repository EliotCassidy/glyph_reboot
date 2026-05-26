import CircularProgress from "@material-ui/core/CircularProgress";
import CreateIcon from "@material-ui/icons/Create";
import { useState, useEffect, useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, Link } from "react-router-dom";

import { AuthContext } from "../AuthContext";
import { DeleteScriptModal } from "../components/partials";
import { PrimaryButton } from "../components/shared";

function Admin() {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const { authenticated } = useContext(AuthContext);
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [scripts, setScripts] = useState([]);

  function handleDownloadAllScriptData() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/download/scripts`, {
      method: "GET",
      headers: {
        Authorization: authenticated,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "all-script-data.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  }

  function handleDownloadRulesForScriptData(scriptName, scriptId) {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/v1/download/rules/${scriptId}`,
      {
        method: "GET",
        headers: {
          Authorization: authenticated,
        },
      },
    )
      .then((response) => response.blob())
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = `all-rules-for-${scriptName}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  }

  function handleDownloadAllUserData() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/download/users`, {
      method: "GET",
      headers: {
        Authorization: authenticated,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "all-user-data.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  }

  function handleDownloadAllRuleData() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/download/rules`, {
      method: "GET",
      headers: {
        Authorization: authenticated,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "all-rule-data.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  }

  function handleStatusUpdate(enabled, id) {
    const newStatus = !enabled;

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/scripts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authenticated,
      },
      body: JSON.stringify({
        enabled: newStatus,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.updatedScript) {
          fetchScripts();
        }

        if (data.error) {
          setError(data.error.message);
        }
      });
  }

  const fetchScripts = useCallback(async () => {
    setIsLoading(true);
    setError(false);
    try {
      const result = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/scripts/all`,
        {
          method: "GET",
          headers: {
            Authorization: authenticated,
          },
        },
      ).then((response) => response.json());

      if (result.scripts) {
        setScripts(result.scripts);
      }
    } catch (error) {
      setError(error);
    }

    setIsLoading(false);
  }, [authenticated]);

  useEffect(() => {
    fetchScripts();
  }, [fetchScripts]);

  if (isLoading) {
    return (
      <div className="flex align-center justify-center my-16">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 px-4">
      <h2 className="pb-10 text-4xl font-bold">{t("Admin")}</h2>
      <div className="flex flex-col md:flex-row mb-12">
        <div className="m-2">
          <PrimaryButton onClick={handleDownloadAllScriptData}>
            {t("Download All Script Data")}
          </PrimaryButton>
        </div>
        <div className="m-2">
          <PrimaryButton onClick={handleDownloadAllRuleData}>
            {t("Download All Rule Data")}
          </PrimaryButton>
        </div>
        <div className="m-2">
          <PrimaryButton onClick={handleDownloadAllUserData}>
            {t("Download All User Data")}
          </PrimaryButton>
        </div>
      </div>
      <div className="flex justify-between">
        <h2 className="pb-10 text-4xl font-bold">{t("All scripts")}</h2>
        <div>
          <PrimaryButton onClick={() => history.push("/script/new")}>
            {t("Add new script")}
          </PrimaryButton>
        </div>
      </div>
      {error && <p className="text-red-500 text-center py-2">{error}</p>}
      <table className="w-full">
        <thead>
          <tr>
            <th>{t("Script name")}</th>
            <th></th>
            <th>{t("Status")}</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {scripts.map((script) => {
            const { name, _id, enabled } = script;
            return (
              <tr key={name} className="hover:bg-highlight">
                <td>{t(name)}</td>
                <td>
                  <Link to={`/script/edit/${_id}`} title={t("Edit script")}>
                    <CreateIcon />
                  </Link>
                </td>
                <td>
                  <input
                    type="checkbox"
                    aria-label="status"
                    className="text-primary"
                    name="status"
                    onChange={() => {
                      handleStatusUpdate(!!enabled, _id);
                    }}
                    checked={enabled}
                  />
                </td>
                <td>
                  <button
                    className="text-primary hover:underline"
                    onClick={() => handleDownloadRulesForScriptData(name, _id)}
                  >
                    {t("Download rules for script")}
                  </button>
                </td>
                <td>
                  <DeleteScriptModal
                    scriptId={_id}
                    fetchScripts={fetchScripts}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default Admin;
