import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../AuthContext";

const useFetchScript = (scriptId) => {
  const { authenticated } = useContext(AuthContext);
  const [response, setResponse] = useState({
    data: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    const fetchScripts = async () => {
      setResponse((prev) => ({ ...prev, isLoading: true }));

      try {
        const result = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/scripts/${scriptId}`,
          {
            method: "GET",
            headers: {
              Authorization: authenticated,
            },
          },
        ).then((response) => response.json());

        setResponse({
          data: result.script,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setResponse({
          data: null,
          isLoading: false,
          error: error.message,
        });
      }
    };

    fetchScripts();
  }, [authenticated, scriptId]);

  return response;
};

export default useFetchScript;
