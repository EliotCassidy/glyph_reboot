import CircularProgress from "@material-ui/core/CircularProgress";
import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { AuthContext } from "../AuthContext";
import { NarrowWrapper } from "../components/layout";
import { DeleteAccountModal } from "../components/partials";
import { PrimaryButton } from "../components/shared";
import { UserContext } from "../UserContext";

function AccountSettings() {
  const { t } = useTranslation();
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const { userId, setUserId, setUser } = useContext(UserContext);

  const [userNameError, setUserNameError] = useState(null);
  const [newUserName, setNewUserName] = useState();
  const [isEditable, setIsEditable] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [error, setError] = useState(null);

  function submitNewUserName(e) {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/${userId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authenticated,
      },
      body: JSON.stringify({
        ...currentUser,
        username: newUserName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.error) {
          setUserNameError(data.error.message);
        }

        if (data.user) {
          setCurrentUser(data.user);
          setUser(data.user);
          setIsEditable(false);
        }
      });
  }

  useEffect(() => {
    const fetchUser = async (userId) => {
      setIsLoading(true);
      setError(false);
      try {
        const result = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/users/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: authenticated,
            },
          },
        ).then((response) => response.json());

        if (result.user) {
          setCurrentUser(result.user);
          setNewUserName(result.user.username);
        }
      } catch (error) {
        setError(error);
      }

      setIsLoading(false);
    };

    if (authenticated && userId) {
      fetchUser(userId);
    }
  }, [authenticated, userId, setCurrentUser]);

  if (isLoading) {
    return (
      <div className="flex align-center justify-center my-16">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <NarrowWrapper>
        <div className="text-red-500 text-center py-2">{error}</div>
      </NarrowWrapper>
    );
  }

  return (
    <NarrowWrapper>
      <h3 className="pb-10 text-3xl">{t("Account Settings")}</h3>

      <p>{t("Username")}</p>
      <div className="flex items-center mb-4 flex-wrap">
        <p className={`text-2xl  pl-3 ${isEditable ? "hidden" : "block"}`}>
          {currentUser.username}
        </p>
        <input
          value={newUserName}
          type="text"
          className={`pr-3 ${isEditable ? "block" : "hidden"}`}
          onChange={(e) => {
            setNewUserName(e.target.value);
          }}
        />
        <button
          onClick={() => setIsEditable(true)}
          className={`flex underline px-3 hover:text-primary ${
            isEditable ? "hidden" : "block"
          }`}
        >
          {t("Edit")}
        </button>
        <div className="flex">
          <button
            className={`flex underline px-3 hover:text-primary ${
              isEditable ? "block" : "hidden"
            }`}
            disabled={newUserName === currentUser.username}
            onClick={(e) => submitNewUserName(e)}
          >
            {t("Save")}
          </button>
          {isEditable && (
            <button
              onClick={() => setIsEditable(false)}
              className="flex underline hover:text-primary"
            >
              {t("Cancel")}
            </button>
          )}
        </div>
      </div>

      {userNameError && (
        <p className="text-red-500 text-center my-2">{userNameError}</p>
      )}

      <p>{t("Email")}</p>
      <p className="text-2xl mb-4 pl-3">{currentUser.email}</p>

      <div className="mb-4 block sm:flex">
        <div>
          <PrimaryButton
            onClick={() => {
              setUserId("");
              setAuthenticated("");
            }}
          >
            {t("Sign out")}
          </PrimaryButton>
        </div>
      </div>
      <DeleteAccountModal />
    </NarrowWrapper>
  );
}

export default AccountSettings;
