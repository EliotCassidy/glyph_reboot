import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../AuthContext";

const useFetchRule = (ruleId) => {
  const { authenticated } = useContext(AuthContext);
  const [response, setResponse] = useState({
    data: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    const fetchRule = async () => {
      setResponse((prev) => ({ ...prev, isLoading: true }));

      try {
        const ruleResult = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/rules/${ruleId}`,
          {
            method: "GET",
            headers: {
              Authorization: authenticated,
            },
          },
        ).then((response) => response.json());

        const scriptResult = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/scripts/${ruleResult.rule?.script}`,
          {
            method: "GET",
            headers: {
              Authorization: authenticated,
            },
          },
        ).then((response) => response.json());

        setResponse({
          data: { rule: ruleResult.rule, script: scriptResult.script },
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

    fetchRule();
  }, [authenticated, ruleId]);

  return response;
};

export default useFetchRule;
