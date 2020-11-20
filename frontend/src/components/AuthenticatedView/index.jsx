import { useStoreState } from "easy-peasy";
import { Redirect } from "react-router-dom";

export default function AuthenticatedView({ roles, children, history }) {
  const userRoles = useStoreState((state) => state.roles[0]);
  if (userRoles !== undefined) {
    console.log("Userroles: " + userRoles);
    if (userRoles.includes(roles[0])) {
      return children;
    } else {
      return <p>Unauthorized</p>;
    }
  } else {
    console.log("No roles found");
    return <Redirect to="/login" />;
  }
}
