import CloseIcon from "@material-ui/icons/Close";
import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";

import { AuthContext } from "../../AuthContext";
import { UserContext } from "../../UserContext";
import { SecondaryButton, TertiaryButton } from "../shared";

Modal.setAppElement("#root");

function DeleteAccountModal() {
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const { userId, setUserId } = useContext(UserContext);
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleDeleteAccount() {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: authenticated,
      },
    }).then((res) => {
      if (res.ok) {
        setIsModalOpen(false);
        setUserId("");
        setAuthenticated("");
      }

      setError(
        t(
          "Something has gone wrong, it was not possible to delete your account",
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
        <div className=" h-full w-full relative p-4">
          <div className="absolute top-0 right-0">
            <button
              className="p-8"
              type="button"
              onClick={() => {
                setIsModalOpen(false);
              }}
            >
              <CloseIcon />
            </button>
          </div>
          <div className="flex items-center justify-center h-full">
            <div>
              <h1 className="text-2xl font-bold text-center my-8">
                {t("Are you sure you want to delete your account?")}
              </h1>
              <p className="text-center my-8">
                {t(
                  "Please note that we will delete any and all personal information that has been collected. Any rules that you have made so far will be retained.",
                )}
              </p>
              <div className="flex ">
                <div className="mr-8 flex-grow">
                  <SecondaryButton
                    onClick={() => {
                      setIsModalOpen(false);
                    }}
                  >
                    {t("No")}
                  </SecondaryButton>
                </div>
                <div className="flex-grow">
                  <TertiaryButton onClick={() => handleDeleteAccount()}>
                    {t("Yes")}
                  </TertiaryButton>
                </div>
              </div>
              {error && (
                <div className="text-red-500 text-center py-2">{error}</div>
              )}
            </div>
          </div>
        </div>
      </Modal>
      <div className="block sm:flex">
        <div>
          <TertiaryButton
            onClick={() => {
              setIsModalOpen(!isModalOpen);
            }}
          >
            {t("Delete my account")}
          </TertiaryButton>
        </div>
      </div>
    </>
  );
}

export default DeleteAccountModal;
