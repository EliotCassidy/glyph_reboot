import { kebabCase } from "lodash";
import React, { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { WithContext as ReactTags } from "react-tag-input";

import { AuthContext } from "../AuthContext";
import { NarrowWrapper } from "../components/layout";
import { PrimaryButton } from "../components/shared";
import { UserContext } from "../UserContext";

const KeyCodes = {
  comma: 188,
  enter: [10, 13],
  tab: 9,
};

const delimiters = [KeyCodes.comma, ...KeyCodes.enter, KeyCodes.tab];

function SignUp({ location }) {
  const { state } = location;
  const { userId, setUserId, user, setUser, isAdmin } = useContext(UserContext);
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const { t } = useTranslation();
  const history = useHistory();
  const [errors, setErrors] = useState([]);
  const [isSecondPage, setIsSecondPage] = useState(
    authenticated && !user?.age && !isAdmin,
  );
  const [isPasswordVisible, setPasswordInvisible] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [firstLanguage, setFirstLanguage] = useState();
  const [spokenLanguagesLiteracy, setSpokenLanguagesLiteracy] = useState([]);

  const [spokenLanguages, setSpokenLanguages] = useState([]);

  useEffect(() => {
    if (authenticated && isAdmin) {
      history.replace("/home");
      return;
    }

    if (state?.isMissingAge) {
      setIsSecondPage(true);
    }
  }, [authenticated, history, isAdmin, state]);

  const handleTagInputAddition = (setter) => (tag) => {
    setter((prev) => [...prev, tag]);
  };

  const handleTagInputBlur = (getter, setter) => (text) => {
    if (!text?.trim()) return;

    const trimmed = text.trim();
    const id = trimmed.toLowerCase();

    const exists = getter.find((tag) => tag.id === id);
    if (exists) return;

    setter((prev) => [...prev, { id, text: trimmed }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    if (!email || !password || !username) {
      return setErrors([t("Something's missing. Please check and try again.")]);
    }

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/users`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.error?.status > 300) {
          setErrors(data.error.data);
        }
        if (data?.user) {
          setIsSecondPage(true);
          setUserId(data.user._id);
          setAuthenticated(data.token);
        }
      });
  };

  function handleSubmitQuestionnaire(e) {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/${userId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authenticated,
      },
      body: JSON.stringify({
        age: parseInt(age, 10),
        gender,
        firstLanguage,
        spokenLanguages: spokenLanguages.map((language) => language.text),
        spokenLanguagesLiteracy: spokenLanguagesLiteracy.length
          ? spokenLanguagesLiteracy.map((language) => language.text)
          : ["I CAN READ AND WRITE ALL THE LANGUAGES THAT I CAN SPEAK"],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.error) {
          setErrors(data.error.data);
        }

        if (data.user) {
          setUser(data.user);
          history.push("/");
        }
      });
  }

  return (
    <>
      {!isSecondPage && (
        <NarrowWrapper>
          <form onSubmit={handleSubmit}>
            <button
              type="button"
              onClick={history.goBack}
              className="text-primary text-xl mb-10"
            >
              {t("Cancel")}
            </button>
            <h3 className="pb-10 text-4xl font-bold">
              {t("Create an Account")}
            </h3>
            <div className="flex flex-col py-4">
              <label htmlFor="username">{t("Username")}</label>
              <input
                type="text"
                id="username"
                autoComplete="username"
                name="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
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
              <label htmlFor="new-password">{t("Password")}</label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="new-password"
                  className="w-full"
                  name="password"
                  autoComplete="new-password"
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
                    {isPasswordVisible
                      ? t("Hide password")
                      : t("Show password")}
                  </button>
                </div>
              </div>
            </div>
            <p>
              {t("By signing up, you agree to the")}{" "}
              <Link to="/terms-and-conditions" className="text-primary">
                {t("terms and conditions")}
              </Link>
            </p>

            <div className="flex flex-col py-4">
              <PrimaryButton type="submit">
                {t("Create an Account")}
              </PrimaryButton>
            </div>
            {errors && (
              <div className="text-red-500 text-center py-2">
                {errors.map((message) => (
                  <p key={kebabCase(message)}> {t(message)} </p>
                ))}
              </div>
            )}
            <div className="text-center  py-2">
              <p>
                {t("Already have an account?")}{" "}
                <Link to="/signin" className="text-primary">
                  {t("Sign In")}
                </Link>
              </p>
            </div>
          </form>
        </NarrowWrapper>
      )}

      {isSecondPage && (
        <NarrowWrapper>
          <form onSubmit={handleSubmitQuestionnaire}>
            <div className="flex">
              <div className="flex-1  min-w-0 pr-1">
                <div className="flex flex-col py-4">
                  <label htmlFor="age">{t("What is your age?")}</label>
                  <input
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    type="text"
                    id="age"
                    name="age"
                    value={age}
                    required
                    onChange={(e) => {
                      setAge(e.target.value.replace(/[^0-9]/g, ""));
                    }}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0 pl-1">
                <div className="flex flex-col py-4">
                  <label htmlFor="gender">{t("What is your gender?")}</label>
                  <select
                    type="text"
                    className="MuiSelect-select"
                    id="gender"
                    value={gender}
                    required
                    name="gender"
                    onBlur={(e) => setGender(e.target.value)}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="female">{t("Female")}</option>
                    <option value="male">{t("Male")}</option>
                    <option value="non-binary">{t("Non-binary")}</option>
                    <option value="I prefer not to say">
                      {t("I prefer not to say")}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col py-4">
              <label htmlFor="firstLanguage">
                {t("What is your first language?")}
              </label>
              <input
                type="text"
                id="firstLanguage"
                required
                placeholder={t("e.g. English")}
                onChange={(e) => setFirstLanguage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
              />
            </div>
            <div className="flex flex-col py-4">
              <label htmlFor="spokenLanguages">
                {t("What other languages do you speak? (Type and press enter)")}
              </label>
              <ReactTags
                id="spokenLanguages"
                tags={spokenLanguages}
                placeholder={t("e.g. Spanish, Korean.")}
                delimiters={delimiters}
                classNames={{
                  tags: "relative",
                  tagInput: "w-full",
                  tagInputField: "w-full",
                  selected: "selectedClass",
                  tag: "bg-primary text-white rounded-lg pr-2 pl-4 py-2 mr-2 capitalize",
                  remove: "border-0 cursor-pointer text-white p-4",
                  suggestions: "suggestionsClass",
                  activeSuggestion: "activeSuggestionClass",
                  editTagInput: "editTagInputClass",
                  editTagInputField: "editTagInputField",
                  clearAll: "clearAllClass",
                }}
                handleDelete={(i) => {
                  setSpokenLanguages((prev) =>
                    prev.filter((tag, index) => index !== i),
                  );
                }}
                handleAddition={handleTagInputAddition(setSpokenLanguages)}
                handleInputBlur={handleTagInputBlur(
                  spokenLanguages,
                  setSpokenLanguages,
                )}
                inputFieldPosition="bottom"
                allowDragDrop={false}
                autocomplete
                allowDeleteFromEmptyInput={false}
                autofocus={false}
              />
            </div>
            <div
              className={`flex flex-col py-4 ${
                !spokenLanguages ? "opacity-50" : ""
              }`}
            >
              <label htmlFor="spokenLanguagesLiteracy">
                {t(
                  "Is there any language that you can speak but not write? If so, which one? (Type and press enter)",
                )}
              </label>
              <ReactTags
                id="spokenLanguagesLiteracy"
                readOnly={!spokenLanguages}
                tags={spokenLanguagesLiteracy}
                placeholder={t(
                  "I can read and write all the languages that I can speak.",
                )}
                delimiters={delimiters}
                classNames={{
                  tags: "relative",
                  tagInput: "w-full",
                  tagInputField: "w-full",
                  selected: "selectedClass",
                  tag: "bg-primary text-white rounded-lg pr-2 pl-4 py-2 mr-2 capitalize",
                  remove: "border-0 cursor-pointer text-white p-4",
                  suggestions: "suggestionsClass",
                  activeSuggestion: "activeSuggestionClass",
                  editTagInput: "editTagInputClass",
                  editTagInputField: "editTagInputField",
                  clearAll: "clearAllClass",
                }}
                handleDelete={(i) => {
                  setSpokenLanguagesLiteracy((prev) =>
                    prev.filter((tag, index) => index !== i),
                  );
                }}
                handleAddition={handleTagInputAddition(
                  setSpokenLanguagesLiteracy,
                )}
                handleInputBlur={handleTagInputBlur(
                  spokenLanguagesLiteracy,
                  setSpokenLanguagesLiteracy,
                )}
                inputFieldPosition="bottom"
                allowDragDrop={false}
                autocomplete
                allowDeleteFromEmptyInput={false}
                autofocus={false}
              />
            </div>
            <div className="flex flex-col py-4">
              <PrimaryButton type="submit">{t("Next")}</PrimaryButton>
            </div>
          </form>
        </NarrowWrapper>
      )}
    </>
  );
}

export default SignUp;
