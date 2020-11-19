import { useStoreState } from "easy-peasy";

function AuthenticatedView({ roles, children }) {
  const userRoles = useStoreState((state) => state.roles);
  if (userRoles.some((it) => roles.includes(it))) return children;
  return <p>Unauthorized</p>;
}
