import { lazy } from "react";

const RootLayout = lazy(() => import("@/layouts/Root"));
const AuthLayout = lazy(() => import("@/layouts/Auth"));

export { RootLayout, AuthLayout };
