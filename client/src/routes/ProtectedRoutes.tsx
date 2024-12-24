import { Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
// import { useSaveToken } from "@/store/stateProvider";
import { Navigate, useLocation } from "react-router";

export const PrivateRoutes = ({ children }: { children: JSX.Element }) => {
  // const { token } = useSaveToken() as { token: string };
  const { isAuthenticated, user } = useAuthProvider() as {
    user: Userinfo;
    isAuthenticated: boolean;
  };
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (!user?.isVerified) {
    return (
      <Navigate
        to="/verify-redirect"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
};

export const PublicRoutes = ({ children }: { children: JSX.Element }) => {
  // const { token } = useSaveToken() as { token: string };
  const { isAuthenticated } = useAuthProvider();
  const location = useLocation();
  const from = location.state?.from || "/";
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return children;
};
