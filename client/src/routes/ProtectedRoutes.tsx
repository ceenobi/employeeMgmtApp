import { useSaveToken } from "@/store/stateProvider";
import { Navigate, useLocation } from "react-router";

export const PrivateRoutes = ({ children }: { children: JSX.Element }) => {
  const { token } = useSaveToken() as { token: string };
  const location = useLocation();

  if (!token ) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export const PublicRoutes = ({ children }: { children: JSX.Element }) => {
  const { token } = useSaveToken() as { token: string };
  const location = useLocation();
  const from = location.state?.from || "/";
  if (token) {
    return <Navigate to={from} replace />;
  }

  return children;
};
