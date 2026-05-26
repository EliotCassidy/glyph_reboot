import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";

import { AuthContext } from "../../AuthContext";
import { UserContext } from "../../UserContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { authenticated } = useContext(AuthContext);
  const { user } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (authenticated && user?.age) {
          return <Component {...props} />;
        }

        if (authenticated) {
          return (
            <Redirect
              to={{
                pathname: "/signup",
                state: { from: props.location, isMissingAge: true },
              }}
            />
          );
        }

        return (
          <Redirect
            to={{ pathname: "/signin", state: { from: props.location } }}
          />
        );
      }}
    />
  );
};

export default PrivateRoute;
