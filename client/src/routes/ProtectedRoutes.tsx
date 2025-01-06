import { Userinfo } from "@/emply-types";
import { useAuthProvider } from "@/store/authProvider";
import { useSaveToken } from "@/store/stateProvider";
import { Navigate, useLocation } from "react-router";

export const PrivateRoutes = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated } = useAuthProvider() as {
    user: Userinfo;
    isAuthenticated: boolean;
  };
  const { token } = useSaveToken((state) => state) as { token: string | null };
  const location = useLocation();

  if (!token && !isAuthenticated) {
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
  const { isAuthenticated } = useAuthProvider();
  const { token } = useSaveToken((state) => state) as { token: string | null };
  const location = useLocation();
  const from = location.state?.from || "/";
  if (token && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return children;
};
