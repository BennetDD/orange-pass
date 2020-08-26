import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";

export default function PrivateRoute({ component: RouteComponent, ...rest }) {
  const { currentUser } = useContext(AuthContext);
  let authUser = JSON.parse(localStorage.getItem("authUser"));

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        authUser || !!currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={"/login"} />
        )
      }
    />
  );
}
