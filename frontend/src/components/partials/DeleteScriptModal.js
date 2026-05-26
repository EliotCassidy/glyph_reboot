import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";

import { AuthContext } from "../../AuthContext";
import { SecondaryButton, TertiaryButton } from "../shared";

Modal.setAppElement("#root");

function DeleteScriptModal({ scriptId, fetchScripts }) {
  const { authenticated } = useContext(AuthContext);
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleDeleteScript() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/scripts/${scriptId}`, {
      method: "DELETE",
      headers: {
        Authorization: authenticated,
      },
    }).then((res) => {
      if (res.ok) {
        setIsModalOpen(false);
        fetchScripts();
      }

      setError(
        t(
          "Something has gone wrong, it was not possible to delete this script",
        ),
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
        <div className="flex items-center justify-center h-full  p-4">
          <div>
            <div className="flex justify-end">
              <button>
                <CloseIcon onClick={() => closeModal()} />
              </button>
            </div>
            <h1 className="text-2xl font-bold text-center my-8">
              {t("Are you sure you want to delete this script")}
            </h1>
            <p className="text-center my-8">
              {t("This is permanent and can not be reversed")}
            </p>
            <div className="flex ">
              <div className="mr-8 flex-grow">
                <SecondaryButton onClick={() => closeModal()}>
                  {t("No")}
                </SecondaryButton>
              </div>
              <div className="flex-grow">
                <TertiaryButton onClick={() => handleDeleteScript()}>
                  {t("Yes")}
                </TertiaryButton>
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-center py-2">{error}</div>
            )}
          </div>
        </div>
      </Modal>
      <div className="flex">
        <div>
          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            aria-label={t("Delete this script")}
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </>
  );
}

export default DeleteScriptModal;
