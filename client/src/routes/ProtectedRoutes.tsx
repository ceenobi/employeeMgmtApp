import { Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { Navigate, useLocation } from "react-router";

export const PrivateRoutes = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated } = useAuthProvider() as {
    user: Userinfo;
    isAuthenticated: boolean;
  };
  const location = useLocation();

  if (user && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (user && !user?.isVerified) {
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
  const { user, isAuthenticated } = useAuthProvider();
  const location = useLocation();
  const from = location.state?.from || "/";
  if (user && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return children;
};
