import { useStoreState } from "easy-peasy";
import { Redirect } from "react-router-dom";

export default function AuthenticatedView({ roles, children }) {
  const userRoles = useStoreState((state) => state.roles);
  console.log("Vooraf: " + userRoles);
  if (userRoles !== undefined) {
    console.log("We have user roles!");
    console.log("Userroles: " + userRoles[0]);

    if (userRoles.some((it) => roles.includes(it))) {
      console.log(
        "Does role match role of route? " +
          userRoles.some((it) => roles.includes(it))
      );
      return children;
    } else {
      console.log(userRoles.some((it) => roles.includes(it)));
      return <p>Unauthorized</p>;
    }
  } else {
    console.log("No roles found");
    return <Redirect to="/login" />;
  }
}
