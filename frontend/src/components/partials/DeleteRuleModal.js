import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";

import { AuthContext } from "../../AuthContext";
import { TertiaryButton } from "../shared";

Modal.setAppElement("#root");

function DeleteRuleModal({ ruleId, fetchRules }) {
  const { authenticated } = useContext(AuthContext);
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleDeleteRule() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/rules/${ruleId}`, {
      method: "DELETE",
      headers: {
        Authorization: authenticated,
      },
    }).then((res) => {
      if (res.ok) {
        setIsModalOpen(false);
        fetchRules();
      }

      setError(
        t("Something has gone wrong, it was not possible to delete this rule"),
      );
    });
  }

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        className="inset-5 sm:inset-10 absolute bg-white rounded-lg"
        overlayClassName="bg-black fixed inset-0 bg-opacity-75"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <div className="h-full w-full relative p-4">
          <div className="flex items-center justify-center h-full">
            <div className="flex-col">
              <h1 className="text-2xl font-bold text-center my-8">
                {t("Are you sure you want to delete this rule?")}
              </h1>
              <div className="flex justify-center">
                <TertiaryButton onClick={() => handleDeleteRule()}>
                  {t("Delete Rule")}
                </TertiaryButton>
              </div>
              {error && (
                <div className="text-red-500 text-center py-2">{error}</div>
              )}
            </div>
            <div className="absolute top-0 right-0">
              <button className="p-8">
                <CloseIcon
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="flex items-center"
        title={t("Delete this rule")}
        aria-label={t("Delete this rule")}
      >
        <DeleteIcon />
        <span className="text-lg ml-0.5">{t("Delete")}</span>
      </button>
    </>
  );
}

export default DeleteRuleModal;
