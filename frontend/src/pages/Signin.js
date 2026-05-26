import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Link, useHistory } from "react-router-dom";

import { AuthContext } from "../AuthContext";
import { NarrowWrapper } from "../components/layout";
import { PrimaryButton } from "../components/shared";
import { UserContext } from "../UserContext";

function SignIn() {
  const { setUserId } = useContext(UserContext);
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const { t } = useTranslation();
  const [isPasswordVisible, setPasswordInvisible] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      return setError(t("Something's missing. Please check and try again."));
    }

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setUserId(data.user._id);
          setAuthenticated(data.token);
          return;
        }

        if (data.status_code === 401) {
          return setError(t("Check email or password and try again."));
        }
      })
      .catch((error) => {
        setError(t("Something went wrong."));
      });
  };

  if (authenticated) {
    return <Redirect to="/"></Redirect>;
  }
  return (
    <NarrowWrapper>
      <form onSubmit={handleSubmit}>
        <button
          onClick={history.goBack}
          type="button"
          className="text-primary text-xl mb-10"
        >
          {t("Cancel")}
        </button>
        <h3 className="pb-10 text-4xl font-bold">{t("Sign In")}</h3>
        <div className="flex flex-col py-4">
          <label htmlFor="email">{t("Email")}</label>
          <input
            type="email"
            autoComplete="email"
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col py-4">
          <label htmlFor="current-password">{t("Password")}</label>
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="current-password"
              autoComplete="current-password"
              className="w-full"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
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
        <div className="flex flex-col py-4">
          <PrimaryButton type="submit">{t("Sign In")}</PrimaryButton>
        </div>
        {error && <p className="text-red-500 text-center py-2">{error}</p>}
        <div className="text-center py-2">
          <p>
            {t("No account?")}{" "}
            <Link to="/signup" className="text-primary">
              {t("Create one")}
            </Link>
          </p>
        </div>
        <div className="text-center py-2">
          <p>
            <Link to="/forgotPassword" className="text-primary">
              {t("Forgot Password?")}
            </Link>
          </p>
        </div>
      </form>
    </NarrowWrapper>
  );
}

export default SignIn;
