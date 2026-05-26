import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";

import { NarrowWrapper } from "../components/layout";
import { PrimaryButton } from "../components/shared";

function ResetPassword() {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState(null);
  const { token } = useParams();

  const [isPasswordVisible, setPasswordInvisible] = useState(false);

  const [isFirstPage, setIsFirstPage] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!newPassword) {
      return setError(t("Failed to reset your password, please try again.."));
    }

    try {
      fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/password/reset`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword, token }),
      }).then((response) => {
        if (response.ok) {
          setIsFirstPage(false);
        }

        if (!response.ok) {
          setError(t("something went wrong."));
        }
      });
    } catch (error) {
      setError(t("something went wrong."));
    }
  };

  return (
    <NarrowWrapper>
      {isFirstPage && (
        <form onSubmit={handleSubmit}>
          <h3 className="pb-10 text-3xl">{t("Create a new password")}</h3>
          <div className="flex flex-col py-4">
            <label htmlFor="new-password">{t("Password")}</label>
            <div className="relative">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="new-password"
                className="w-full"
                autoComplete="new-password"
                name="new-password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="absolute right-0 top-0 h-full flex items-center ">
                <button
                  aria-label={t("toggle password visibility")}
                  className="p-4 hover:underline"
                  type="button"
                  aria-pressed={isPasswordVisible}
                  onClick={() => setPasswordInvisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? t("Hide password") : t("Show password")}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-center pb-2">
              <p>{error}</p>
            </div>
          )}
          <div className="flex flex-col py-4">
            <PrimaryButton type="submit">{t("Continue")}</PrimaryButton>
          </div>
        </form>
      )}

      {!isFirstPage && (
        <>
          <h3 className="pb-10 text-3xl">{t("You've set a new password")}</h3>
          <div className="text-center py-2">
            <Link to="/signin" className="text-primary">
              <PrimaryButton>{t("Sign In")}</PrimaryButton>
            </Link>
          </div>
        </>
      )}
    </NarrowWrapper>
  );
}

export default ResetPassword;
