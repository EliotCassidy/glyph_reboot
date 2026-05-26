import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import isEmail from "validator/lib/isEmail";

import { NarrowWrapper } from "../components/layout";
import { PrimaryButton } from "../components/shared";

function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);

  const [isFirstPage, setIsFirstPage] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      return setError(t("Something's missing. Please check and try again."));
    }

    if (!isEmail(email)) {
      return setError(
        t(
          "Sorry, that email doesn’t look right. Please check it's a proper email.",
        ),
      );
    }

    try {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/users/password/forgot`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      ).then((response) => {
        if (response.ok) {
          setIsFirstPage(false);
        }

        if (response.status >= 500) {
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
          <h3 className="pb-10 text-3xl">{t("Forgot Password")}</h3>
          <p className="pb-4">
            {t(
              "Enter the email you used to register with and we'll send you a link to reset your password.",
            )}
          </p>
          <div className="flex flex-col py-4">
            <label htmlFor="email">{t("Email")}</label>
            <input
              type="text"
              id="email"
              className={error && "border-red-500"}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
            />
          </div>
          {error && (
            <div className="text-red-500 text-center pb-2">
              <p>{error}</p>
            </div>
          )}
          <div className="flex flex-col py-4">
            <PrimaryButton type="submit">
              {t("Send password reset email")}
            </PrimaryButton>
          </div>

          <div className="text-center py-2">
            <Link to="/signup" className="text-primary">
              {t("Cancel")}
            </Link>
          </div>
        </form>
      )}

      {!isFirstPage && (
        <>
          <h3 className="pb-10 text-3xl">{t("Please check your inbox")}</h3>
          <p className="pb-4">
            {t(
              "Click the link in the email we've just sent to reset your password. It may take a few minutes to arrive.",
            )}
          </p>

          <p className="pb-4">{t("Can't find it? Check your spam folder.")}</p>
        </>
      )}
    </NarrowWrapper>
  );
}

export default ForgotPassword;
