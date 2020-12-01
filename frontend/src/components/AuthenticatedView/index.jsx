import { useStoreState } from "easy-peasy";
import { Redirect, useHistory } from "react-router-dom";

export default function AuthenticatedView({ roles, children }) {
  let history = useHistory();

  const token = useStoreState((state) => state.apollotoken);

  const userRoles = useStoreState((state) => state.roles);
  console.log("User roles: " + userRoles);
  if (userRoles !== undefined) {
    if (userRoles.some((it) => roles.includes(it))) {
      return children;
    } else {
      if (token === undefined) {
        return <Redirect to="/login" />;
      }
      return <Redirect to="/login" />;
    }
  } else {
    return <Redirect to="/login" />;
  }
}
