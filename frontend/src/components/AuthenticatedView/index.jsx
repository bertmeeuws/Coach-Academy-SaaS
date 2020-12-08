import { useStoreState } from "easy-peasy";
import { Redirect, useHistory } from "react-router-dom";

export default function AuthenticatedView({ roles, children }) {
  const token = useStoreState((state) => state.apollotoken);

  const userRoles = useStoreState((state) => state.roles);
  console.log("User roles: " + userRoles);
  console.log(roles);
  if (userRoles !== []) {
    if (userRoles[0] === roles[0]) {
      console.log("Children returned");
      return children;
    } else {
      if (token === undefined) {
        console.log("Redirect");
        return <Redirect to="/login" />;
      }
      console.log("Redirect");
      return <Redirect to="/login" />;
    }
  } else {
    console.log("Redirect");
    return <Redirect to="/login" />;
  }
}
