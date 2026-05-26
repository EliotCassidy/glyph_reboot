import CircularProgress from "@material-ui/core/CircularProgress";
import i18next from "i18next";
import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";

import Crown from "../assets/ic_krown.svg";
import { AuthContext } from "../AuthContext";
import { LeaderBoardHeader } from "../components/partials";
import { UserContext } from "../UserContext";

function LeaderBoardPoints() {
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);
  const { userId } = useContext(UserContext);
  const [user, setUser] = useState();
  const numberFormat = new Intl.NumberFormat(i18next.language);

  const [leaderBoard, setLeaderBoard] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [isLoadingLeaderBoard, setIsLoadingLeaderBoard] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchLeaderBoard = async () => {
      const result = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/users/leaderboard`,
        {
          method: "GET",
          headers: {
            Authorization: authenticated,
          },
        },
      ).then((response) => response.json());

      setLeaderBoard(result.leaderboard);
      setUserStats(result.userStats);
    };

    const fetchUser = async (userId) => {
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
        setUser(result.user);
      }
    };

    fetchLeaderBoard();

    if (authenticated && userId) {
      fetchUser(userId);
    }
    setIsLoadingLeaderBoard(false);
    setIsLoadingUser(false);
  }, [authenticated, userId, setUser]);

  if (isLoadingLeaderBoard && isLoadingUser) {
    return (
      <div className="flex align-center justify-center my-16">
        <CircularProgress />
      </div>
    );
  }

  if (user && leaderBoard) {
    return (
      <div className="container mx-auto my-8 px-4">
        <h2 className="pb-10 text-4xl font-bold">{t("Leaderboard")}</h2>
        <LeaderBoardHeader {...userStats} username={user.username} />
        <div className="flex justify-center">
          <table className="w-full table-fixed sm:table-auto max-w-screen-md">
            <thead>
              <tr>
                <th className="w-7 sm:w-auto"></th>
                <th className="text-left break-words">{t("Username")}</th>
                <th className="text-left break-words">{t("Unique Rules")}</th>
                <th className="text-left break-words">{t("Total Score")}</th>
              </tr>
            </thead>
            <tbody>
              {leaderBoard.map((row, index) => (
                <tr
                  key={`${row.username}-${index}`}
                  className={`odd:bg-gray-50 ${
                    user.username === row.username ? "bg-highlight" : ""
                  }`}
                >
                  <td className="py-2 text-center w-7 sm:w-auto">
                    {index === 0 ? (
                      <img
                        src={Crown}
                        alt={t("first place")}
                        className="inline-block"
                      />
                    ) : (
                      index + 1
                    )}
                  </td>
                  <td className="flex items-center py-2">
                    <div className="mr-4 hidden sm:flex items-center justify-center rounded-full bg-black h-12 w-12 text-white text-xl font-bold capitalize flex-shrink-0">
                      <span> {row.username.split("")[0]}</span>
                    </div>
                    <span className="truncate">{row.username}</span>
                  </td>
                  <td className="py-2">{row.uniqueRuleCount}</td>
                  <td className="py-2">
                    {row.totalPoints && numberFormat.format(row.totalPoints)}
                  </td>
                </tr>
              ))}
              {userStats.position > 10 && (
                <tr className="bg-highlight">
                  <td className="py-2 text-center w-7 sm:w-auto">
                    {userStats.position}
                  </td>
                  <td className="flex items-center py-2">
                    <div className="mr-4 hidden sm:flex items-center justify-center rounded-full bg-black h-12 w-12 text-white text-xl font-bold capitalize flex-shrink-0">
                      <span>{user.username.split("")[0]}</span>
                    </div>
                    <span className="truncate">{user.username}</span>
                  </td>
                  <td className="py-2">{userStats.uniqueRuleCount}</td>
                  <td className="py-2">
                    {userStats.totalPoints &&
                      numberFormat.format(userStats.totalPoints)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return null;
}

export default LeaderBoardPoints;
