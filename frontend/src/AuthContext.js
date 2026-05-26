import { createContext, useState } from "react";

export const AuthContext = createContext({
  authenticated: false,
  setAuthenticated: (value) => {},
});

export const AuthContextProvider = ({ children }) => {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");

    return tokenString;
  };

  const [authenticated, setAuthenticated] = useState(getToken());

  const saveToken = (userToken) => {
    localStorage.setItem("token", userToken);
    setAuthenticated(userToken);
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, setAuthenticated: saveToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
