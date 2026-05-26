import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";

import { UserContext } from "../../UserContext";

const AdminRoute = ({ component: Component, ...rest }) => {
  const { isAdmin } = useContext(UserContext);

  // console.log("isAdmin", isAdmin);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAdmin) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{ pathname: "/signin", state: { from: props.location } }}
            />
          );
        }
      }}
    />
  );
};

export default AdminRoute;
