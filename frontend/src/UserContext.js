import { CircularProgress } from "@material-ui/core";
import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

import { AuthContext } from "./AuthContext";

export const UserContext = createContext({
  user: { totalPoints: 0 },
  userId: "",
  setUserId: (value) => {},
  setUser: (value) => {},
  refreshUser: () => {},
  isAdmin: false,
});

export const UserContextProvider = ({ children }) => {
  const getUserId = () => {
    const userIdString = localStorage.getItem("userId");
    return JSON.parse(userIdString) || "";
  };
  const { authenticated, setAuthenticated } = useContext(AuthContext);

  const [userId, setUserId] = useState(getUserId());
  const [user, setUser] = useState();
  const [isAdmin, setIsAdmin] = useState();
  const [initialized, setInitialized] = useState(false);

  const saveUserId = (userId) => {
    localStorage.setItem("userId", JSON.stringify(userId));
    setUserId(userId);
  };

  const fetchUser = useCallback(async () => {
    const result = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/v1/users/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: authenticated,
        },
      },
    ).then((response) => response.json());

    if (result.error) {
      saveUserId("");
      setIsAdmin(false);
      setInitialized(false);
      setAuthenticated("");
    }

    if (result.user) {
      setUser(result.user);
      setIsAdmin(result.user.role !== "user");
      setInitialized(true);
    }
  }, [userId, authenticated, setAuthenticated]);

  useEffect(() => {
    if (authenticated && userId) {
      fetchUser();
    }
  }, [authenticated, fetchUser, userId]);

  if (authenticated && !initialized) {
    return (
      <div className="flex align-center justify-center my-16">
        <CircularProgress />
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId: saveUserId,
        user,
        setUser,
        refreshUser: fetchUser,
        isAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
